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
    it('works on a good part', function () {
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
      it('fails on wrong part ' + part, function () {
        const result = validate.isValidDomainNamePart(part)
        result.must.be.false()
      })
    })
  })

})
