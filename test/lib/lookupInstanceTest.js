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

/* eslint-env mocha */

const lookupInstance = require('../../lib/lookupInstance')
const ServiceInstance = require('../../lib/ServiceInstance')

const nameCompletion = '._tcp.dns-sd-lookup.toryt.org'

const typeName = '_t1i-no-sub' + nameCompletion

const instanceName = 'instance 1.' + typeName

// see ../terraform/type_with_1_instance.tf
const expected = {
  aDetail: 'This is a detail 1',
  host: 'host-of-instance-1.dns-sd-lookup.toryt.org',
  instance: instanceName,
  port: 4141,
  priority: 42,
  txtvers: 44,
  type: typeName,
  weight: 43
}

function mustBeNotFoundError (baseMessage) {
  // noinspection JSUnresolvedVariable
  return lookupInstance.contract.rejected.implementation(error => {
    error.must.be.an.instanceof(Error)
    // noinspection JSUnresolvedVariable
    error.message.must.match(lookupInstance.contract.notFoundMessage)
    error.cause.must.be.an.instanceof(Error)
    error.cause.message.must.match(baseMessage)
    console.log(error)
  })
}

describe('lookupInstance', function () {
  it('works in the nominal case', function () {
    const now = new Date()
    // noinspection JSUnresolvedVariable
    return lookupInstance(instanceName).must.fulfill(lookupInstance.contract.resolved.implementation(response => {
      response.must.be.an.instanceof(ServiceInstance)
      console.log(response)
      response.type.must.equal(expected.type)
      response.instance.must.equal(expected.instance)
      response.host.must.equal(expected.host)
      response.port.must.equal(expected.port)
      response.priority.must.equal(expected.priority)
      response.weight.must.equal(expected.weight)
      // no coercion happens on details
      Object.keys(response.details).forEach(key => response.details[key].must.be.a.string())
      response.details.txtvers.must.be.a.string()
      // noinspection JSCheckFunctionSignatures
      Number.parseInt(response.details.txtvers).must.equal(expected.txtvers)
      response.details.aDetail.must.equal(expected.aDetail)
      const at = new Date(response.details.at)
      at.must.be.before(now)
    }))
  })

  it('fails with non-existent instance', function () {
    // noinspection JSUnresolvedVariable
    return lookupInstance('does-not-exist.' + typeName).must.betray(mustBeNotFoundError('ENOTFOUND'))
  })

  it('fails with an instance with 2 TXTs', function () {
    const instanceName = 'instance 2._t2i-2-txt' + nameCompletion
    // noinspection JSUnresolvedVariable
    return lookupInstance(instanceName).must.betray(lookupInstance.contract.rejected.implementation(error => {
      error.must.be.an.instanceof(Error)
      // noinspection JSUnresolvedVariable
      error.message.must.match(lookupInstance.contract.notFoundMessage)
      error.cause.must.be.an.instanceof(Error)
      // noinspection JSUnresolvedVariable
      error.cause.message.must.equal(lookupInstance.contract.moreThen1Message.TXT)
      error.cause.instance.must.equal(instanceName)
      error.cause.count.must.equal(2)
      console.log(error)
    }))
  })

  it('fails with an instance with 2 SRVs', function () {
    const instanceName = 'instance 3._t3i-2-srv' + nameCompletion
    // noinspection JSUnresolvedVariable
    return lookupInstance(instanceName).must.betray(lookupInstance.contract.rejected.implementation(error => {
      error.must.be.an.instanceof(Error)
      // noinspection JSUnresolvedVariable
      error.message.must.match(lookupInstance.contract.notFoundMessage)
      error.cause.must.be.an.instanceof(Error)
      // noinspection JSUnresolvedVariable
      error.cause.message.must.equal(lookupInstance.contract.moreThen1Message.SRV)
      error.cause.instance.must.equal(instanceName)
      error.cause.count.must.equal(2)
      console.log(error)
    }))
  })

  it('fails with an instance with 2 TXTs and 2 SRVs', function () {
    const instanceName = 'instance 4._t4i-2-txt-srv' + nameCompletion
    // noinspection JSUnresolvedVariable
    return lookupInstance(instanceName).must.betray(lookupInstance.contract.rejected.implementation(error => {
      error.must.be.an.instanceof(Error)
      // noinspection JSUnresolvedVariable
      error.message.must.match(lookupInstance.contract.notFoundMessage)
      error.cause.must.be.an.instanceof(Error)
      // noinspection JSUnresolvedVariable
      error.cause.message.must.match(
        new RegExp(lookupInstance.contract.moreThen1Message.TXT + '|' + lookupInstance.contract.moreThen1Message.SRV)
      )
      error.cause.instance.must.equal(instanceName)
      error.cause.count.must.equal(2)
      console.log(error)
    }))
  })

  it('fails with an instance without a TXT', function () {
    const instanceName = 'instance 5._t5i-no-txt' + nameCompletion
    // noinspection JSUnresolvedVariable
    return lookupInstance(instanceName).must.betray(mustBeNotFoundError('ENODATA'))
  })

  it('fails with an instance without a SRV', function () {
    const instanceName = 'instance 6._t6i-no-srv' + nameCompletion
    // noinspection JSUnresolvedVariable
    return lookupInstance(instanceName).must.betray(mustBeNotFoundError('ENODATA'))
  })

  // MUDO add test with TXT string without =, with = in value
  // IDEA add support for TXT string with escaped `= in key
})
