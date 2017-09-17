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

function isValidDomainNamePart (part) {
  // based on validator/lib/isFQDN.js
  return /^[a-z\u00a1-\uffff0-9-]+$/i.test(part) &&
         // disallow full-width chars
         !/[\uff01-\uff5e]/.test(part) &&
         part[0] !== '-' &&
         part[part.length - 1] !== '-'
}

function isNatural (nr, /* Number= */ max) {
  return Number.isInteger(nr) && nr >= 0 && (!max || nr <= max)
}

module.exports.conditions = conditions
module.exports.isServiceTypeOrInstanceFqdn = isServiceTypeOrInstanceFqdn
module.exports.isValidDomainNamePart = isValidDomainNamePart
module.exports.isNatural = isNatural
