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

const roughBaseServiceTypeStr =
        `_([${labelCharsNoDashOrNumber}][${labelChars}]{1,13}[${labelCharsNoDashOrNumber}])\\.(?:_tcp|_udp)\\.(.*)`
const roughBaseServiceTypePattern = new RegExp(`^${roughBaseServiceTypeStr}$`, `i`)
const subtypeOrInstancePatternStr = `(?:[^.\\\\]|\\\\\\.|\\\\\\\\){1,${maxLabelLength}}`
// any character, except a naked dot or backslash, or a backslash (\\) followed by a dot (\.), or 2 backslashes (\\\\)
const subtypeOrInstancePattern = new RegExp(`^${subtypeOrInstancePatternStr}$`, 'i')
const subtypeOrInstanceMatchPatternStr = `(${subtypeOrInstancePatternStr})\\.`
const serviceTypePattern =
        new RegExp(`^(?:${subtypeOrInstanceMatchPatternStr}_sub\\.)?(${roughBaseServiceTypeStr})$`, 'i')
const serviceInstancePattern =
        new RegExp(`^${subtypeOrInstanceMatchPatternStr}(${roughBaseServiceTypeStr})$`, 'i')

function isNotStringOrTooLong (str) {
  return !str || typeof str !== 'string' || str.length > maxLength
}

function result (/* arguments */ args) {
  return args[args.length - 2]
}

/**
 * <p>{@code label} is a valid DNS-SD subtype or short instance name.</p>
 * <p>This means it is a DNS <em>label</em>, with dots and backslashes escaped. A DNS label consists of at least 1,
 *   and not more then 63 characters ('octets'). Any character (octet) is allowed in a DNS label.
 *  (This in contrast to an <em>host name</em>, the parts of an <em>internet host name</em>, or of a DNS <em>domain</em>
 *  or <em>subdomain</em>, for which the characters are limited. E.g., they cannot contain '_' or spaces, control
 *  characters, etc.</p>
 */
const isSubtypeOrInstanceName = new Contract({
  post: [
    function (label) {
      // noinspection JSCheckFunctionSignatures
      return !result(arguments) || (label && typeof label === 'string')
    },
    function (label) {
      // noinspection JSCheckFunctionSignatures
      return !result(arguments) || (label.length > 0 && label.length <= maxLabelLength)
    },
    function (label) {
      // noinspection JSCheckFunctionSignatures
      return !result(arguments) || !/[^\\]\./.test(label)
    },
    function (label) {
      // noinspection JSCheckFunctionSignatures
      return !result(arguments) || !/[^\\]\\/.test(label)
    }
  ],
  exception: mustNotHappen
}).implementation(function isSubtypeOrInstanceName (label) {
  return !!label && typeof label === 'string' && subtypeOrInstancePattern.test(label)
})

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

function isNatural (nr, /* Number= */ max) {
  return Number.isInteger(nr) && nr >= 0 && (!max || nr <= max)
}

module.exports.mustNotHappen = mustNotHappen
module.exports.maxLength = maxLength
module.exports.maxLabelLength = maxLabelLength
module.exports.subtypeOrInstance = subtypeOrInstancePattern
module.exports.isSubtypeOrInstanceName = isSubtypeOrInstanceName
module.exports.isBaseServiceType = isBaseServiceType
module.exports.serviceType = serviceTypePattern
module.exports.isServiceType = isServiceType
module.exports.serviceInstance = serviceInstancePattern
module.exports.isServiceInstance = isServiceInstance
module.exports.isNatural = isNatural
