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
const denodeify = require('denodeify')
const resolvePtr = denodeify(require('dns').resolvePtr)
const lookupInstance = require('./lookupInstance')
const ServiceInstance = require('./ServiceInstance')
const validate = require('./validate')
// noinspection JSUnresolvedVariable
const lookupInstanceContract = lookupInstance.contract

const discoverContract = new PromiseContract({
  pre: [
    validate.isServiceType,
    (serviceType, filter) => !filter || discoverContract.filter.isImplementedBy(filter)
  ],
  post: [
    function () { return Array.isArray(PromiseContract.outcome(arguments)) },
    function () { return PromiseContract.outcome(arguments).every(si => si instanceof ServiceInstance) },
    function (serviceType) { return PromiseContract.outcome(arguments).every(si => si.type === serviceType) },
    function (serviceType, filter) {
      return arguments.length < 4 || PromiseContract.outcome(arguments).every(si => filter(si.instance))
    }
  ],
  exception: [
    function () { return PromiseContract.outcome(arguments) instanceof Error },
    function () { return PromiseContract.outcome(arguments).message === lookupInstanceContract.notValidMessage },
    function () { return PromiseContract.outcome(arguments).cause instanceof Error },
    function (serviceType, filter) { return arguments.length < 4 || filter(PromiseContract.outcome(arguments).instance) }
  ]
})
// noinspection JSUndefinedPropertyAssignment
discoverContract.filter = new Contract({
  pre: [
    /* String */ serviceInstanceName => validate.isServiceInstance(serviceInstanceName)
  ],
  post: [
    function (/* String */ serviceInstanceName) {
      // we expect possible extra arguments, when used in Array.prototype.filter(element, index, array)
      return typeof Contract.outcome(arguments) === 'boolean'
    }
  ]
})

// noinspection JSUndefinedPropertyAssignment
discoverContract.notOneOf = new Contract({
  pre: [
    deathInstances => !!deathInstances,
    deathInstances => Array.isArray(deathInstances),
    deathInstances => deathInstances.every(validate.isServiceInstance)
  ],
  post: [
    (deathInstances, result) => Contract.isAContractFunction(result),
    (deathInstances, result) => discoverContract.filter.isImplementedBy(result)
  ]
})
/* NOTE: cannot specify a contract that expresses the link between the result of the returned filter function,
         and the deathInstances parameter. It should expresses that it's `filterResult`
            !filterResult || deathInstances.indexOf(serviceInstanceName) < 0
         This is an extra post condition on the contract of the result. That requires a new dynamic Contract, that
         expresses a 'sub behavior' of the filter Contract. */

function discoverImpl (/* !string */ serviceType, /* Function */ filter) {
  // noinspection JSUnresolvedFunction
  return resolvePtr(serviceType)
    .catch(error => {
      /* istanbul ignore else : unexpected error - cannot be tested */
      if (/ENOTFOUND/.test(error.message)) {
        return []
      } else {
        /* TODO BUG Throws "Error: queryPtr ENODATA <serviceType>" when the <serviceType> "does not exists"
                in some production cases.
                Just throwing invalidates the rejection contract
                  `rejection.message === lookupInstanceContract.notValidMessage`.
                All other errors are unexpected, and then this is appropriate.
                It is unclear in which case ENODATA is thrown, instead of ENOTFOUND.
                This bug will remain here until it can be made clear in which cases ENODATA is actually
                thrown, so that a case can be added for it in the tests. */
        throw error
      }
    })
    // noinspection JSUnresolvedFunction,JSUnresolvedVariable
    .then(response => {
      const filtered = filter ? response.filter(filter) : response
      // noinspection JSUnresolvedFunction
      return Promise.all(filtered.map(instanceName => lookupInstance(instanceName).then(instance => {
        const kwargs = Object.assign({}, instance, {type: serviceType})
        return new ServiceInstance(kwargs)
      })))
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
