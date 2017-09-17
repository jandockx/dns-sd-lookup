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

const validate = require('../../lib/validate')
const x = require('cartesian')

const domain = 'dns-sd-lookup.toryt.org'
const protocols = ['tcp', 'udp']
const serviceType = 'a-service-type'
const serviceSubTypes = [
  '',
  '_a-sub-service',
  '_a.complex.sub.service',
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

describe('validate', function () {
  describe('#isServiceTypeOrInstanceFqdn', function () {
    describe('true', function () {
        // noinspection JSUnresolvedFunction
      const fqdns = x({
        service: services,
        protocol: protocols
      }).map(createFqdn)
      fqdns.forEach(fqdn => {
        it(`returns true for ${fqdn}`, function () {
          const result = validate.isServiceTypeOrInstanceFqdn(fqdn)
          console.log('%s --> %s', fqdn, result)
          result.must.be.true()
        })
      })
    })
    describe('false', function () {
      // noinspection SpellCheckingInspection
      const fqdns = [
        null,
        undefined,
        '',
        '# not _ a domain',
        'notcporupd.' + domain,
        serviceType + '.notcporupd.' + domain,
        '_udp.' + domain,
        '_tcp.' + domain,
        '_service contains spaces._udp.' + domain,
        '_service contains spaces._tcp.' + domain,
        'serviceDoesNotStartWith_._udp.' + domain,
        'serviceDoesNotStartWith_._tcp.' + domain
      ]
      fqdns.forEach(fqdn => {
        it(`returns false for ${fqdn}`, function () {
          const result = validate.isServiceTypeOrInstanceFqdn(fqdn)
          console.log('%s --> %s', fqdn, result)
          result.must.be.false()
        })
      })
    })
  })

  describe('#isValidDomainNamePart', function () {
    it('true on a good part', function () {
      const result = validate.isValidDomainNamePart('a-valid09-€₰૱εέ𒀪©∭∏∇𐡀☯°廓DOMAIN-é--name-part')
      result.must.be.true()
    })
    const wrongParts = [
      '-starts-with-a-dash',
      'ends-with-a-dash-',
      'has-a-(-character',
      'has-a-}-character',
      'has-a-.-character',
      'has-a-]-character',
      'has-a-_-character',
      'has-a-+-character',
      'has-a-%20-character',
      'has-a-%-character',
      'has-a- -space'
    ]
    wrongParts.forEach(part => {
      it('false on wrong part ' + part, function () {
        const result = validate.isValidDomainNamePart(part)
        result.must.be.false()
      })
    })
  })

  describe('#isNatural', function () {
    const rights = [
      0,
      1,
      34e34,
      Number.MAX_SAFE_INTEGER,
      Number.MAX_VALUE
    ]
    rights.forEach(nr => {
      it('true on ' + nr, function () {
        const result = validate.isNatural(nr)
        result.must.be.true()
      })
    })
    const rights2 = [
      0,
      1,
      4
    ]
    rights2.forEach(nr => {
      it('true on ' + nr + ' with a maximum', function () {
        const result = validate.isNatural(nr, 4)
        result.must.be.true()
      })
    })
    const wrongs = [
      undefined,
      null,
      {},
      '',
      'string',
      new Date(),
      true,
      false,
      /abc/,
      Math.PI,
      3 / 5,
      Number.POSITIVE_INFINITY,
      -1,
      -Math.PI,
      Number.MIN_VALUE,
      Number.MIN_SAFE_INTEGER,
      Number.NEGATIVE_INFINITY,
      Number.NaN
    ]
    wrongs.forEach(w => {
      it('false on ' + w, function () {
        const result = validate.isNatural(w)
        result.must.be.false()
      })
    })
    const wrongs2 = [
      5,
      34e34,
      Number.MAX_SAFE_INTEGER,
      Number.MAX_VALUE
    ]
    wrongs2.forEach(w => {
      it('false on ' + w + ' with a maximum', function () {
        const result = validate.isNatural(w, 4)
        result.must.be.false()
      })
    })
  })
})
