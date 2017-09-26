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

const maxLength = 253
const maxLabelLength = 63

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
const roughBaseServiceTypeStr =
        `_([${labelCharsNoDashOrNumber}][${labelChars}]{1,13}[${labelCharsNoDashOrNumber}])\\.(?:_tcp|_udp)\\.(.*)`
const roughBaseServiceTypePattern = new RegExp(`^${roughBaseServiceTypeStr}$`, `i`)
const subtypeOrInstancePatternStr = `((?:[^.\\\\]|\\.|\\\\){1,${maxLabelLength}})\\.`
const serviceTypePattern =
        new RegExp(`^(?:${subtypeOrInstancePatternStr}_sub\\.)?(${roughBaseServiceTypeStr})$`, `i`)
const serviceInstancePattern =
        new RegExp(`^${subtypeOrInstancePatternStr}(${roughBaseServiceTypeStr})$`, `i`)

function isNotStringOrTooLong (str) {
  return !str || typeof str !== 'string' || str.length > 253
}

const isBaseServiceType = new Contract({
  post: [
    function (fullName, result) { return !result || (fullName && typeof fullName === 'string') },
    function (fullName, result) { return !result || roughBaseServiceTypePattern.test(fullName) },
    function (fullName, result) { return !result || roughBaseServiceTypePattern.exec(fullName)[1].indexOf('--') < 0 },
    function (fullName, result) { return !result || validator.isFQDN(roughBaseServiceTypePattern.exec(fullName)[2]) }
  ],
  exception: mustNotHappen
}).implementation(function isBaseService (fullName) {
  if (isNotStringOrTooLong(fullName)) {
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
  return validator.isFQDN(
    parts[2], // domain
    {
      requireTld: true,
      allowUnderscores: false,
      allowTrailingDot: false
    }
  )
})

const dotIsNotEscaped = /[^\\]\./
const backSlashIsNotEscaped = /[^\\]\./

const isServiceType = new Contract({
  post: [
    function (fullName, result) { return !result || (fullName && typeof fullName === 'string') },
    function (fullName, result) { return !result || serviceTypePattern.test(fullName) },
    function (fullName, result) { return !result || !dotIsNotEscaped.test(serviceTypePattern.exec(fullName)[1]) },
    function (fullName, result) { return !result || !backSlashIsNotEscaped.test(serviceTypePattern.exec(fullName)[1]) },
    function (fullName, result) { return !result || isBaseServiceType(serviceTypePattern.exec(fullName)[2]) }
  ],
  exception: mustNotHappen
}).implementation(function isServiceType (fullName) {
  if (isNotStringOrTooLong(fullName)) {
    return false
  }
  const parts = serviceTypePattern.exec(fullName)
  if (!parts || parts.length < 3) {
    return false
  }
  // parts[1] is the service name, and can be anything, as long as the labels are not longer than maxLabelLength
  return isBaseServiceType(parts[2])
})

const isServiceInstance = new Contract({
  post: [
    function (fullName, result) { return !result || (fullName && typeof fullName === 'string') },
    function (fullName, result) { return !result || serviceInstancePattern.test(fullName) },
    function (fullName, result) { return !result || !dotIsNotEscaped.test(serviceInstancePattern.exec(fullName)[1]) },
    function (fullName, result) { return !result || !backSlashIsNotEscaped.test(serviceInstancePattern.exec(fullName)[1]) },
    function (fullName, result) { return !result || isBaseServiceType(serviceInstancePattern.exec(fullName)[2]) }
  ],
  exception: mustNotHappen
}).implementation(function isServiceInstance (fullName) {
  if (isNotStringOrTooLong(fullName)) {
    return false
  }
  const parts = serviceInstancePattern.exec(fullName)
  if (!parts || parts.length < 3) {
    return false
  }
  // parts[1] is the service name, and can be anything, as long as the labels are not longer than maxLabelLength
  return isBaseServiceType(parts[2])
})

function isValidDomainNamePart (part) {
  // based on validator/lib/isFQDN.js
  return part &&
         typeof part === 'string' &&
         part.length <= maxLabelLength &&
         roughDomainNamePartRegex.test(part) &&
         // disallow full-width chars
         !notLabelChars.test(part) &&
         part[0] !== '-' &&
         part[part.length - 1] !== '-'
}

function isNatural (nr, /* Number= */ max) {
  return Number.isInteger(nr) && nr >= 0 && (!max || nr <= max)
}

module.exports.mustNotHappen = mustNotHappen
module.exports.maxLength = maxLength
module.exports.maxLabelLength = maxLabelLength
module.exports.isBaseServiceType = isBaseServiceType
module.exports.isServiceType = isServiceType
module.exports.isServiceInstance = isServiceInstance
module.exports.isValidDomainNamePart = isValidDomainNamePart
module.exports.isNatural = isNatural
