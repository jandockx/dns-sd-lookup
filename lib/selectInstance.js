const discover = require('./discover')

function orderByPriority (a, b) {
  return (a === b || a.priority === b.priority)
    ? 0
    : ((a.priority < b.priority)
       ? -1
       : +1) // b.priority < a.priority)
}

function selectInstance (/* String */ serviceType, /* Array<String># */ deathInstances) {
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
      grouped.forEach(group => {
        group.select = function () {
          const rand = Math.random() * this.totalWeight
          let denominator = 0
          for (let i = 0; i < this.length; i++) {
            denominator += this[i].weight
            if (rand < denominator) {
              return this[i]
            }
          }
        }
      })
      return grouped
    })
}

module.exports = selectInstance
