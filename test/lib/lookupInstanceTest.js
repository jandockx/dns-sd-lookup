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

/* eslint-env mocha */

const lookupInstance = require('../../lib/lookupInstance')
const verifyPostconditions = require('../_util/verifyPostconditions')
const serviceInstanceCommon = require('./serviceInstanceCommon')

const nameCompletion = '._tcp.dns-sd-lookup.toryt.org'

const typeName = '_t1i-no-sub' + nameCompletion

const instanceName = 'instance_1.' + typeName

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

  it('works in the nominal case', async function () {
    const now = new Date()
    const /** @type ServiceInstance */ response = await lookupInstance(instanceName)
    serviceInstanceCommon.shouldHavePropertyValues(response, expected)
    console.log(response)
    // no coercion happens on details
    Object.keys(response.details).forEach(key => response.details[key].should.be.a.String())
    response.details.txtvers.should.be.a.String()
    Number.parseInt(response.details.txtvers).should.equal(expected.txtvers)
    response.details['aDetail'.toLowerCase()].should.equal(expected.aDetail)
    const at = new Date(response.details.at)
    at.should.be.before(now)
  })

  it('fails with non-existent instance', async function () {
    // noinspection JSUnresolvedVariable
    const err = await lookupInstance('does-not-exist.' + typeName).should.be.rejected()
    shouldBeNotFoundError('ENOTFOUND')(err)
  })

  it('fails with an instance with 2 TXTs', async function () {
    const instanceName = 'instance_2._t2i-2-txt' + nameCompletion
    // noinspection JSUnresolvedVariable
    const error = await lookupInstance(instanceName).should.be.rejected()
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

  it('fails with an instance with 2 SRVs', async function () {
    const instanceName = 'instance_3._t3i-2-srv' + nameCompletion
    // noinspection JSUnresolvedVariable
    const error = await lookupInstance(instanceName).should.be.rejected()
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

  it('fails with an instance with 2 TXTs and 2 SRVs', async function () {
    const instanceName = 'instance_4._t4i-2-txt-srv' + nameCompletion
    // noinspection JSUnresolvedVariable
    const error = await lookupInstance(instanceName).should.be.rejected()
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

  it('fails with an instance without a TXT resource record set', async function () {
    const instanceName = 'instance_5._t5i-no-txt' + nameCompletion
    // noinspection JSUnresolvedVariable
    const error = await lookupInstance(instanceName).should.be.rejected()
    shouldBeNotFoundError('ENODATA')(error)
  })

  it('fails with an instance without an SRV resource record set', async function () {
    const instanceName = 'instance_6._t6i-no-srv' + nameCompletion
    // noinspection JSUnresolvedVariable
    const error = await lookupInstance(instanceName).should.be.rejected()
    shouldBeNotFoundError('ENODATA')(error)
  })
})
