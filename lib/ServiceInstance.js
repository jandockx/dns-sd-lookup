const Contract = require('@toryt/contracts-iii')
const validator = require('validator')

function isValidDomainNamePart (part) {
  // based on validator/lib/isFQDN.js
  return /^[a-z\u00a1-\uffff0-9-]+$/i.test(part) &&
         // disallow full-width chars
         !/[\uff01-\uff5e]/.test(part) &&
         part[0] !== '-' &&
         part[part.length - 1] !== '-'
}

const ServiceInstanceContract = new Contract({
  pre: [
    function (kwargs) { return typeof kwargs === 'object' },
    function (kwargs) { return validator.isFQDN(kwargs.domain) },
    function (kwargs) { return kwargs.protocol === 'tcp' || kwargs.protocol === 'udp' },
    function (kwargs) { return isValidDomainNamePart(kwargs.type) }
  ],
  post: [
    function (kwargs) { return this.domain === kwargs.domain },
    function (kwargs) { return this.protocol === kwargs.protocol },
    function (kwargs) { return this.type === kwargs.type }
  ],
  exception: [
    /* istanbul ignore next : should not throw an exception */
    function () { return false }
  ]
})

const ServiceInstanceImplementation = function (kwargs) {
  this.domain = kwargs.domain
  this.protocol = kwargs.protocol
  this.type = kwargs.type
  Object.freeze(this)
}

Object.defineProperty(
  ServiceInstanceImplementation.prototype,
  'full',
  {
    configurable: false,
    enumerable: true,
    get: function () {
      return `_${this.type}._${this.protocol}.${this.domain}`
    },
    set: undefined
  }
)
ServiceInstanceImplementation.prototype.toJSON = function () {
  return {
    domain: this.domain,
    protocol: this.protocol,
    type: this.type,
    full: this.full
  }
}

const ServiceInstance = ServiceInstanceContract.implementation(ServiceInstanceImplementation)

ServiceInstance.prototype.invariants = [
  si => validator.isFQDN(si.domain),
  si => si.full === '_' + si.type + '._' + si.protocol + '.' + si.domain,
  si => si.toJSON().domain === si.domain,
  si => si.toJSON().protocol === si.protocol,
  si => si.toJSON().type === si.type,
  si => si.toJSON().full === si.full
]

module.exports = ServiceInstance
