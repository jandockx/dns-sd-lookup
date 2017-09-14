const denodeify = require('denodeify')
const resolvePtr = denodeify(require('dns').resolvePtr)
const lookupInstance = require('./lookupInstance')

function discover (/* String */ serviceType, /* Array<String># */ deathInstances) {
  // noinspection JSUnresolvedFunction
  return resolvePtr(serviceType).then(response => {
    // noinspection JSUnresolvedFunction
    return Promise.all(
      response
        .filter(instanceName => !deathInstances || deathInstances.indexOf(instanceName) < 0)
        .map(instanceName =>
          lookupInstance(instanceName)
            .catch(err => err)
            .then(instance => Object.assign({type: serviceType}, instance))
        )
    ).then(instances => {
      instances.sort((a, b) => {
        if (a === b || a.priority === b.priority) {
          return 0
        }
        if (a instanceof Error) {
          return +1
        }
        if (b instanceof Error) {
          return -1
        }
        if (a.priority < b.priority) {
          return -1
        }
        // b.priority < a.priority)
        return +1
      })
      const grouped = []
      let groupedIndex = -1
      for (let i = 0; i < instances.length; i++) {
        if (instances[i] instanceof Error) {
          groupedIndex++
          grouped[groupedIndex] = instances[i]
        } else if (groupedIndex >= 0 && instances[i].priority === grouped[groupedIndex].priority) {
          grouped[groupedIndex].push(instances[i])
          grouped[groupedIndex].totalWeight += instances[i].weight
        } else {
          groupedIndex++
          grouped[groupedIndex] = [instances[i]]
          grouped[groupedIndex].priority = instances[i].priority
          grouped[groupedIndex].totalWeight = instances[i].weight
        }
      }
      grouped.forEach(group => {
        group.choose = function () {

        }
      })
      return grouped
    })
  })
}

module.exports = discover
