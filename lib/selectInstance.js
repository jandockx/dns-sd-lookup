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

const Contract = require('@toryt/contracts-iii')
const validate = require('./validate')
const ServiceInstance = require('./ServiceInstance')
const discover = require('./discover')
// noinspection JSUnresolvedVariable
const discoverContract = discover.contract
// noinspection JSUnresolvedVariable
const lookupInstanceContract = require('./lookupInstance').contract

/**
 * Promise the {@code ServiceInstance} that should be used for the given {@code serviceType} according to DNS-SD,
 * using the different service instances' priority and weight.
 * If an optional {@code filter} function is provided, only {@code ServiceInstance} objects whose name passes
 * the filter are considered.
 * If no appropriate {@code ServiceInstance} is found, the Promise is resolved with {@code null}
 */
const selectInstanceContract = new Contract({
  pre: [
    validate.isServiceType,
    function (serviceType, filter) {
      // noinspection JSUnresolvedVariable
      return !filter || (Contract.isAContractFunction(filter) && filter.contract === selectInstanceContract.filter)
    }
  ],
  post: [
    function (serviceInstance, resultWithoutFilter, resultWithFilter) {
      // noinspection JSUnresolvedVariable
      return resultWithoutFilter instanceof Promise ||
             (
               Contract.isAContractFunction(resultWithoutFilter) &&
               resultWithoutFilter.contract === selectInstanceContract.filter &&
               resultWithFilter instanceof Promise
             )
    }
  ],
  exception: validate.mustNotHappen
})
selectInstanceContract.filter = discoverContract.filter
selectInstanceContract.resolved = new Contract({
  pre: [
    function (resolution) { return resolution === null || resolution instanceof ServiceInstance }
    // NOTE: cannot express relation between parameters and resolution
  ]
})
selectInstanceContract.rejected = new Contract({
  pre: [
    function (rejection) { return rejection instanceof Error },
    function (rejection) { return lookupInstanceContract.messages.indexOf(rejection.message) >= 0 },
    function (rejection) { return rejection.cause instanceof Error }
    // NOTE: cannot express relation between parameter serviceInstance and rejection.instance
  ]
})

function orderByPriority (a, b) {
  return (a === b || a.priority === b.priority)
    ? 0
    : ((a.priority < b.priority)
       ? -1
       : +1) // b.priority < a.priority)
}

function selectByWeight (/* [ServiceInstance] */ instances, /* number */ totalWeight) {
  // noinspection JSUnresolvedVariable
  const rand = Math.random() * totalWeight
  let denominator = 0
  for (let i = 0; i < instances.length; i++) {
    denominator += instances[i].weight
    if (rand < denominator) {
      return instances[i]
    }
  }
  return null
}

function selectInstanceImpl (/* !string */ serviceType, /* Function */ filter) {
  // noinspection JSUnresolvedFunction
  return discover(serviceType, filter)
    .catch(discoverContract.rejected.implementation(err => {
      throw err // TODO fail fast, or pass over and warn?
    }))
    .then(discoverContract.resolved.implementation(instances => {
      if (instances.length <= 0) {
        return null
      }
      const sorted = instances.sort(orderByPriority)
      let highestPriorityInstances = []
      let totalWeight = 0
      highestPriorityInstances = sorted.reduce(
        (acc, i) => {
          if (i.priority === sorted[0].priority) {
            acc.push(i)
            totalWeight += i.weight
          }
          return acc
        },
        highestPriorityInstances
      )
      return selectByWeight(highestPriorityInstances, totalWeight)
    }))
}

const selectInstance = selectInstanceContract.implementation(selectInstanceImpl)
selectInstance.noteOneOf = discover.notOneOf

module.exports = selectInstance
