const denodeify = require('denodeify')
const resolveSrv = denodeify(require('dns').resolveSrv)
const resolveTxt = denodeify(require('dns').resolveTxt)
const ServiceInstance = require('./ServiceInstance')
const extract = require('./extract')

function exactly1 (/* !string */ serviceInstance, /* !string */ recordType, /* !Function */ resolver) {
  return resolver(serviceInstance)
    .then(records => {
      if (records.length > 1) {
        const err = new Error(`received more than 1 %s record`, recordType)
        err.instance = serviceInstance
        err.count = records.length
        throw err
      }
      return records[0]
    })
}

function lookupInstance (/* !string */ serviceInstance) {
  // noinspection JSUnresolvedFunction
  return Promise.all([
    exactly1(serviceInstance, 'SRV', resolveSrv),
    exactly1(serviceInstance, 'TXT', resolveTxt)
      .then(txt => txt.reduce(
        (acc, r) => {
          const parts = r.split('=')
          const key = parts.shift()
          acc[key] = parts.join('=')
          return acc
        },
        {}
      ))
  ])
  .catch(cause => {
    const err = new Error('could not resolve SRV and/or TXT record')
    err.instance = serviceInstance
    err.cause = cause
    throw err
  })
  .then(data => new ServiceInstance({
    type: `_${extract.type(serviceInstance)}._${extract.protocol(serviceInstance)}.${extract.domain(serviceInstance)}`,
    instance: serviceInstance,
    host: data[0].name,
    port: data[0].port,
    priority: data[0].priority,
    weight: data[0].weight,
    details: data[1]
  }))
}

module.exports = lookupInstance
