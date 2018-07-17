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
const validator = require('validator')
const validate = require('./validate')
const deepEql = require('deeper')

const MAX_PORT = 65535

const validDnsSdAttributeNamePattern = /^[ -<>-@[-~]+$/

function isValidDnsSdAttributeValue (a) {
  return a === true || a === false || a === '' || (!!a && typeof a === 'string')
}

/**
 * Usually the type and instance are in the same domain, but that is not a condition of DNS-SD.
 */
const ServiceInstanceContract = new Contract({
  pre: [
    function (kwargs) { return typeof kwargs === 'object' },
    function (kwargs) { return validate.isServiceType(kwargs.type) },
    function (kwargs) { return validate.isServiceInstance(kwargs.instance) },
    function (kwargs) { return validator.isFQDN(kwargs.host) },
    function (kwargs) { return validate.isNatural(kwargs.port, MAX_PORT) },
    function (kwargs) { return validate.isNatural(kwargs.priority) },
    function (kwargs) { return validate.isNatural(kwargs.weight) },
    function (kwargs) { return !!kwargs.details },
    function (kwargs) { return typeof kwargs.details === 'object' },
    function (kwargs) { return Object.keys(kwargs.details).every(k => validDnsSdAttributeNamePattern.test(k)) },
    function (kwargs) { return Object.keys(kwargs.details).every(k => isValidDnsSdAttributeValue(kwargs.details[k])) }
  ],
  post: [
    function (kwargs) { return this.type === kwargs.type },
    function (kwargs) { return this.instance === kwargs.instance },
    function (kwargs) { return this.host === kwargs.host },
    function (kwargs) { return this.port === kwargs.port },
    function (kwargs) { return this.priority === kwargs.priority },
    function (kwargs) { return this.weight === kwargs.weight },
    function (kwargs) { return this.details !== kwargs.details },
    function (kwargs) { return deepEql(this.details, kwargs.details) }
  ]
})

const ServiceInstanceImplementation = function (kwargs) {
  this.type = kwargs.type
  this.instance = kwargs.instance
  this.host = kwargs.host
  this.port = kwargs.port
  this.priority = kwargs.priority
  this.weight = kwargs.weight
  this.details = Object.assign({}, kwargs.details)
  Object.freeze(this)
}

ServiceInstanceImplementation.prototype.type = null
ServiceInstanceImplementation.prototype.instance = null
ServiceInstanceImplementation.prototype.host = null
ServiceInstanceImplementation.prototype.port = null
ServiceInstanceImplementation.prototype.priority = null
ServiceInstanceImplementation.prototype.weight = null
ServiceInstanceImplementation.prototype.details = null

ServiceInstanceImplementation.prototype.toJSON = function () {
  return {
    type: this.type,
    instance: this.instance,
    host: this.host,
    port: this.port,
    priority: this.priority,
    weight: this.weight,
    details: Object.assign({}, this.details)
  }
}

const ServiceInstance = ServiceInstanceContract.implementation(ServiceInstanceImplementation)

ServiceInstance.prototype.invariants = [
  si => validate.isServiceType(si.type),
  si => validate.isServiceInstance(si.instance),
  si => validator.isFQDN(si.host),
  si => validate.isNatural(si.port, MAX_PORT),
  si => validate.isNatural(si.priority),
  si => validate.isNatural(si.weight),
  si => !!si.details,
  si => typeof si.details === 'object',
  si => Object.keys(si.details).every(k => validDnsSdAttributeNamePattern.test(k)),
  si => Object.keys(si.details).every(k => isValidDnsSdAttributeValue(si.details[k])),
  si => si.toJSON().type === si.type,
  si => si.toJSON().instance === si.instance,
  si => si.toJSON().host === si.host,
  si => si.toJSON().port === si.port,
  si => si.toJSON().priority === si.priority,
  si => si.toJSON().weight === si.weight,
  si => si.toJSON().details !== si.details,
  si => deepEql(si.toJSON().details, si.details)
]

module.exports = ServiceInstance
