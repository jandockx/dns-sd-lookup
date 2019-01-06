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
const verifyPostconditions = require('../_util/verifyPostconditions')

const nameCompletion = '._tcp.dns-sd-lookup.toryt.org'

const typeName = '_t1i-no-sub' + nameCompletion

const instanceName = 'instance 1.' + typeName

// see ../terraform/cases.tf
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

function shouldBeNotFoundError (baseMessage) {
  // noinspection JSUnresolvedVariable
  return error => {
    error.should.be.an.Error()
    // noinspection JSUnresolvedVariable
    error.message.should.equal(lookupInstance.contract.notValidMessage)
    error.cause.should.be.an.Error()
    error.cause.message.should.containEql(baseMessage)
    console.log(error)
  }
}

describe('lookupInstance', function () {
  this.timeout(6000) // DNS lookups can take a long time on Travis
  verifyPostconditions(lookupInstance)

  it('works in the nominal case', function () {
    const now = new Date()
    // noinspection JSUnresolvedVariable
    return lookupInstance(instanceName).must.fulfill(response => {
      response.should.be.an.instanceof(ServiceInstance)
      console.log(response)
      response.type.should.equal(expected.type)
      response.instance.should.equal(expected.instance)
      response.host.should.equal(expected.host)
      response.port.should.equal(expected.port)
      response.priority.should.equal(expected.priority)
      response.weight.should.equal(expected.weight)
      // no coercion happens on details
      Object.keys(response.details).forEach(key => response.details[key].should.be.a.String())
      response.details.txtvers.should.be.a.String()
      // noinspection JSCheckFunctionSignatures
      Number.parseInt(response.details.txtvers).should.equal(expected.txtvers)
      response.details['aDetail'.toLowerCase()].should.equal(expected.aDetail)
      const at = new Date(response.details.at)
      at.should.be.before(now)
    })
  })

  it('fails with non-existent instance', function () {
    // noinspection JSUnresolvedVariable
    return lookupInstance('does-not-exist.' + typeName).should.be.rejected().then(shouldBeNotFoundError('ENOTFOUND'))
  })

  it('fails with an instance with 2 TXTs', function () {
    const instanceName = 'instance 2._t2i-2-txt' + nameCompletion
    // noinspection JSUnresolvedVariable
    return lookupInstance(instanceName).should.be.rejected().then(error => {
      error.should.be.an.instanceof(Error)
      // noinspection JSUnresolvedVariable
      error.message.should.equal(lookupInstance.contract.notValidMessage)
      error.cause.should.be.an.instanceof(Error)
      // noinspection JSUnresolvedVariable
      error.cause.message.should.equal(lookupInstance.contract.moreThen1Message.TXT)
      error.cause.instance.should.equal(instanceName)
      error.cause.count.should.equal(2)
      console.log(error)
    })
  })

  it('fails with an instance with 2 SRVs', function () {
    const instanceName = 'instance 3._t3i-2-srv' + nameCompletion
    // noinspection JSUnresolvedVariable
    return lookupInstance(instanceName).should.be.rejected().then(error => {
      error.should.be.an.instanceof(Error)
      // noinspection JSUnresolvedVariable
      error.message.should.equal(lookupInstance.contract.notValidMessage)
      error.cause.should.be.an.instanceof(Error)
      // noinspection JSUnresolvedVariable
      error.cause.message.should.equal(lookupInstance.contract.moreThen1Message.SRV)
      error.cause.instance.should.equal(instanceName)
      error.cause.count.should.equal(2)
      console.log(error)
    })
  })

  it('fails with an instance with 2 TXTs and 2 SRVs', function () {
    const instanceName = 'instance 4._t4i-2-txt-srv' + nameCompletion
    // noinspection JSUnresolvedVariable
    return lookupInstance(instanceName).should.be.rejected().then(error => {
      error.should.be.an.Error()
      // noinspection JSUnresolvedVariable
      error.message.should.equal(lookupInstance.contract.notValidMessage)
      error.cause.should.be.an.Error()
      // noinspection JSUnresolvedVariable
      error.cause.message.should.match(
        new RegExp(lookupInstance.contract.moreThen1Message.TXT + '|' + lookupInstance.contract.moreThen1Message.SRV)
      )
      error.cause.instance.should.equal(instanceName)
      error.cause.count.should.equal(2)
      console.log(error)
    })
  })

  it('fails with an instance without a TXT', function () {
    const instanceName = 'instance 5._t5i-no-txt' + nameCompletion
    // noinspection JSUnresolvedVariable
    return lookupInstance(instanceName).should.be.rejected().then(shouldBeNotFoundError('ENODATA'))
  })

  it('fails with an instance without a SRV', function () {
    const instanceName = 'instance 6._t6i-no-srv' + nameCompletion
    // noinspection JSUnresolvedVariable
    return lookupInstance(instanceName).should.be.rejected().then(shouldBeNotFoundError('ENODATA'))
  })
})
