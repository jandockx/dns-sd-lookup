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

/* eslint-env mocha */

const serviceTypePostfix = '._tcp.dns-sd-lookup.toryt.org'
const serviceTypeNInstancesWithWeight = '_t8i-n-inst' + serviceTypePostfix
const manyInstanceCount = 12
const discover = require('../../lib/discover')

describe('discover not in order of priority', function () {
  it(`discovers ${manyInstanceCount} instances, not in order of priority`, function () {
    /* This tests makes sure instances in the next test are discovered out of priority order.
       For some reason, this does not seem to be the case on Node 12 / Travis (but not a problem on Node 6, 8, 10,
       nor Node 12 on macOS). */
    return discover(serviceTypeNInstancesWithWeight).then(instances => {
      instances.length.should.equal(1/*manyInstanceCount*/)
      console.log(instances)
      console.log(`unsorted priorities: ${instances.map(i => i.priority)}`)
      // should not be ordered
      instances.some((instance, index) => index > 0 && instance.priority < instances[index - 1].priority)
        .should.be.true()
      instances.some((instance, index) => index > 0 && instance.priority > instances[index - 1].priority)
        .should.be.true()
    })
  })
})
