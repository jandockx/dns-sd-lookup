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
      const grouped = []
      let groupedIndex = -1
      for (let i = 0; i < sorted.length; i++) {
        if (groupedIndex >= 0 && sorted[i].priority === grouped[groupedIndex].priority) {
          grouped[groupedIndex].push(sorted[i])
          grouped[groupedIndex].totalWeight += sorted[i].weight
        } else {
          groupedIndex++
          grouped[groupedIndex] = [sorted[i]]
          grouped[groupedIndex].priority = sorted[i].priority
          grouped[groupedIndex].totalWeight = sorted[i].weight
        }
      }
      return selectByWeight(grouped[0])
    })
}

module.exports = selectInstance
