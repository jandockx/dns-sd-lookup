/* eslint-env mocha */

const extract = require('../../lib/extract')
const x = require('cartesian')

const domain = 'dns-sd-lookup.toryt.org'
const protocols = ['tcp', 'udp']
const serviceType = 'a-service-type'
// noinspection SpellCheckingInspection
const prefix = [
  '',
  '_a-sub-service._sub',
  '_a.complex.sub.service._sub',
  'a-service-instance',
  'A Human Readable Sérvice Type'
]
const services = prefix.map(p => p ? `${p}._${serviceType}` : `_${serviceType}`)

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
})
