const Contract = require('@toryt/contracts-iii')
const validator = require('validator')
const validate = require('./validate')

const MAX_PORT = 65535

/**
 * Usually the type and instance are in the same domain, but that is not a condition of DNS-SD.
 */
const ServiceInstanceContract = new Contract({
  pre: [
    function (kwargs) { return typeof kwargs === 'object' },
    function (kwargs) { return validate.isServiceTypeOrInstanceFqdn(kwargs.type) },
    function (kwargs) { return validate.isServiceTypeOrInstanceFqdn(kwargs.instance) },
    function (kwargs) { return validator.isFQDN(kwargs.host) },
    function (kwargs) { return validate.isNatural(kwargs.port, MAX_PORT) },
    function (kwargs) { return validate.isNatural(kwargs.priority) },
    function (kwargs) { return validate.isNatural(kwargs.weight) }
  ],
  post: [
    function (kwargs) { return this.type === kwargs.type },
    function (kwargs) { return this.instance === kwargs.instance },
    function (kwargs) { return this.host === kwargs.host },
    function (kwargs) { return this.port === kwargs.port },
    function (kwargs) { return this.priority === kwargs.priority },
    function (kwargs) { return this.weight === kwargs.weight }
  ],
  exception: [
    /* istanbul ignore next : should not throw an exception */
    function () { return false }
  ]
})

const ServiceInstanceImplementation = function (kwargs) {
  this.type = kwargs.type
  this.instance = kwargs.instance
  this.host = kwargs.host
  this.port = kwargs.port
  this.priority = kwargs.priority
  this.weight = kwargs.weight
  Object.freeze(this)
}

ServiceInstanceImplementation.prototype.type = null
ServiceInstanceImplementation.prototype.instance = null
ServiceInstanceImplementation.prototype.host = null
ServiceInstanceImplementation.prototype.port = null
ServiceInstanceImplementation.prototype.priority = null
ServiceInstanceImplementation.prototype.weight = null

ServiceInstanceImplementation.prototype.toJSON = function () {
  return {
    type: this.type,
    instance: this.instance,
    host: this.host,
    port: this.port,
    priority: this.priority,
    weight: this.weight
  }
}

const ServiceInstance = ServiceInstanceContract.implementation(ServiceInstanceImplementation)

ServiceInstance.prototype.invariants = [
  si => validate.isServiceTypeOrInstanceFqdn(si.type),
  si => validate.isServiceTypeOrInstanceFqdn(si.instance),
  si => validator.isFQDN(si.host),
  si => validate.isNatural(si.port, MAX_PORT),
  si => validate.isNatural(si.priority),
  si => validate.isNatural(si.weight),
  si => si.toJSON().type === si.type,
  si => si.toJSON().instance === si.instance,
  si => si.toJSON().host === si.host,
  si => si.toJSON().port === si.port,
  si => si.toJSON().priority === si.priority,
  si => si.toJSON().weight === si.weight
]

module.exports = ServiceInstance
