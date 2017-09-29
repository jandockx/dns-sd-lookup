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
const denodeify = require('denodeify')
const resolvePtr = denodeify(require('dns').resolvePtr)
const lookupInstance = require('./lookupInstance')
const ServiceInstance = require('./ServiceInstance')
const validate = require('./validate')
// noinspection JSUnresolvedVariable
const lookupInstanceContract = lookupInstance.contract

/**
 * Return an array of all service instances found in DNS for the given {@code serviceType}.
 * If an optional {@code filter} function is provided, only {@code ServiceInstance} objects whose name passes
 * the filter are in the result.
 */
const discoverContract = new Contract({
  pre: [
    validate.isServiceType,
    function (serviceType, filter) {
      // noinspection JSUnresolvedVariable
      return !filter || (Contract.isAContractFunction(filter) && filter.contract === discoverContract.filter)
    }
  ],
  post: [
    function (serviceInstance, resultWithoutFilter, resultWithFilter) {
      // noinspection JSUnresolvedVariable
      return resultWithoutFilter instanceof Promise ||
             (
               Contract.isAContractFunction(resultWithoutFilter) &&
               resultWithoutFilter.contract === discoverContract.filter &&
               resultWithFilter instanceof Promise
             )
    }
  ],
  exception: validate.mustNotHappen
})
discoverContract.filter = new Contract({
  pre: [
    function (/* String */ serviceInstanceName) { return validate.isServiceInstance(serviceInstanceName) }
  ],
  post: [
    function (/* String */ serviceInstanceName) {
      // we expect possible extra arguments, when used in Array.prototype.filter(element, index, array)
      const result = arguments[arguments.length - 2]
      return typeof result === 'boolean'
    }
  ],
  exception: validate.mustNotHappen
})
discoverContract.resolved = new Contract({
  pre: [
    function (resolution) { return Array.isArray(resolution) },
    function (resolution) { return resolution.every(si => si instanceof ServiceInstance) }
    // NOTE: cannot express relation between parameters and resolution
  ]
})
discoverContract.rejected = new Contract({
  pre: [
    function (rejection) { return rejection instanceof Error },
    function (rejection) { return lookupInstanceContract.messages.indexOf(rejection.message) >= 0 },
    function (rejection) { return rejection.cause instanceof Error }
    // NOTE: cannot express relation between parameter serviceInstance and rejection.instance
  ]
})

discoverContract.notOneOf = new Contract({
  pre: [
    function (deathInstances) { return !!deathInstances },
    function (deathInstances) { return Array.isArray(deathInstances) },
    function (deathInstances) { return deathInstances.every(validate.isServiceInstance) }
  ],
  post: [
    function (deathInstances, result) { return Contract.isAContractFunction(result) },
    function (deathInstances, result) {
      // noinspection JSUnresolvedVariable
      return result.contract === discoverContract.filter
    }
  ],
  exception: validate.mustNotHappen
})
/* NOTE: cannot specify a contract that expresses the link between the result of the returned filter function,
         and the deathInstances parameter. It should expresses that it's `filterResult`
            !filterResult || deathInstances.indexOf(serviceInstanceName) < 0
         This is an extra post condition on the contract of the result. That requires a new dynamic Contract, that
         expresses a 'sub behavior' of the filter Contract.
*/

function discoverImpl (/* !string */ serviceType, /* Function */ filter) {
  // noinspection JSUnresolvedFunction
  return resolvePtr(serviceType)
    .catch(error => {
      /* istanbul ignore else : unexpected error - cannot be tested */
      if (/ENOTFOUND/.test(error.message)) {
        return []
      } else {
        throw error
      }
    })
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    .then(response => {
      const filtered = filter ? response.filter(filter) : response
      // noinspection JSUnresolvedFunction
      return Promise.all(filtered.map(instanceName =>
        lookupInstance(instanceName)
          .catch(lookupInstanceContract.rejected.implementation(err => {
            throw err
          }))
          .then(lookupInstanceContract.resolved.implementation(instance => {
            const kwargs = Object.create(instance)
            kwargs.type = serviceType
            return new ServiceInstance(kwargs)
          }))
        ))
    })
}

function notOneOfImpl (/* [String] */ deathInstances) {
  const lowerCaseDeathInstances = deathInstances.map(di => di.toLowerCase())

  function notADeathInstance (/* String */ serviceInstanceName) {
    return lowerCaseDeathInstances.indexOf(serviceInstanceName) < 0
  }

  return discoverContract.filter.implementation(notADeathInstance)
}

const discover = discoverContract.implementation(discoverImpl)
discover.notOneOf = discoverContract.notOneOf.implementation(notOneOfImpl)

module.exports = discover
