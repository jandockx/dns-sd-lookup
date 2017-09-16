/* eslint-env mocha */

const extract = require('../../lib/extract')
const x = require('cartesian')

describe('extract', function () {
  describe('#domain', function () {
    const domain = 'dns-sd-lookup.toryt.org'
    const protocols = ['_tcp', '_udp']
    const serviceType = '_a-service-type'
    // noinspection SpellCheckingInspection
    const prefix = [
      '',
      '_a-sub-service._sub',
      '_a.complex.sub.service._sub',
      'a-service-instance',
      'A Human Readable Sérvice Type'
    ]
    // noinspection JSUnresolvedFunction
    const fqdns = x({
      service: prefix.map(p => p ? p + '.' + serviceType : serviceType),
      protocol: protocols
    }).map(c => `${c.service}.${c.protocol}.${domain}`)
    fqdns.forEach(fqdn => {
      it(`works as expected for ${fqdn}`, function () {
        const result = extract.domain(fqdn)
        console.log('%s --> %s', fqdn, result)
        result.must.equal(domain)
      })
    })
  })
})
