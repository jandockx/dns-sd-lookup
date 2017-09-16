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
