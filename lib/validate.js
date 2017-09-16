const Contract = require('@toryt/contracts-iii')
const validator = require('validator')

const conditions = [
  function (fqdn) { return fqdn && validator.isFQDN(fqdn.replace(/[_ ]/g, '')) },
  function (fqdn) { return /^(.+\.)*_[^ _]+\._(tcp|udp)\..+$/.test(fqdn) } // TODO could be better
]

const isServiceTypeOrInstanceFqdn = new Contract({
  pre: [
    function (fqdn) { return !fqdn || typeof fqdn === 'string' }
  ],
  post: conditions.map(condition =>
    function (fqdn, result) { return !result || condition(fqdn) }
  ),
  exception: [
    /* istanbul ignore next : should not throw an exception */
    function () { return false }
  ]
})
.implementation(function isServiceTypeOrInstanceFqdn (fqdn) {
  return conditions.every(condition => condition(fqdn))
})

module.exports.conditions = conditions
module.exports.isServiceTypeOrInstanceFqdn = isServiceTypeOrInstanceFqdn
