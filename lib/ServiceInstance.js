const Contract = require('@toryt/contracts-iii')
const validator = require('validator')

const ServiceInstanceContract = new Contract({
  pre: [
    function (kwargs) { return typeof kwargs === 'object' },
    function (kwargs) { return validator.isFQDN(kwargs.domain) },
    function (kwargs) { return kwargs.protocol === 'tcp' || kwargs.protocol === 'udp' }
  ],
  post: [
    function (kwargs) { return this.domain === kwargs.domain },
    function (kwargs) { return this.protocol === kwargs.protocol }
  ],
  exception: [
    /* istanbul ignore next : should not throw an exception */
    function () { return false }
  ]
})

const ServiceInstanceImplementation = function (kwargs) {
  this.domain = kwargs.domain
  this.protocol = kwargs.protocol
  Object.freeze(this)
}

Object.defineProperty(
  ServiceInstanceImplementation.prototype,
  'full',
  {
    configurable: false,
    enumerable: true,
    get: function () {
      return `_${this.protocol}.${this.domain}`
    },
    set: undefined
  }
)
ServiceInstanceImplementation.prototype.toJSON = function () {
  return {
    domain: this.domain,
    protocol: this.protocol,
    full: this.full
  }
}

const ServiceInstance = ServiceInstanceContract.implementation(ServiceInstanceImplementation)

ServiceInstance.prototype.invariants = [
  si => validator.isFQDN(si.domain),
  si => si.full === '_' + si.protocol + '.' + si.domain,
  si => si.toJSON().domain === si.domain,
  si => si.toJSON().protocol === si.protocol,
  si => si.toJSON().full === si.full
]

module.exports = ServiceInstance
