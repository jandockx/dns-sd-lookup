const discover = require('./discover')

function orderByPriority (a, b) {
  return (a === b || a.priority === b.priority)
    ? 0
    : ((a.priority < b.priority)
       ? -1
       : +1) // b.priority < a.priority)
}

function selectByWeight (/* !Object[] */ instances) {
  const rand = Math.random() * instances.totalWeight
  let denominator = 0
  for (let i = 0; i < instances.length; i++) {
    denominator += instances[i].weight
    if (rand < denominator) {
      return instances[i]
    }
  }
  return undefined
}

function selectInstance (/* !string */ serviceType, /* string[]= */ deathInstances) {
  return discover(serviceType, deathInstances)
    .then(instances => {
      const sorted = instances
        .filter(i => !(i instanceof Error))
        .sort(orderByPriority)
      if (sorted.length <= 0) {
        return undefined
      }
      const highestPriorityInstances = sorted.filter(i => i.priority === sorted[0].priority)
      highestPriorityInstances.totalWeight = highestPriorityInstances.reduce(
        (acc, i) => {
          acc += i.weight
          return acc
        },
        0
      )
      return selectByWeight(highestPriorityInstances)
    })
}

module.exports = selectInstance
