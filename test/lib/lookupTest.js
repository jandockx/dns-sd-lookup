/* eslint-env mocha */

const lookup = require('../../lib/lookup')

// noinspection SpellCheckingInspection
const serviceType = '_test._sub._unittest._tcp.dns-sd-lookup.toryt.org'

describe('lookup', function () {
  it('works in the nominal case', function () {
    // noinspection JSUnresolvedVariable
    return lookup(serviceType).must.fulfill(details => {
      details.must.be.an.array()
    })
  })
})
