const Contract = require('@toryt/contracts-iii')
const validate = require('./validate')

/**
 * Usually the type and instance are in the same domain, but that is not a condition of DNS-SD.
 */
const ServiceInstanceContract = new Contract({
  pre: [
    function (kwargs) { return typeof kwargs === 'object' },
    function (kwargs) { return validate.isServiceTypeOrInstanceFqdn(kwargs.type) },
    function (kwargs) { return validate.isServiceTypeOrInstanceFqdn(kwargs.instance) }
  ],
  post: [
    function (kwargs) { return this.type === kwargs.type },
    function (kwargs) { return this.instance === kwargs.instance }
  ],
  exception: [
    /* istanbul ignore next : should not throw an exception */
    function () { return false }
  ]
})

const ServiceInstanceImplementation = function (kwargs) {
  this.type = kwargs.type
  this.instance = kwargs.instance
  Object.freeze(this)
}

ServiceInstanceImplementation.prototype.type = null
ServiceInstanceImplementation.prototype.instance = null

ServiceInstanceImplementation.prototype.toJSON = function () {
  return {
    type: this.type,
    instance: this.instance
  }
}

const ServiceInstance = ServiceInstanceContract.implementation(ServiceInstanceImplementation)

ServiceInstance.prototype.invariants = [
  si => validate.isServiceTypeOrInstanceFqdn(si.type),
  si => validate.isServiceTypeOrInstanceFqdn(si.instance),
  si => si.toJSON().type === si.type,
  si => si.toJSON().instance === si.instance
]

module.exports = ServiceInstance
