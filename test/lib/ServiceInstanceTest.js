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

const ServiceInstance = require('../../lib/ServiceInstance')
const x = require('cartesian')
const verifyPostconditions = require('../_util/verifyPostconditions')

const protocols = ['udp', 'tcp']

const domains = ['dns-sd-lookup1.toryt.org', 'dns-sd-lookup2.toryt.org']
const baseServiceType = '_a-service-type'
const types = [baseServiceType, 'sub type._sub.' + baseServiceType]
const instanceName = 'This is An Instance Name'

const detailObjects = [
  {},
  {
    txtvers: '1'
  },
  {
    at: JSON.stringify(new Date(2017, 9, 17, 0, 33, 14.535)),
    path: '/a/path',
    '%boolean#true]': true,
    'boolean@false~': false,
    txtvers: '23'
  }
]

const cases = x({
  typeDomain: domains,
  protocol: protocols,
  type: types,
  instanceDomain: domains,
  details: detailObjects
})

function createKwargs (c) {
  const type = `${c.type}._${c.protocol}.${c.typeDomain}`
  const instance = `${instanceName}.${baseServiceType}._${c.protocol}.${c.instanceDomain}`
  // noinspection SpellCheckingInspection
  return {
    type: type,
    instance: instance,
    host: 'hostname.hostdomain.toryt.org',
    port: 34243,
    priority: 232,
    weight: 8963,
    details: c.details
  }
}

describe('ServiceInstance', () => {
  describe('constructor', () => {
    verifyPostconditions(ServiceInstance)

    it('is a constructor', function () {
      ServiceInstance.should.have.property('prototype')
      // noinspection JSUnresolvedVariable
      ServiceInstance.prototype.should.have.property('constructor', ServiceInstance)
    })
    it('has an implementation that is a constructor', function () {
      ServiceInstance.should.have.property('implementation')
      // noinspection JSUnresolvedVariable
      ServiceInstance.implementation.should.be.a.Function()
      // noinspection JSUnresolvedVariable
      ServiceInstance.implementation.should.have.property('prototype')
      // noinspection JSUnresolvedVariable
      ServiceInstance.implementation.prototype.should.have.property('constructor', ServiceInstance.implementation)
    })

    // noinspection JSUnresolvedFunction
    cases.forEach(c => {
      const kwargs = createKwargs(c)
      it(`works as expected for type '${kwargs.type}' and instance '${kwargs.instance}'`, function () {
        const subject = new ServiceInstance(kwargs)
        subject.should.be.instanceof(ServiceInstance)
        subject.should.be.frozen()
        // noinspection JSUnresolvedFunction
        subject.should.be.valid()
        console.log(subject)
      })
    })
  })

  describe('stringify', () => {
    // noinspection JSUnresolvedFunction
    cases.forEach(c => {
      const kwargs = createKwargs(c)
      it(`can be stringified for type '${kwargs.type}' and instance '${kwargs.instance}'`, function () {
        const kwargs = createKwargs(c)
        const subject = new ServiceInstance(kwargs)
        const result = JSON.stringify(subject)
        result.should.be.a.String()
        result.should.match(/^{.*}$/)
        console.log(result)
        const reverse = JSON.parse(result)
        reverse.should.be.an.Object()
        // noinspection JSUnresolvedVariable
        reverse.type.should.equal(subject.type)
        // noinspection JSUnresolvedVariable
        reverse.instance.should.equal(subject.instance)
        // noinspection JSUnresolvedVariable
        reverse.host.should.equal(subject.host)
        // noinspection JSUnresolvedVariable
        reverse.port.should.equal(subject.port)
        // noinspection JSUnresolvedVariable
        reverse.priority.should.equal(subject.priority)
        // noinspection JSUnresolvedVariable
        reverse.details.should.eql(subject.details)
        console.log(reverse)
        const fullCircle = new ServiceInstance(reverse)
        fullCircle.should.eql(subject)
      })
    })
  })
})
