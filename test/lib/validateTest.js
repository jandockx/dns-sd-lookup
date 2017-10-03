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
// noinspection SpellCheckingInspection
const serviceType = 'a-Serv1ce-type'
const simpleSubType = '_a-sub-service'
const serviceSubTypes = [
  '',
  simpleSubType,
  '_a\\.complex\\\\sub\\.service',
  'sub service type without an underscore' // this is allowed under RFC 6763
]
// noinspection SpellCheckingInspection
const instances = [
  'a-service-instance',
  'A Human Readable Sérvice Instance',
  'instances\\.with\\.escaped\\\\dots\\\\and\\.slashes',
  'instanceThatIsNotLongerThanIsAcceptableWhichIs63CharactersLabel'
]

function generateMaxLength (beforeProtocol) {
  const protocol = '_tcp.'
  let almostTooLong = domain
  const placesLeft = validate.maxLength - almostTooLong.length - protocol.length - beforeProtocol.length - 1
  const times = placesLeft / (validate.maxLabelLength + 1)
  // noinspection SpellCheckingInspection
  const maxLabel = 'abcdefghijklmnopqrstuvwxyz'.repeat(2) + 'abcdefghijk.'
  console.assert(maxLabel.length === validate.maxLabelLength + 1)
  almostTooLong = maxLabel.repeat(times) + almostTooLong
  const rest = (placesLeft % (validate.maxLabelLength + 1)) - 1
  almostTooLong = maxLabel.substring(0, rest) + '.' + almostTooLong
  const notTooLong = `${beforeProtocol}.${protocol}${almostTooLong}`
  console.assert(notTooLong.length === validate.maxLength)
  const tooLong = `${beforeProtocol}.${protocol}z${almostTooLong}`
  console.assert(tooLong.length === validate.maxLength + 1)

  return {not: notTooLong, too: tooLong}
}

// noinspection SpellCheckingInspection
const falseBaseServiceTypes = [
  '',
  '# not _ a domain',
  'notcporupd.' + domain,
  serviceType + '.notcporupd.' + domain,
  '_udp.' + domain,
  '_tcp.' + domain,
  '_thisIsSxteenLong._udp.' + domain,
  '_thisIsSxteenLong._tcp.' + domain,
  '_service spaces._udp.' + domain,
  '_service spaces._tcp.' + domain,
  '_service_undersc._udp.' + domain,
  '_service_undersc._tcp.' + domain,
  '_service,comma._udp.' + domain,
  '_double--dash._tcp.' + domain,
  'notStartWith_._udp.' + domain,
  'notStartWith_._tcp.' + domain,
  '_-dash._tcp.' + domain,
  '_dash-._tcp.' + domain,
  '_9number._tcp.' + domain,
  '_number9._tcp.' + domain,
  `_${serviceType}._udp.a.thisIs999NotATld`,
  `_${serviceType}._udp.a.domain_with.an.underscore.com`
]

describe('validate', function () {
  it('has the expected properties', function () {
    validate.must.have.property('subtypeOrInstance')
    validate.subtypeOrInstance.must.be.a.regexp()
    validate.must.have.property('serviceType')
    validate.serviceType.must.be.a.regexp()
    validate.must.have.property('serviceInstance')
    validate.serviceInstance.must.be.a.regexp()
  })
  describe('#isSubtypeOrInstanceName', function () {
    describe('true', function () {
      serviceSubTypes
        .concat(instances)
        .filter(i => !!i)
        .forEach(subtypeOrInstance => {
          it(`returns true for ${subtypeOrInstance}`, function () {
            const result = validate.isSubtypeOrInstanceName(subtypeOrInstance)
            console.log('%s --> %s', subtypeOrInstance, result)
            result.must.be.true()
          })
        })
    })
    describe('false', function () {
      const falsies = [
        null,
        undefined,
        '',
        // since we know that we delegate here to isBaseServiceType, we do not need to test the variants (white box)
        'anInstanceThatIsLongerThanIsAcceptableWhichIs63ACharactersLabels',
        'contains.an.unescaped.dot._service',
        'contains\\unescaped\\backslash._service'
      ]
      falsies.forEach(falsy => {
        it(`returns false for ${falsy}`, function () {
          const result = validate.isSubtypeOrInstanceName(falsy)
          console.log('%s --> %s', falsy, result)
          result.must.be.false()
        })
      })
    })
  })
  describe('#isBaseServiceType', function () {
    const tooLong = generateMaxLength('_' + serviceType)

    describe('true', function () {
      protocols.forEach(protocol => {
        const candidate = `_${serviceType}._${protocol}.${domain}`
        it(`returns true for ${candidate}`, function () {
          const result = validate.isBaseServiceType(candidate)
          console.log('%s --> %s', candidate, result)
          result.must.be.true()
        })
      })
      it(`returns true for the max length`, function () {
        const result = validate.isBaseServiceType(tooLong.not)
        console.log('%s --> %s', tooLong.not, result)
        result.must.be.true()
      })
      const lookupCase = '_t1i-no-sub._tcp.dns-sd-lookup.toryt.org'
      it(`returns true for the lookup case`, function () {
        const result = validate.isBaseServiceType(lookupCase)
        console.log('%s --> %s', lookupCase, result)
        result.must.be.true()
      })
    })
    describe('false', function () {
      // noinspection SpellCheckingInspection
      const fqdns = falseBaseServiceTypes.concat([
        null,
        undefined,
        tooLong.too
      ])
      fqdns.forEach(fqdn => {
        it(`returns false for ${fqdn}`, function () {
          const result = validate.isBaseServiceType(fqdn)
          console.log('%s --> %s', fqdn, result)
          result.must.be.false()
        })
      })
    })
  })

  describe('#isServiceType', function () {
    const tooLongWithoutSub = generateMaxLength('_' + serviceType)
    const tooLongWithSub = generateMaxLength(simpleSubType + '._sub._' + serviceType)

    describe('true', function () {
      // noinspection JSUnresolvedFunction
      const fqdns = x({
        sub: serviceSubTypes,
        protocol: protocols
      }).map(c =>
        c.sub ? `${c.sub}._sub._${serviceType}._${c.protocol}.${domain}` : `_${serviceType}._${c.protocol}.${domain}`
      )
      fqdns.forEach(fqdn => {
        it(`returns true for ${fqdn}`, function () {
          const result = validate.isServiceType(fqdn)
          console.log('%s --> %s', fqdn, result)
          result.must.be.true()
        })
      })
      it(`returns true for the max length`, function () {
        const result = validate.isServiceType(tooLongWithoutSub.not)
        console.log('%s --> %s', tooLongWithoutSub.not, result)
        result.must.be.true()
      })
      it(`returns true for the max length with sub`, function () {
        const result = validate.isServiceType(tooLongWithoutSub.not)
        console.log('%s --> %s', tooLongWithSub.not, result)
        result.must.be.true()
      })
      const lookupCase = '_t1i-no-sub._tcp.dns-sd-lookup.toryt.org'
      it(`returns true for the lookup case`, function () {
        const result = validate.isServiceType(lookupCase)
        console.log('%s --> %s', lookupCase, result)
        result.must.be.true()
      })
    })
    describe('false', function () {
      const fqdns = falseBaseServiceTypes.concat([
        null,
        undefined,
        tooLongWithoutSub.too,
        tooLongWithSub.too
      ])
      .concat(falseBaseServiceTypes.map(t => `${simpleSubType}._sub.${t}`))
      .concat([
        'unescaped.dot',
        'unescaped\\backslash',
        'ThisIsLongerThanTheMaximumLengthWhichIs63CharactersForAnDNSLabel'
      ].map(s => `${s}._sub._${serviceType}._tcp.${domain}`))
      fqdns.forEach(fqdn => {
        it(`returns false for ${fqdn}`, function () {
          const result = validate.isServiceType(fqdn)
          console.log('%s --> %s', fqdn, result)
          result.must.be.false()
        })
      })
    })
  })

  describe('#isServiceInstance', function () {
    const tooLong = generateMaxLength(`${instances[0]}._${serviceType}`)

    describe('true', function () {
      // noinspection JSUnresolvedFunction
      const fqdns = x({
        instance: instances,
        protocol: protocols
      }).map(c => `${c.instance}._${serviceType}._${c.protocol}.${domain}`)
      fqdns.forEach(candidate => {
        it(`returns true for ${candidate}`, function () {
          const result = validate.isServiceInstance(candidate)
          console.log('%s --> %s', candidate, result)
          result.must.be.true()
        })
      })
      it(`returns true for the max length`, function () {
        const result = validate.isServiceInstance(tooLong.not)
        console.log('%s --> %s', tooLong.not, result)
        result.must.be.true()
      })
      const lookupCase = 'instance 1._t1i-no-sub._tcp.dns-sd-lookup.toryt.org'
      it(`returns true for the lookup case`, function () {
        const result = validate.isServiceInstance(lookupCase)
        console.log('%s --> %s', lookupCase, result)
        result.must.be.true()
      })
    })
    describe('false', function () {
      const fqdns = [
        null,
        undefined,
        '',
        'instance.not.a.service',
        // since we know that we delegate here to isBaseServiceType, we do not need to test the variants (white box)
        'anInstanceThatIsLongerThanIsAcceptableWhichIs63ACharactersLabels._service._tcp.' + domain,
        tooLong.too,
        'contains.an.unescaped.dot._service._tcp.' + domain,
        'contains\\unescaped\\backslash._service._tcp.' + domain
      ]
      fqdns.forEach(fqdn => {
        it(`returns false for ${fqdn}`, function () {
          const result = validate.isServiceInstance(fqdn)
          console.log('%s --> %s', fqdn, result)
          result.must.be.false()
        })
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
