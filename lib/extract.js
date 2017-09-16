const Contract = require('@toryt/contracts-iii')
const validator = require('validator')

function regexEscape (str) {
  return str.replace(/[.^$!?=+\\]/g, '\\$&')
}

const serviceTypeOrInstanceFqdn = [
  function (fqdn) { return validator.isFQDN(fqdn.replace(/[_ ]/g, '')) },
  function (fqdn) { return /^(.+\.)*_.+\._(tcp|udp)\..+$/.test(fqdn) }
]

const extractDomain = new Contract({
  pre: serviceTypeOrInstanceFqdn,
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

const extractProtocol = new Contract({
  pre: serviceTypeOrInstanceFqdn,
  post: [
    function (fqdn, result) { return result === 'udp' || result === 'tcp' },
    function (fqdn, result) { return result === fqdn.match(/^.+\._(tcp|udp)\.(.*)$/)[1] }
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
  return parts[Math.max(lastTcp, lastUdp)].substring(1)
})

const extractType = new Contract({
  pre: serviceTypeOrInstanceFqdn,
  post: [
    function (fqdn, result) {
      return result ===
        fqdn.match(
          new RegExp(
            `^(?:.*\\.)*_(.*?)\\._${this.protocol(fqdn)}\\.${regexEscape(this.domain(fqdn))}$`
          )
        )[1]
    }
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
  return parts[Math.max(lastTcp, lastUdp) - 1].substring(1)
})

const extractInstance = new Contract({
  pre: serviceTypeOrInstanceFqdn,
  post: [
    function (fqdn, result) {
      return result ===
        fqdn.match(
          new RegExp(
            `^(.*)\\._${regexEscape(this.type(fqdn))}\\._${this.protocol(fqdn)}\\.${regexEscape(this.domain(fqdn))}$`
          )
        )[1]
    }
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
  return parts[Math.max(lastTcp, lastUdp) - 2]
})

/**
 * This is essentially the same as extracting an instance name, except that
 * - there might not be a subtype; we return `undefined`
 * - we skip the '._sub' domain name part
 * According to DNS-SD, a subtype does not have to start with a '_'. Therefor,
 * if there is a starting '_', it is part of the name, and not removed.
 */
const extractSubtype = new Contract({
  pre: serviceTypeOrInstanceFqdn,
  post: [
    function (fqdn, result) {
      const matched = fqdn.match(
        new RegExp(
          `^(.*)\\._sub\\._${regexEscape(this.type(fqdn))}\\._${this.protocol(fqdn)}\\.${regexEscape(this.domain(fqdn))}$`
        )
      )
      return result === (matched ? matched[1] : undefined)
    }
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
  // -1 is the service, -2 would be '_sub', everything earlier is what we want
  return parts.slice(0, Math.max(lastTcp, lastUdp, 2) - 2).join('.') || undefined
})

module.exports.domain = extractDomain
module.exports.protocol = extractProtocol
module.exports.type = extractType
module.exports.instance = extractInstance
module.exports.subtype = extractSubtype
