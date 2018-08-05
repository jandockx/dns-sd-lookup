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

const Contract = require('@toryt/contracts-iv')

const txtStrPattern = /^([ -<>-~]+)(?:=(.*))?$/

const extendWithTxtStrContract = (function () {
  let old = {}

  return new Contract({
    pre: [
      function (obj) { return obj && typeof obj === 'object' },
      function (obj) {
        old.obj = {}
        Object.keys(obj).forEach(k => { old.obj[k] = obj[k] })
        return true
      },
      function (obj, txtStr) { return typeof txtStr === 'string' }
    ],
    post: [
      function (obj, txtStr) {
        const result = arguments[arguments.length - 2]
        return result === obj
      },
      function (obj, txtStr) {
        const result = arguments[arguments.length - 2]
        const parts = txtStrPattern.exec(txtStr)
        const key = parts && parts[1].toLowerCase()
        return Object.keys(old.obj).every(k => result[k] === old.obj[k]) &&
          (!key || key in old.obj || result[key] === (parts[2] !== undefined ? parts[2] : true))
      }
    ]
  })
})()

const extendWithTxtStr = extendWithTxtStrContract
  .implementation(function extendWithTxtStr (/* Object */ obj, /* string */ txtStr) {
    const parts = txtStrPattern.exec(txtStr)
    if (parts) {
      const key = parts[1].toLowerCase()
      if (!(key in obj)) {
        obj[key] = parts[2] === undefined ? true : parts[2]
      }
    }
    return obj
  })

module.exports = extendWithTxtStr
