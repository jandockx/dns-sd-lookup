/* eslint-env mocha */

const selectInstance = require('../../lib/selectInstance')

// noinspection SpellCheckingInspection
const serviceType = '_test._sub._unittest._tcp.dns-sd-lookup.toryt.org'

describe('selectInstance', function () {
  it('selects according to weight', function () {
    // noinspection JSUnresolvedVariable
    return selectInstance(serviceType, ['test_instance_unit_test0._tcp.dns-sd-lookup.toryt.org']).must.fulfill(details => {
      details.must.be.an.array()
      details[0].forEach(d => { d.selected = 0 })
      for (let i = 0; i < 10000000; i++) {
        details[0].select().selected++
      }
      console.log(details[0].map(d => ({weight: d.weight, selected: d.selected})))
    })
  })
})
