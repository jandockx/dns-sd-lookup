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

const Contract = require('@toryt/contracts-iv')
const PromiseContract = require('@toryt/contracts-iv').Promise
const validate = require('./validate')
const ServiceInstance = require('./ServiceInstance')
const discover = require('./discover')
// noinspection JSUnresolvedVariable
const discoverContract = discover.contract
// noinspection JSUnresolvedVariable
const lookupInstanceContract = require('./lookupInstance').contract

const selectInstanceContract = new PromiseContract({
  pre: [
    validate.isServiceType,
    // noinspection JSUnresolvedVariable
    (serviceType, filter) => !filter || selectInstanceContract.filter.isImplementedBy(filter)
  ],
  post: [
    function () {
      const resolution = PromiseContract.outcome(arguments)
      return resolution === null || PromiseContract.outcome(arguments) instanceof ServiceInstance
    },
    function (serviceType) {
      const resolution = PromiseContract.outcome(arguments)
      return resolution === null || resolution.type === serviceType
    },
    function (serviceType, filter) {
      const resolution = PromiseContract.outcome(arguments)
      return resolution === null || arguments.length < 4 || filter(resolution.instance)
    }
  ],
  exception: [
    function () { return PromiseContract.outcome(arguments) instanceof Error },
    function () { return PromiseContract.outcome(arguments).message === lookupInstanceContract.notValidMessage },
    function () { return PromiseContract.outcome(arguments).cause instanceof Error },
    function (serviceType, filter) { return arguments.length < 4 || filter(PromiseContract.outcome(arguments).instance) }
  ]
})
selectInstanceContract.filter = discoverContract.filter

function orderByPriority (a, b) {
  return (a === b || a.priority === b.priority)
    ? 0
    : ((a.priority < b.priority)
      ? -1
      : +1) // b.priority < a.priority)
}

const selectByWeight = new Contract({
  pre: [
    function (instances) { return Array.isArray(instances) },
    function (instances) { return instances.length >= 1 },
    function (instances) { return instances.every(i => i instanceof ServiceInstance) }
  ],
  post: [
    function (instances, result) { return result instanceof ServiceInstance },
    function (instances, result) { return instances.indexOf(result) >= 0 }
  ]
}).implementation(function selectByWeight (/* [ServiceInstance] */ instances) {
  const totalWeight = instances.reduce((acc, i) => acc + i.weight, 0)
  if (totalWeight <= 0) {
    // totalWeight === 0, and all instances will have weight 0 - random selection
    return instances[Math.floor(Math.random() * instances.length)]
  }
  const rand = Math.random() * totalWeight
  let runningSum = 0
  for (let i = 0; i < instances.length; i++) {
    runningSum += instances[i].weight
    if (rand < runningSum) {
      return instances[i]
    }
  }
  // it is provable that a result always will be returned, 0 <= since Math.random() < 1
})

function selectInstanceImpl (/* !string */ serviceType, /* Function */ filter) {
  // noinspection JSUnresolvedFunction
  return discover(serviceType, filter)
    .then(instances => {
      if (instances.length <= 0) {
        return null
      }
      const sorted = instances.sort(orderByPriority)
      let highestPriorityInstances = []
      highestPriorityInstances = sorted.reduce(
        (acc, i) => {
          if (i.priority === sorted[0].priority) {
            acc.push(i)
          }
          return acc
        },
        highestPriorityInstances
      )
      return selectByWeight(highestPriorityInstances)
    })
}

const selectInstance = selectInstanceContract.implementation(selectInstanceImpl)
selectInstance.notOneOf = discover.notOneOf
selectInstance.selectByWeight = selectByWeight

module.exports = selectInstance
