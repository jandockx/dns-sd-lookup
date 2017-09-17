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

const typeName = '_type-1-instance-no-subtype' + nameCompletion

const instanceName = 'instance 1.' + typeName

// see ../terraform/type_with_1_instance.tf
const expected = {
  aDetail: 'This is a detail',
  host: 'host-of-instance-1.dns-sd-lookup.toryt.org',
  instance: instanceName,
  port: 4242,
  priority: 43,
  txtvers: 1,
  type: typeName,
  weight: 44
}

describe('lookupInstance', function () {
  it('works in the nominal case', function () {
    const now = new Date()
    // noinspection JSUnresolvedVariable
    return lookupInstance(instanceName).must.fulfill(response => {
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
    })
  })

  it('fails with non-existent instance', function () {
    // noinspection JSUnresolvedVariable
    return lookupInstance('does-not-exist.' + typeName).must.betray(error => {
      error.must.be.an.instanceof(Error)
      error.message.must.match(lookupInstance.notFoundMessage)
      error.cause.must.be.an.instanceof(Error)
      error.cause.message.must.match(/ENOTFOUND/)
      console.log(error)
    })
  })

  it('fails with an instance with 2 TXTs', function () {
    // noinspection JSUnresolvedVariable
    return lookupInstance('instance 2._type-2-double-txt' + nameCompletion).must.betray(error => {
      error.must.be.an.instanceof(Error)
/*
      error.message.must.match(lookupInstance.notFoundMessage)
      error.cause.must.be.an.instanceof(Error)
      error.cause.message.must.match(/ENOTFOUND/)
*/
      console.log(error)
    })
  })

  it('fails with an instance with 2 SRVs', function () {
    // noinspection JSUnresolvedVariable
    return lookupInstance('instance 3._type-3-double-srv' + nameCompletion).must.betray(error => {
      error.must.be.an.instanceof(Error)
/*
      error.message.must.match(lookupInstance.notFoundMessage)
      error.cause.must.be.an.instanceof(Error)
      error.cause.message.must.match(/ENOTFOUND/)
*/
      console.log(error)
    })
  })

  it('fails with an instance with 2 TXTs and 2 SRVs', function () {
    // noinspection JSUnresolvedVariable
    return lookupInstance('instance 4._type-4-double-txt-srv' + nameCompletion).must.betray(error => {
      error.must.be.an.instanceof(Error)
/*
      error.message.must.match(lookupInstance.notFoundMessage)
      error.cause.must.be.an.instanceof(Error)
      error.cause.message.must.match(/ENOTFOUND/)
*/
      console.log(error)
    })
  })

  // MUDO add test when only TXT, or only SRV exists
  // MUDO add test with TXT string without =, with = in value
  // IDEA add support for TXT string with escaped `= in key
})
