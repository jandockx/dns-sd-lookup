/* eslint-env mocha */

const selectInstance = require('../../lib/selectInstance')

// noinspection SpellCheckingInspection
const serviceType = '_test._sub._unittest._tcp.dns-sd-lookup.toryt.org'

describe('selectInstance', function () {
  it('selects according to weight', function () {
    // noinspection JSUnresolvedVariable
    return selectInstance(serviceType, ['test_instance_unit_test0._tcp.dns-sd-lookup.toryt.org']).must.fulfill(details => {
      details.must.be.an.object()
      console.log(details)
    })
  })
})
