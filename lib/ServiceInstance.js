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

/**
 * The subtype is optional. If it is provided, it is used as is. An underscore in the front
 * would be part of the name. It is not necessary for DNS-SD.
 */
const ServiceInstanceContract = new Contract({
  pre: [
    function (kwargs) { return typeof kwargs === 'object' },
    function (kwargs) { return validator.isFQDN(kwargs.domain) },
    function (kwargs) { return kwargs.protocol === 'tcp' || kwargs.protocol === 'udp' },
    function (kwargs) { return isValidDomainNamePart(kwargs.type) },
    function (kwargs) { return !kwargs.subtype || typeof kwargs.subtype === 'string' },
    function (kwargs) { return typeof kwargs.instance === 'string' }
  ],
  post: [
    function (kwargs) { return this.domain === kwargs.domain },
    function (kwargs) { return this.protocol === kwargs.protocol },
    function (kwargs) { return this.type === kwargs.type },
    function (kwargs) {
      return this.subtype === (kwargs.subtype || undefined)
    },
    function (kwargs) { return this.instance === kwargs.instance }
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
  this.subtype = kwargs.subtype || undefined
  this.instance = kwargs.instance
  Object.freeze(this)
}

Object.defineProperty(
  ServiceInstanceImplementation.prototype,
  'fullInstance',
  {
    configurable: false,
    enumerable: true,
    get: function () {
      return `${this.instance}._${this.type}._${this.protocol}.${this.domain}`
    },
    set: undefined
  }
)
Object.defineProperty(
  ServiceInstanceImplementation.prototype,
  'fullMainType',
  {
    configurable: false,
    enumerable: true,
    get: function () {
      return `_${this.type}._${this.protocol}.${this.domain}`
    },
    set: undefined
  }
)
Object.defineProperty(
  ServiceInstanceImplementation.prototype,
  'fullType',
  {
    configurable: false,
    enumerable: true,
    get: function () {
      return this.subtype ? `${this.subtype}.${this.fullMainType}` : this.fullMainType
    },
    set: undefined
  }
)
ServiceInstanceImplementation.prototype.toJSON = function () {
  return {
    domain: this.domain,
    protocol: this.protocol,
    type: this.type,
    subtype: this.subtype,
    instance: this.instance,
    fullInstance: this.fullInstance,
    fullMainType: this.fullMainType,
    fullType: this.fullType
  }
}

const ServiceInstance = ServiceInstanceContract.implementation(ServiceInstanceImplementation)

ServiceInstance.prototype.invariants = [
  si => validator.isFQDN(si.domain),
  si => si.fullInstance === si.instance + '._' + si.type + '._' + si.protocol + '.' + si.domain,
  si => si.fullMainType === '_' + si.type + '._' + si.protocol + '.' + si.domain,
  si => !!si.subtype || si.fullType === si.fullMainType,
  si => !si.subtype || si.fullType === si.subtype + '.' + si.fullMainType,
  si => si.toJSON().domain === si.domain,
  si => si.toJSON().protocol === si.protocol,
  si => si.toJSON().type === si.type,
  si => si.toJSON().subtype === si.subtype,
  si => si.toJSON().instance === si.instance,
  si => si.toJSON().fullInstance === si.fullInstance,
  si => si.toJSON().fullMainType === si.fullMainType,
  si => si.toJSON().fullType === si.fullType
]

module.exports = ServiceInstance
