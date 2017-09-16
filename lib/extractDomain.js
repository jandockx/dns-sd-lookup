const Contract = require('@toryt/contracts-iii')
const validator = require('validator')

const extractDomain = new Contract({
  pre: [
    function (fqdn) { return validator.isFQDN(fqdn.replace(/[_ ]/g, '')) },
    function (fqdn) { return /^(.+\.)*_.+\._(tcp|udp)\..+$/.test(fqdn) }
  ],
  post: [
    function (fqdn, result) { return !!result },
    function (fqdn, result) { return typeof result === 'string' },
    function (fqdn, result) { return fqdn.endsWith(result) },
    function (fqdn, result) { return result === fqdn.match(/^.+\._(tcp|udp)\.(.*)$/)[2] },
    function (fqdn, result) { return validator.isFQDN(result) }
  ],
  exception: [
    /* istanbul ignore next : should not throw an exception */
    function () { return false }
  ]
})
.implementation(function extractDomain (fqdn) {
  const parts = fqdn.split('.')
  const lastTcp = parts.lastIndexOf('_tcp')
  const lastUdp = parts.lastIndexOf('_udp')
  return parts.slice(Math.max(lastTcp, lastUdp) + 1).join('.')
})

module.exports = extractDomain
