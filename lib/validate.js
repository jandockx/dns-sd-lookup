/*
 * MIT License
 *
 * Copyright (c) 2017-2017 Jan Dockx
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

const Contract = require('@toryt/contracts-iii')
const validator = require('validator')

const mustNotHappen = [
  /* istanbul ignore next : must never be called */
  function () { return false }
]

/**
 * To-permissive pattern for characters allowed in DNS label, dash not allowed
 */
const labelCharsNoDashOrNumber = 'a-z\u00a1-\uffff'

/**
 * To-permissive pattern for characters allowed in DNS label
 */
const labelChars = labelCharsNoDashOrNumber + '0-9-'

/**
 * Characters not allowed in DNS label, although they are labelChars
 */
const notLabelChars = /[\uff01-\uff5e]/

const roughDomainNamePartRegex = new RegExp(`^[${labelChars}]+$`, 'i')
const roughBaseServiceTypePattern =
  new RegExp(
    `^_([${labelCharsNoDashOrNumber}][${labelChars}]{1,13}[${labelCharsNoDashOrNumber}])\\.(?:_tcp|_udp)\\.(.*)$`,
    `i`
  )

const isBaseServiceType = new Contract({
  post: [
    function (fullName, result) { return !result || (fullName && typeof fullName === 'string') },
    function (fullName, result) { return !result || roughBaseServiceTypePattern.test(fullName) },
    function (fullName, result) { return !result || roughBaseServiceTypePattern.exec(fullName)[1].indexOf('--') < 0 },
    function (fullName, result) { return !result || validator.isFQDN(roughBaseServiceTypePattern.exec(fullName)[2]) }
  ],
  exception: mustNotHappen
}).implementation(function isServiceTypeOrInstanceFqdn (fullName) {
  if (!fullName || typeof fullName !== 'string') {
    return false
  }
  const parts = roughBaseServiceTypePattern.exec(fullName)
  if (!parts || parts.length < 3) {
    return false
  }
  const serviceName = parts[1] // RFC 6335
  if (serviceName.indexOf('--') > 0) {
    return false
  }
  return validator.isFQDN(parts[2]) // domain
})

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
  exception: mustNotHappen
})
.implementation(function isServiceTypeOrInstanceFqdn (fqdn) {
  return conditions.every(condition => condition(fqdn))
})

function isValidDomainNamePart (part) {
  // based on validator/lib/isFQDN.js
  return part &&
         typeof part === 'string' &&
         part.length <= 63 &&
         roughDomainNamePartRegex.test(part) &&
         // disallow full-width chars
         !notLabelChars.test(part) &&
         part[0] !== '-' &&
         part[part.length - 1] !== '-'
}

function isNatural (nr, /* Number= */ max) {
  return Number.isInteger(nr) && nr >= 0 && (!max || nr <= max)
}

module.exports.conditions = conditions
module.exports.isBaseServiceType = isBaseServiceType
module.exports.isServiceTypeOrInstanceFqdn = isServiceTypeOrInstanceFqdn
module.exports.isValidDomainNamePart = isValidDomainNamePart
module.exports.isNatural = isNatural
