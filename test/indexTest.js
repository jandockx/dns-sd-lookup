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

const index = require('../index')

describe('dns-sd-lookup', function () {
  it('is an object with the expected properties', function () {
    index.must.be.an.object()
    index.must.have.property('ServiceInstance', require('../lib/ServiceInstance'))
    const validate = require('../lib/validate')
    index.must.have.property('validate', validate)
    index.must.have.property('isValidDomainNamePart', validate.isValidDomainNamePart)
    index.must.have.property('isBaseServiceType', validate.isBaseServiceType)
    index.must.have.property('isServiceType', validate.isServiceType)
    index.must.have.property('isServiceInstance', validate.isServiceInstance)
    const extract = require('../lib/extract')
    index.must.have.property('extract', extract)
    index.must.have.property('extractInstance', extract.instance)
    index.must.have.property('extractSubtype', extract.subtype)
    index.must.have.property('extractType', extract.type)
    index.must.have.property('extractProtocol', extract.protocol)
    index.must.have.property('extractDomain', extract.domain)
    index.must.have.property('lookupInstance', require('../lib/lookupInstance'))
    index.must.have.property('discover', require('../lib/discover'))
    index.must.have.property('selectInstance', require('../lib/selectInstance'))
  })
})
