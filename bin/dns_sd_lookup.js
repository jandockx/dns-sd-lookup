#!/usr/bin/env node

const lookup = require('../lib/lookup')

// noinspection SpellCheckingInspection
const serviceTypes = [
  '_test._sub._unittest._tcp.dns-sd-lookup.toryt.org'
]

// noinspection JSUnresolvedFunction
Promise
  .all(serviceTypes.map(serviceType => lookup(serviceType)))
  .catch(err => {
    console.error(err)
  })
  .then(results => {
    console.log(results)
  })
