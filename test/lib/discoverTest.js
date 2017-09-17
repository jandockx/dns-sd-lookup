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

const discover = require('../../lib/discover')
const ServiceInstance = require('../../lib/ServiceInstance')

// noinspection SpellCheckingInspection
const serviceType = '_test._sub._unittest._tcp.dns-sd-lookup.toryt.org'

describe('discover', function () {
  it('works in the nominal case', function () {
    // noinspection JSUnresolvedVariable
    return discover(serviceType).must.fulfill(details => {
      details.must.be.an.array()
      details.forEach(d => d.must.be.an.instanceof(ServiceInstance))
      console.log(details)
    })
  })
  it('works with a death in the nominal case', function () {
    // noinspection JSUnresolvedVariable
    return discover(serviceType, ['test_instance_unit_test1a._tcp.dns-sd-lookup.toryt.org']).must.fulfill(details => {
      details.must.be.an.array()
      console.log(details)
    })
  })
})
