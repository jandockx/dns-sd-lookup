const Contract = require('@toryt/contracts-iii')
const validator = require('validator')

const ServiceInstanceContract = new Contract({
  pre: [
    function (kwargs) { return typeof kwargs === 'object' },
    function (kwargs) { return validator.isFQDN(kwargs.domain) }
  ],
  post: [
    function (kwargs) { return this.domain === kwargs.domain }
  ],
  exception: [
    /* istanbul ignore next : should not throw an exception */
    function () { return false }
  ]
})

const ServiceInstanceImplementation = function (kwargs) {
  this.domain = kwargs.domain
  Object.freeze(this)
}

const ServiceInstance = ServiceInstanceContract.implementation(ServiceInstanceImplementation)

ServiceInstance.prototype.invariants = [
  si => validator.isFQDN(si.domain)
]

module.exports = ServiceInstance
