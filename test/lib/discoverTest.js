/* eslint-env mocha */

const discover = require('../../lib/discover')
const ServiceInstance = require('../../lib/ServiceInstance')

// noinspection SpellCheckingInspection
const serviceType = '_test._sub._unittest._tcp.dns-sd-lookup.toryt.org'

describe('discover', function () {
  it('works in the nominal case', function () {
    // noinspection JSUnresolvedVariable
    return discover(serviceType).must.fulfill(details => {
      details.must.be.an.array()
      details.forEach(d => d.must.be.an.instanceof(ServiceInstance))
      console.log(details)
    })
  })
  it('works with a death in the nominal case', function () {
    // noinspection JSUnresolvedVariable
    return discover(serviceType, ['test_instance_unit_test1a._tcp.dns-sd-lookup.toryt.org']).must.fulfill(details => {
      details.must.be.an.array()
      console.log(details)
    })
  })
})
