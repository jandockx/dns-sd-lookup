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

const extract = require('../../lib/extract')
const x = require('cartesian')
const must = require('must')

const domain = 'dns-sd-lookup.toryt.org'
const protocols = ['tcp', 'udp']
const serviceType = 'a-service-type'
const serviceSubTypes = [
  '',
  '_a-sub-service',
  '_a\\.complex\\.sub\\.service',
  'sub service type without an underscore' // this is allowed under RFC 6763
]
// noinspection SpellCheckingInspection
const instances = [
  'a-service-instance',
  'A Human Readable Sérvice Instance'
]

function createService (prefix) {
  return prefix ? `${prefix}._${serviceType}` : `_${serviceType}`
}

function createSubPrefix (subtype) {
  return subtype ? `${subtype}._sub` : ''
}

const services = serviceSubTypes.map(createSubPrefix).concat(instances).map(createService)

function createFqdn (c) {
  return `${c.service}._${c.protocol}.${domain}`
}

describe('extract', function () {
  describe('#domain', function () {
    // noinspection JSUnresolvedFunction
    const fqdns = x({
      service: services,
      protocol: protocols
    }).map(createFqdn)
    fqdns.forEach(fqdn => {
      it(`works as expected for ${fqdn}`, function () {
        const result = extract.domain(fqdn)
        console.log('%s --> %s', fqdn, result)
        result.must.equal(domain)
      })
    })
  })

  describe('#protocol', function () {
    const cases = x({
      service: services,
      protocol: protocols
    })
    // noinspection JSUnresolvedFunction
    cases.forEach(c => {
      const fqdn = createFqdn(c)
      it(`works as expected for ${fqdn}`, function () {
        const result = extract.protocol(fqdn)
        console.log('%s --> %s', fqdn, result)
        result.must.equal(c.protocol)
      })
    })
  })

  describe('#type', function () {
    const cases = x({
      service: services,
      protocol: protocols
    })
    // noinspection JSUnresolvedFunction
    cases.forEach(c => {
      const fqdn = createFqdn(c)
      it(`works as expected for ${fqdn}`, function () {
        const result = extract.type(fqdn)
        console.log('%s --> %s', fqdn, result)
        result.must.equal(serviceType)
      })
    })
  })

  describe('#instance', function () {
    const cases = x({
      instance: instances,
      protocol: protocols
    })
    // noinspection JSUnresolvedFunction
    cases.forEach(c => {
      const fqdn = createFqdn({
        service: createService(c.instance),
        protocol: c.protocol
      })
      it(`works as expected for ${fqdn}`, function () {
        const result = extract.instance(fqdn)
        console.log('%s --> %s', fqdn, result)
        result.must.equal(c.instance)
      })
    })
  })

  describe('#subtype', function () {
    const cases = x({
      subtype: serviceSubTypes,
      protocol: protocols
    })
    // noinspection JSUnresolvedFunction
    cases.forEach(c => {
      const fqdn = createFqdn({
        service: createService(createSubPrefix(c.subtype)),
        protocol: c.protocol
      })
      it(`works as expected for ${fqdn}`, function () {
        const result = extract.subtype(fqdn)
        console.log('%s --> %s', fqdn, result)
        if (c.subtype) {
          result.must.equal(c.subtype)
        } else {
          must(result).be.undefined()
        }
      })
    })
  })
})
