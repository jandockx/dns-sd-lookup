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
// noinspection JSUnresolvedVariable
const discoverContract = discover.contract

// noinspection SpellCheckingInspection
const serviceTypePostfix = '._tcp.dns-sd-lookup.toryt.org'
// noinspection SpellCheckingInspection
const serviceType = '_t1i-no-sub' + serviceTypePostfix

describe('discover', function () {
  it('works in the nominal case', function () {
    // noinspection JSUnresolvedVariable
    return discover(serviceType).must.fulfill(discoverContract.resolved.implementation(details => {
      details.must.be.an.array()
      details.must.have.length(1)
      console.log(details)
    }))
  })
  it('resolves to the empty array with a non-existent service type', function () {
    // noinspection JSUnresolvedVariable
    return discover('_not-exist' + serviceTypePostfix)
      .must.fulfill(discoverContract.resolved.implementation(details => {
        details.must.be.an.array()
        details.must.be.empty()
        console.log(details)
      }))
  })
  it('works with a death in the nominal case', function () { // MUDO
    // noinspection JSUnresolvedVariable
    return discover(serviceType, ['test_instance_unit_test1a._tcp.dns-sd-lookup.toryt.org'])
      .must.fulfill(discoverContract.resolved(details => {
        details.must.be.an.array()
        console.log(details)
      }))
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
      return discover(serviceType).must.betray(discoverContract.rejected.implementation(err => {
        console.log(err)
      }))
    })
  })
})
