/*
 * MIT License
 *
 * Copyright (c) 2017-2017 Jan Dockx
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

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
      let highestPriorityInstances = []
      highestPriorityInstances.totalWeight = 0
      highestPriorityInstances = sorted.reduce(
        (acc, i) => {
          if (i.priority === sorted[0].priority) {
            acc.push(i)
            acc.totalWeight += i.weight
          }
          return acc
        },
        highestPriorityInstances
      )
      return selectByWeight(highestPriorityInstances)
    })
}

module.exports = selectInstance
