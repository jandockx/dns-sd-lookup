/*
 * MIT License
 *
 * Copyright (c) 2017-2020 Jan Dockx
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

/**
 * Promise the {@code ServiceInstance} that should be used for the given {@code serviceType} according to DNS-SD,
 * using the different service instances' priority and weight.
 * If an optional {@code filter} function is provided, only {@code ServiceInstance} objects whose name passes
 * the filter are considered.
 * If no appropriate {@code ServiceInstance} is found, the Promise is resolved with {@code null}
 */
const selectInstanceContract = new PromiseContract({
  pre: [
    validate.isServiceType,
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
  exception: discoverContract.invalidServiceDefinitionException
})
selectInstanceContract.filter = discoverContract.filter

function orderByPriority (a, b) {
  return a === b || a.priority === b.priority ? 0 : a.priority < b.priority ? -1 : +1 // b.priority < a.priority)
}

/**
 * <a href="https://www.ietf.org/rfc/rfc2782.txt">RFC 2782</a> states:
 *
 * <blockquote>
 * The following algorithm SHOULD be used to order the SRV RRs of the same
 * priority:</br>
 * To select a target to be contacted next, arrange all SRV RRs
 * (that have not been ordered yet) in any order, except that all
 * those with weight 0 are placed at the beginning of the list.<br/>
 * Compute the sum of the weights of those RRs, and with each RR
 * associate the running sum in the selected order. Then choose a
 * uniform random number between 0, and the sum computed
 * (inclusive), and select the RR whose running sum value is the
 * first in the selected order which is greater than or equal to
 * the random number selected. The target host specified in the
 * selected SRV RR is the next one to be contacted by the client.
 * Remove this SRV RR from the set of the unordered SRV RRs and
 * apply the described algorithm to the unordered SRV RRs to select
 * the next target host.  Continue the ordering process until there
 * are no unordered SRV RRs.  This process is repeated for each
 * Priority.
 * </blockquote>
 *
 * <p>The below algorithm is close to that, without keeping state between calls.</p>
 * <p>The above does not cover the case where all weights are 0 sufficiently,
 * because it says the instances should be arranged in 'any order', which is not
 * necessarily random. The below algorithm chooses a totally random choice when
 * all instances have weight 0.</p>
 */
const selectByWeight = new Contract({
  pre: [
    instances => Array.isArray(instances),
    instances => instances.length >= 1,
    instances => instances.every(i => i instanceof ServiceInstance)
  ],
  post: [
    (instances, result) => result instanceof ServiceInstance,
    (instances, result) => instances.indexOf(result) >= 0
  ]
}).implementation(function selectByWeight (/** @type Array<ServiceInstance> */ instances) {
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
  /* a result will always be returned, since
       0 <= Math.random() < 1
       0 <= rand < totalWeight
     and
       runningSum grows eventually to totalWeight
       so, eventually, in the loop, rand < runningSum will become true */
})

async function selectInstanceImpl (/* !string */ serviceType, /* Function */ filter) {
  const /** @type Array<ServiceInstance> */ instances = await discover(serviceType, filter)
  if (instances.length <= 0) {
    return null
  }
  instances.sort(orderByPriority)
  let highestPriorityInstances = []
  highestPriorityInstances = instances.reduce((acc, i) => {
    // noinspection JSUnresolvedVariable
    if (i.priority === instances[0].priority) {
      acc.push(i)
    }
    return acc
  }, highestPriorityInstances)
  return selectByWeight(highestPriorityInstances)
}

const selectInstance = selectInstanceContract.implementation(selectInstanceImpl)
selectInstance.notOneOf = discover.notOneOf
selectInstance.selectByWeight = selectByWeight

module.exports = selectInstance
