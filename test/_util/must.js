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

require('must/register') // registers .must on Object.prototype
const Must = this.must.constructor // get the Must constructor

/**
 * Tests that the subject has a property {@code invariants} that is an Array of functions,
 * and asserts the result of each of these functions, called with the subject as only parameter.
 */
/* IDEA: it would be nicer to .call the invariants on this.actual, so we can write the functions using this.
   However, than we cannot use arrow functions, and we have to use function() functions: we cannot associate
   a this, even with .call or .apply, to an arrow function. */
Must.prototype.valid = function () {
  this.assert(this.actual.invariants instanceof Array, 'have an array of invariants')
  this.actual.invariants.forEach(invar => {
    this.assert(typeof invar === 'function', 'have functions as invariants (' + invar + ' is not)')
    this.assert(invar(this.actual), 'adhere to ' + invar)
  })
}
