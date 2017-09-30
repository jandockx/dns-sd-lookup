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

/* eslint-env mocha */

const extendWithTxtStr = require('../../lib/extendWithTxtStr')

const attributeName = 'attribute'
const attributeValue = 'attributeValue'

describe('extendWithTxtStr', function () {
  beforeEach(function () {
    this.preExistingValue = 'pre-existing value'
    this.subject = {
      'pre-existing': this.preExistingValue
    }
  })

  describe('simple name and value', function () {
    const txtStr = `${attributeName}=${attributeValue}`
    it(`works for txt ${txtStr}`, function () {
      extendWithTxtStr(this.subject, txtStr)
      this.subject['pre-existing'].must.equal(this.preExistingValue)
      this.subject[attributeName].must.equal(attributeValue)
      console.log(this.subject)
    })
  })
  describe('special values', function () {
    const cases = [
      '',
      'attribute value with ¨^é ∆ some weird characters',
      'attribute = value with ='
    ]
    cases.forEach(value => {
      it(`works for value ${value}`, function () {
        const txtStr = `${attributeName}=${value}`
        extendWithTxtStr(this.subject, txtStr)
        this.subject['pre-existing'].must.equal(this.preExistingValue)
        this.subject[attributeName].must.equal(value)
        console.log(this.subject)
      })
    })
  })
  describe('special attribute names', function () {
    const cases = [
      '',
      'attributeName',
      'attribute name with space',
      'pre-existing',
      'pre-Existing'
    ]
    for (let i = ' '.charCodeAt(0); i <= '~'.charCodeAt(0); i++) {
      const char = String.fromCharCode(i)
      if (char !== '=') {
        cases.push(char)
      }
    }
    cases.forEach(name => {
      const txtStr = `${name}=${attributeValue}`
      it(`works for ${txtStr}`, function () {
        extendWithTxtStr(this.subject, txtStr)
        this.subject['pre-existing'].must.equal(this.preExistingValue)
        if (name && name.toLowerCase() !== 'pre-existing') {
          this.subject[name.toLowerCase()].must.equal(attributeValue)
        }
        console.log(this.subject)
      })
    })
  })
  it(`works for boolean attribute`, function () {
    extendWithTxtStr(this.subject, attributeName)
    this.subject['pre-existing'].must.equal(this.preExistingValue)
    this.subject[attributeName].must.be.true()
    console.log(this.subject)
  })
})
