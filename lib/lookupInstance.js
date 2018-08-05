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

/// <reference path="./lookupInstance" />

const PromiseContract = require('@toryt/contracts-iv').Promise
const denodeify = require('denodeify')
const resolveSrv = denodeify(require('dns').resolveSrv)
const resolveTxt = denodeify(require('dns').resolveTxt)
const ServiceInstance = require('./ServiceInstance')
const extract = require('./extract')
const validate = require('./validate')
const extendWithTxtStr = require('./extendWithTxtStr')

/**
 * Promise for a {@link ServiceInstance}, build from the contents of the SRV and TXT
 * DNS-SD records for {@code serviceInstance}.
 *
 * The Promise is betrayed ({@link lookupInstanceContract.notValidMessage}) when either
 * the SRV resource record or the TXT resource record does not exist , or when there is
 * more then 1 SRV resource record ({@link lookupInstanceContract.moreThen1Message.SRV}),
 * or the TXT resource record ({@link lookupInstanceContract.moreThen1Message.TXT}),
 * respectively.
 *
 * There are no additional preconditions on the contents of the TXT resource record.
 */
const lookupInstanceContract = new PromiseContract({
  pre: [validate.isServiceInstance],
  post: [
    function (serviceInstance, resolution) { return resolution instanceof ServiceInstance },
    function (serviceInstance, resolution) {
      return resolution.type ===
             `_${extract.type(serviceInstance)}._${extract.protocol(serviceInstance)}.${extract.domain(serviceInstance)}`
    },
    function (serviceInstance, resolution) { return resolution.instance === serviceInstance }
  ],
  exception: [
    function (serviceInstance, rejection) { return rejection instanceof Error },
    function (serviceInstance, rejection) { return rejection.message === lookupInstanceContract.notValidMessage },
    function (serviceInstance, rejection) { return rejection.instance === serviceInstance },
    function (serviceInstance, rejection) { return rejection.cause instanceof Error }
  ]
})

lookupInstanceContract.moreThen1Message = {
  SRV: 'more than 1 SRV record',
  TXT: 'more than 1 TXT record'
}
lookupInstanceContract.notValidMessage = 'service instance definition not valid'

/**
 * @return {string}
 */
function exactly1 (/* !string */ serviceInstance, /* !string */ recordType, /* !Function */ resolver) {
  return resolver(serviceInstance).then(records => {
    if (records.length > 1) {
      /** @type {lookupInstance.MoreThen1Exception} */ const err = new Error(lookupInstanceContract.moreThen1Message[recordType])
      err.instance = serviceInstance
      err.count = records.length
      throw err
    }
    return records[0]
  })
}

function lookupInstanceImpl (/* !string */ serviceInstance) {
  return Promise.all([
    exactly1(serviceInstance, 'SRV', resolveSrv),
    exactly1(serviceInstance, 'TXT', resolveTxt)
      .then(txt => txt.reduce(extendWithTxtStr, {}))
  ])
    .catch(cause => {
      /** @type {lookupInstance.NotValidException} */ const err = new Error(lookupInstanceContract.notValidMessage)
      err.instance = serviceInstance
      err.cause = cause
      throw err
    })
    .then(data => new ServiceInstance({
      type: `_${extract.type(serviceInstance)}._${extract.protocol(serviceInstance)}.${extract.domain(serviceInstance)}`,
      instance: serviceInstance,
      host: data[0].name,
      port: data[0].port,
      priority: data[0].priority,
      weight: data[0].weight,
      details: data[1]
    }))
}

const lookupInstance = lookupInstanceContract.implementation(lookupInstanceImpl)

module.exports = lookupInstance
