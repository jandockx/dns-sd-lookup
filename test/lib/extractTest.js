/* eslint-env mocha */

const extract = require('../../lib/extract')
const x = require('cartesian')

const domain = 'dns-sd-lookup.toryt.org'
const protocols = ['tcp', 'udp']
const serviceType = 'a-service-type'
const serviceSubTypes = [
  '',
  '_a-sub-service._sub',
  '_a.complex.sub.service._sub'
]
// noinspection SpellCheckingInspection
const instances = [
  'a-service-instance',
  'A Human Readable Sérvice Instance'
]

function createService (prefix) {
  return prefix ? `${prefix}._${serviceType}` : `_${serviceType}`
}

const services = serviceSubTypes.concat(instances).map(createService)

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
})
