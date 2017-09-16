const denodeify = require('denodeify')
const resolvePtr = denodeify(require('dns').resolvePtr)
const lookupInstance = require('./lookupInstance')
const ServiceInstance = require('./ServiceInstance')

function discover (/* !string */ serviceType, /* string[]= */ deathInstances) {
  // noinspection JSUnresolvedFunction
  return resolvePtr(serviceType).then(response => {
    // noinspection JSUnresolvedFunction
    return Promise.all(
      response
        .filter(instanceName => !deathInstances || deathInstances.indexOf(instanceName) < 0)
        .map(instanceName =>
          lookupInstance(instanceName)
            .catch(err => err)
            .then(instance => {
              const kwargs = Object.create(instance)
              kwargs.type = serviceType
              return new ServiceInstance(kwargs)
            })
        )
    )
  })
}

module.exports = discover
