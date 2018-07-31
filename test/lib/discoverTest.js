/*
 * MIT License
 *
 * Copyright (c) 2017-2017 Jan Dockx
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/* eslint-env mocha */

const discover = require('../../lib/discover')
const verifyPostconditions = require('../_util/verifyPostconditions')

// noinspection SpellCheckingInspection
const serviceTypePostfix = '._tcp.dns-sd-lookup.toryt.org'
// noinspection SpellCheckingInspection
const serviceType = '_t1i-no-sub' + serviceTypePostfix
const manyInstanceServiceType = '_t8i-n-inst' + serviceTypePostfix
const manyInstanceCount = 12

describe('discover', function () {
  describe('#notOneOf', function () {
    verifyPostconditions(discover.notOneOf)

    const instanceName = 'candidate instance._type._tcp.dns-sd-lookup.toryt.org'

    it('works with the empty array', function () {
      const deathInstances = []
      const result = discover.notOneOf(deathInstances)
      result.must.be.a.function()
      const secondaryResult = result(instanceName)
      secondaryResult.must.be.boolean()
      secondaryResult.must.be.true()
    })
    it('works with a non-empty array, without a match', function () {
      const deathInstances = [
        'death instance 1._type._tcp.dns-sd-lookup.toryt.org',
        'death instance 2._type._tcp.dns-sd-lookup.toryt.org',
        'death instance 3._type._tcp.dns-sd-lookup.toryt.org'
      ]
      const result = discover.notOneOf(deathInstances)
      result.must.be.a.function()
      const secondaryResult = result(instanceName)
      secondaryResult.must.be.boolean()
      secondaryResult.must.be.true()
    })
    it('works with a non-empty array, with a match', function () {
      const deathInstances = [
        'death instance 1._type._tcp.dns-sd-lookup.toryt.org',
        instanceName,
        'death instance 3._type._tcp.dns-sd-lookup.toryt.org'
      ]
      const result = discover.notOneOf(deathInstances)
      result.must.be.a.function()
      const secondaryResult = result(instanceName)
      secondaryResult.must.be.boolean()
      secondaryResult.must.be.false()
    })
  })
  describe('main method', function () {
    verifyPostconditions(discover)

    it('works in the nominal case, without a subtype', function () {
      // noinspection JSUnresolvedVariable
      return discover(serviceType).must.fulfill(details => {
        details.must.be.an.array()
        details.must.have.length(1)
        console.log(details)
      })
    })
    it('works in the nominal case, with a subtype', function () {
      const serviceType = `_subtype._sub._t7i-sub${serviceTypePostfix}`
      // noinspection JSUnresolvedVariable
      return discover(serviceType).must.fulfill(details => {
        details.must.be.an.array()
        details.must.have.length(1)
        console.log(details)
      })
    })
    it(`works in the nominal case, with ${manyInstanceCount} instances`, function () {
      this.timeout(10000)

      // noinspection JSUnresolvedVariable
      return discover(manyInstanceServiceType).must.fulfill(details => {
        details.must.be.an.array()
        details.must.have.length(manyInstanceCount)
        console.log(details)
      })
    })
    it('resolves to the empty array with a non-existent service type', function () {
      // noinspection JSUnresolvedVariable
      return discover('_not-exist' + serviceTypePostfix)
        .must.fulfill(details => {
          details.must.be.an.array()
          details.must.be.empty()
          console.log(details)
        })
    })
    it('works with a filter in the nominal case', function () {
      const deaths = [
        `Instance 8c.${manyInstanceServiceType}`,
        `Instance 8e.${manyInstanceServiceType}`,
        `Instance 8g.${manyInstanceServiceType}`,
        `Instance 8h.${manyInstanceServiceType}`,
        `Instance 8i.${manyInstanceServiceType}`,
        `Instance 8k.${manyInstanceServiceType}`,
        `Instance 8l.${manyInstanceServiceType}`
      ]
      // noinspection JSUnresolvedVariable
      return discover(manyInstanceServiceType, discover.notOneOf(deaths))
        .must.fulfill(details => {
          details.must.be.an.array()
          details.must.have.length(manyInstanceCount - deaths.length)
          details.forEach(d => deaths.must.not.contain(d.instance))
          console.log(details)
        })
    })
    it('works with a filter in the nominal case that excludes all instances', function () {
      const deaths = [
        `Instance 8c.${manyInstanceServiceType}`,
        `Instance 8e.${manyInstanceServiceType}`,
        `Instance 8c.${manyInstanceServiceType}`,
        `Instance 8a.${manyInstanceServiceType}`,
        `Instance 8f.${manyInstanceServiceType}`,
        `Instance 8e.${manyInstanceServiceType}`,
        `Instance 8j.${manyInstanceServiceType}`,
        `Instance 8i.${manyInstanceServiceType}`,
        `Instance 8e.${manyInstanceServiceType}`,
        `Instance 8g.${manyInstanceServiceType}`,
        `Instance 8k.${manyInstanceServiceType}`,
        `Instance 8h.${manyInstanceServiceType}`,
        `Instance 8d.${manyInstanceServiceType}`,
        `Instance 8l.${manyInstanceServiceType}`,
        `Instance 8b.${manyInstanceServiceType}`
      ]
      // noinspection JSUnresolvedVariable
      return discover(manyInstanceServiceType, discover.notOneOf(deaths))
        .must.fulfill(details => {
          details.must.be.an.array()
          details.must.be.empty()
          console.log(details)
        })
    })

    let failures = [
      't2i-2-txt',
      't3i-2-srv',
      't4i-2-txt-srv',
      't5i-no-txt',
      't6i-no-srv'
    ]
    failures = failures.map(f => `_${f}${serviceTypePostfix}`)
    failures.forEach(serviceType => {
      it(`fails for instance type ${serviceType}`, function () {
        // noinspection JSUnresolvedVariable
        return discover(serviceType).must.betray(err => {
          console.log(err)
        })
      })
    })
    const aFailure = failures[0]
    it(`fails for instance type ${aFailure} with a filter`, function () {
      const filter = discover.contract.filter.implementation(instance => instance.indexOf(aFailure) >= 0)
      filter.contract.verifyPostconditions = true
      // noinspection JSUnresolvedVariable
      return discover(aFailure, filter)
        .must.betray(err => {
          console.log(err)
          err.instance.must.contain(aFailure)
        })
    })
  })
})
