/*
 * MIT License
 *
 * Copyright (c) 2017-2020 Jan Dockx
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

function regexEscape (str) {
  return str.replace(/[.^$!?=+\\]/g, '\\$&')
}

const instanceOrType = [
  function (fqdn) {
    return validate.isServiceInstance(fqdn) || validate.isServiceType(fqdn)
  }
]

const extractDomain = new Contract({
  pre: instanceOrType,
  post: [
    function (fqdn, result) {
      return !!result
    },
    function (fqdn, result) {
      return typeof result === 'string'
    },
    function (fqdn, result) {
      return fqdn.endsWith(result)
    },
    function (fqdn, result) {
      return result === fqdn.match(/^.+\._(tcp|udp)\.(.*)$/)[2]
    },
    function (fqdn, result) {
      // noinspection JSUnresolvedFunction
      return validator.isFQDN(result)
    }
  ]
}).implementation(function extractDomain (fqdn) {
  const parts = fqdn.split('.')
  const lastTcp = parts.lastIndexOf('_tcp')
  const lastUdp = parts.lastIndexOf('_udp')
  return parts.slice(Math.max(lastTcp, lastUdp) + 1).join('.')
})

const extractProtocol = new Contract({
  pre: instanceOrType,
  post: [
    function (fqdn, result) {
      return result === 'udp' || result === 'tcp'
    },
    function (fqdn, result) {
      return result === fqdn.match(/^.+\._(tcp|udp)\.(.*)$/)[1]
    }
  ]
}).implementation(function extractDomain (fqdn) {
  const parts = fqdn.split('.')
  const lastTcp = parts.lastIndexOf('_tcp')
  const lastUdp = parts.lastIndexOf('_udp')
  return parts[Math.max(lastTcp, lastUdp)].substring(1)
})

const extractType = new Contract({
  pre: instanceOrType,
  post: [
    function (fqdn, result) {
      return (
        result ===
        fqdn.match(new RegExp(`^(?:.*\\.)*_(.*?)\\._${this.protocol(fqdn)}\\.${regexEscape(this.domain(fqdn))}$`))[1]
      )
    }
  ]
}).implementation(function extractDomain (fqdn) {
  const parts = fqdn.split('.')
  const lastTcp = parts.lastIndexOf('_tcp')
  const lastUdp = parts.lastIndexOf('_udp')
  return parts[Math.max(lastTcp, lastUdp) - 1].substring(1)
})

const extractInstance = new Contract({
  pre: [validate.isServiceInstance],
  post: [
    function (fqdn, result) {
      return (
        result ===
        fqdn.match(
          new RegExp(
            `^(.*)\\._${regexEscape(this.type(fqdn))}\\._${this.protocol(fqdn)}\\.${regexEscape(this.domain(fqdn))}$`
          )
        )[1]
      )
    }
  ]
}).implementation(function extractDomain (fqdn) {
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
  pre: [validate.isServiceType],
  post: [
    function (fqdn, result) {
      const matched = fqdn.match(
        new RegExp(
          `^(.*)\\._sub\\._${regexEscape(this.type(fqdn))}\\._${this.protocol(fqdn)}\\.${regexEscape(
            this.domain(fqdn)
          )}$`
        )
      )
      return result === (matched ? matched[1] : undefined)
    }
  ]
}).implementation(function extractDomain (fqdn) {
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
