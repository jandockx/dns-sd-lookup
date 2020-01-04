/*
 * MIT License
 *
 * Copyright (c) 2017-2019 Jan Dockx
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

const should = require('should')
// noinspection JSUnresolvedVariable
const Assertion = should.Assertion

Assertion.add('RegExp', function () {
  // noinspection JSUnusedGlobalSymbols
  this.params = {
    actual: this.obj,
    operator: 'to be a Regular Expression'
  }
  this.be.an.instanceof(RegExp)
})

Assertion.add('frozen', function () {
  // noinspection JSUnusedGlobalSymbols
  this.params = {
    actual: this.obj,
    operator: 'to be frozen'
  }
  this.assert(Object.isFrozen(this.obj))
})

// noinspection JSUnresolvedFunction
Assertion.alias('below', 'before')
// noinspection JSUnresolvedFunction
Assertion.alias('above', 'after')

/**
 * Tests that the object, which is supposed to boolean function, returns true when called with the `subject` argument.
 * (`should.match` only fails when `false` is returned exactly)
 */
Assertion.add('upheldBy', function (subject) {
  // noinspection JSUnusedGlobalSymbols
  this.params = {
    actual: typeof this.obj === 'function' ? this.obj.name || '' + this.obj : this.obj,
    operator: 'to be upheld by',
    expected: subject
  }
  this.is.a.Function()
  should(this.obj(subject)).be.ok()
})

/**
 * Tests that the subject has a property {@code invariants} that is an Array of functions,
 * and asserts the result of each of these functions, called with the subject as only parameter.
 */
/* IDEA: it would be nicer to .call the invariants on this.actual, so we can write the functions using this.
   However, than we cannot use arrow functions, and we have to use function() functions: we cannot associate
   a this, even with .call or .apply, to an arrow function. */
Assertion.add('valid', function () {
  // noinspection JSUnusedGlobalSymbols
  this.params = {
    actual: this.obj,
    operator: 'to adhere to its invariants'
  }
  should(this.obj)
    .have.property('invariants')
    .which.is.an.Array()
  this.obj.invariants.forEach(invar => {
    should(invar).be.upheldBy(this.obj)
  })
})
