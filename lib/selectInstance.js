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
      instances
      .filter(i => !(i instanceof Error))
      .sort(orderByPriority)
      const grouped = []
      let groupedIndex = -1
      for (let i = 0; i < instances.length; i++) {
        if (groupedIndex >= 0 && instances[i].priority === grouped[groupedIndex].priority) {
          grouped[groupedIndex].push(instances[i])
          grouped[groupedIndex].totalWeight += instances[i].weight
        } else {
          groupedIndex++
          grouped[groupedIndex] = [instances[i]]
          grouped[groupedIndex].priority = instances[i].priority
          grouped[groupedIndex].totalWeight = instances[i].weight
        }
      }
      return selectByWeight(grouped[0])
    })
}

module.exports = selectInstance
