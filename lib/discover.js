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

const discoverContract = new Contract({
  pre: [
    validate.isServiceType,
    function (serviceType, deathInstances) { return !deathInstances || Array.isArray(deathInstances) },
    function (serviceType, deathInstances) {
      return !deathInstances || deathInstances.every(validate.isServiceInstance)
    }
  ],
  post: [
    function (serviceInstance, resultWithoutDeathInstances, resultWithDeathInstances) {
      return resultWithoutDeathInstances instanceof Promise ||
             (Array.isArray(resultWithoutDeathInstances) && resultWithDeathInstances instanceof Promise)
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

function discoverImpl (/* !string */ serviceType, /* string[]= */ deathInstances) {
  const lowerCaseDeathInstances = deathInstances ? deathInstances.map(di => di.toLowerCase()) : []
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
    .then(response => Promise.all(
      response
        .filter(instanceName => lowerCaseDeathInstances.indexOf(instanceName) < 0)
        .map(instanceName =>
          lookupInstance(instanceName)
            .catch(lookupInstanceContract.rejected.implementation(err => {
              throw err
            }))
            .then(lookupInstanceContract.resolved.implementation(instance => {
              const kwargs = Object.create(instance)
              kwargs.type = serviceType
              return new ServiceInstance(kwargs)
            }))
        )
      )
    )
}

module.exports = discoverContract.implementation(discoverImpl)
