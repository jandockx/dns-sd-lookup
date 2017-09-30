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

describe('doc examples', function () {
  it('ServiceInstance', function () {
    const ServiceInstance = require('../index').ServiceInstance

    const instance = new ServiceInstance({
      type: 'sub type._sub._a-service-type._tcp.dns-sd-lookup.toryt.org',
      instance: 'A Service Instance._a-service-type._tcp.dns-sd-lookup.toryt.org',
      host: 'service-host.dns-sd-lookup.toryt.org',
      port: 443,
      priority: 0,
      weight: 0,
      details: {
        at: JSON.stringify(new Date(2017, 9, 17, 0, 33, 14.535)),
        path: '/a/path',
        '%boolean#true]': true,
        'boolean@false~': false,
        txtvers: '23'
      }
    })

    console.log(instance)
    console.log('%j', instance)
  })
  it('validate', function () {
    const validate = require('../index').validate

    console.assert(validate.isBaseServiceType === require('../index').isBaseServiceType)
    console.assert(validate.isServiceType === require('../index').isServiceType)
    console.assert(validate.isServiceInstance === require('../index').isServiceInstance)
  })
})
