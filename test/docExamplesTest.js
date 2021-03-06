/*
 * MIT License
 *
 * Copyright (c) 2017-2020 Jan Dockx
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
  it('isSubtypeOrInstanceName', function () {
    const isSubtypeOrInstanceName = require('../index').isSubtypeOrInstanceName

    console.assert(isSubtypeOrInstanceName('any ∆é^# ï € / octet! is all0wed'))
    console.assert(isSubtypeOrInstanceName('dots\\.must\\.be\\.escaped'))
    console.assert(isSubtypeOrInstanceName('backslash\\\\must\\\\be\\\\escaped'))

    console.assert(!isSubtypeOrInstanceName('aLabelThatIsLongerThanIsAcceptableWhichIs63ACharactersLongLabels'))
    console.assert(!isSubtypeOrInstanceName('label.with.unescaped.dot'))
    console.assert(!isSubtypeOrInstanceName('label with \\gratuitous escape'))
  })
  it('isBaseServiceType', function () {
    const isBaseServiceType = require('../index').isBaseServiceType

    console.assert(isBaseServiceType('_a-service-type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(isBaseServiceType('_a-service-type._udp.dns-sd-lookup.toryt.org'))
    console.assert(isBaseServiceType('_http._udp.dns-sd-lookup.toryt.org'))

    console.assert(!isBaseServiceType('sub type._sub._a-service-type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isBaseServiceType('_a-service-type-that-is-too-long._tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isBaseServiceType('._tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isBaseServiceType('_tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isBaseServiceType('_not-a-type.dns-sd-lookup.toryt.org'))
    console.assert(!isBaseServiceType('_not-a-type._other.dns-sd-lookup.toryt.org'))
    console.assert(!isBaseServiceType('_not-a-type._tcp.not_a_fqdn'))
    console.assert(!isBaseServiceType('_not a type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isBaseServiceType('not-a-type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isBaseServiceType('_not-a--type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isBaseServiceType('_not_a_type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isBaseServiceType('_not a type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isBaseServiceType('_9not-a-type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isBaseServiceType('_not-a-type9._tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isBaseServiceType('_-not-a-type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isBaseServiceType('_not-a-type-._tcp.dns-sd-lookup.toryt.org'))
  })
  it('isServiceType', function () {
    const isServiceType = require('../index').isServiceType

    console.assert(isServiceType('_a-service-type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(isServiceType('_sub-type._sub._a-service-type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(isServiceType('sub type._sub._a-service-type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(isServiceType('_a\\.complex\\\\sub\\.service._sub._a-service-type._tcp.dns-sd-lookup.toryt.org'))

    console.assert(!isServiceType('sub type._not-a-type._other.dns-sd-lookup.toryt.org'))
    console.assert(!isServiceType('_sub._a-service-type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isServiceType('._sub._a-service-type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isServiceType('unescaped.dot._sub._a-service-type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isServiceType('unescaped\\backslash._sub._a-service-type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(
      !isServiceType(
        'ThisIsLongerThanTheMaximumLengthWhichIs63CharactersForAnDNSLabel._sub._a-service-type._tcp.dns-sd-lookup.toryt.org'
      )
    )
  })
  it('isServiceInstance', function () {
    const isServiceInstance = require('../index').isServiceInstance

    // noinspection SpellCheckingInspection
    console.assert(isServiceInstance('Instance Sérvice ∆._a-service-type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(
      isServiceInstance(
        'instances\\.with\\.escaped\\\\dots\\\\and\\.slashes._a-service-type._tcp.dns-sd-lookup.toryt.org'
      )
    )

    console.assert(!isServiceInstance('instance._not-a-type._other.dns-sd-lookup.toryt.org'))
    console.assert(!isServiceInstance('instance._tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isServiceInstance('_a-service-type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isServiceInstance('._a-service-type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isServiceInstance('unescaped.dot._a-service-type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(!isServiceInstance('unescaped\\backslash._a-service-type._tcp.dns-sd-lookup.toryt.org'))
    console.assert(
      !isServiceInstance(
        'anInstanceThatIsLongerThanIsAcceptableWhichIs63ACharactersLabels._a-service-type._tcp.dns-sd-lookup.toryt.org'
      )
    )
  })
  it('validate', function () {
    const validate = require('../index').validate

    console.assert(validate.isBaseServiceType === require('../index').isBaseServiceType)
    console.assert(validate.isServiceType === require('../index').isServiceType)
    console.assert(validate.isServiceInstance === require('../index').isServiceInstance)
  })
  describe('extract', function () {
    it('#subtype', function () {
      const extract = require('../index').extract

      console.assert(extract.subtype('_a-service-type._tcp.dns-sd-lookup.toryt.org') === undefined)
      console.assert(
        extract.subtype('_a-sub-service._sub._a-service-type._tcp.dns-sd-lookup.toryt.org') === '_a-sub-service'
      )

      console.log(extract.subtype('_a-service-type._tcp.dns-sd-lookup.toryt.org'))
      console.log(extract.subtype('_a-sub-service._sub._a-service-type._tcp.dns-sd-lookup.toryt.org'))
    })
    it('#type', function () {
      const extract = require('../index').extract

      console.assert(extract.type('_a-service-type._tcp.dns-sd-lookup.toryt.org') === 'a-service-type')
      console.assert(
        extract.type('_a-sub-service._sub._a-service-type._tcp.dns-sd-lookup.toryt.org') === 'a-service-type'
      )
      console.assert(extract.type('Service Instance._a-service-type._tcp.dns-sd-lookup.toryt.org') === 'a-service-type')

      console.log(extract.type('_a-service-type._tcp.dns-sd-lookup.toryt.org'))
      console.log(extract.type('_a-sub-service._sub._a-service-type._tcp.dns-sd-lookup.toryt.org'))
      console.log(extract.type('Service Instance._a-service-type._tcp.dns-sd-lookup.toryt.org'))
    })
    it('#instance', function () {
      const extract = require('../index').extract

      console.assert(
        extract.instance('Service Instance._a-service-type._tcp.dns-sd-lookup.toryt.org') === 'Service Instance'
      )

      console.log(extract.instance('Service Instance._a-service-type._tcp.dns-sd-lookup.toryt.org'))
    })
    it('#protocol', function () {
      const extract = require('../index').extract

      console.assert(extract.protocol('_a-service-type._tcp.dns-sd-lookup.toryt.org') === 'tcp')
      console.assert(extract.protocol('_a-sub-service._sub._a-service-type._udp.dns-sd-lookup.toryt.org') === 'udp')
      console.assert(extract.protocol('Service Instance._a-service-type._tcp.dns-sd-lookup.toryt.org') === 'tcp')

      console.log(extract.protocol('_a-service-type._tcp.dns-sd-lookup.toryt.org'))
      console.log(extract.protocol('_a-sub-service._sub._a-service-type._udp.dns-sd-lookup.toryt.org'))
      console.log(extract.protocol('Service Instance._a-service-type._tcp.dns-sd-lookup.toryt.org'))
    })
    it('#domain', function () {
      const extract = require('../index').extract

      console.assert(extract.domain('_a-service-type._tcp.dns-sd-lookup.toryt.org') === 'dns-sd-lookup.toryt.org')
      console.assert(
        extract.domain('_a-sub-service._sub._a-service-type._udp.dns-sd-lookup.toryt.org') === 'dns-sd-lookup.toryt.org'
      )
      console.assert(
        extract.domain('Service Instance._a-service-type._tcp.dns-sd-lookup.toryt.org') === 'dns-sd-lookup.toryt.org'
      )

      console.log(extract.domain('_a-service-type._tcp.dns-sd-lookup.toryt.org'))
      console.log(extract.domain('_a-sub-service._sub._a-service-type._udp.dns-sd-lookup.toryt.org'))
      console.log(extract.domain('Service Instance._a-service-type._tcp.dns-sd-lookup.toryt.org'))
    })
  })
  it('extendWithTxtStr', function () {
    const extendWithTxtStr = require('../index').extendWithTxtStr

    const obj = {
      existing: 'existing property'
    }
    extendWithTxtStr(obj, 'newProperty=new property value')
    // noinspection JSUnresolvedVariable
    console.assert(obj.newproperty === 'new property value')
    extendWithTxtStr(obj, 'existing=override')
    console.assert(obj.existing === 'existing property')
    extendWithTxtStr(obj, '=this is not a valid attribute')
    console.assert(obj[''] === undefined)
    extendWithTxtStr(obj, 'empty string attribute=')
    console.assert(obj['empty string attribute'] === '')
    extendWithTxtStr(obj, 'boolean attribute')
    console.assert(obj['boolean attribute'] === true)

    console.log('%j', obj)
  })
  it('lookupInstance', async function () {
    const lookupInstance = require('../index').lookupInstance

    const serviceInstance = await lookupInstance('instance_1._t1i-no-sub._tcp.dns-sd-lookup.toryt.org')
    console.log('%j', serviceInstance)
  })
  it('lookupInstance', async function () {
    const lookupInstance = require('../index').lookupInstance

    const serviceInstance = await lookupInstance('instance_1._t1i-no-sub._tcp.dns-sd-lookup.toryt.org')
    console.log('%j', serviceInstance)
  })
  it('discover', async function () {
    const discover = require('../index').discover

    const serviceType = '_t8i-n-inst._tcp.dns-sd-lookup.toryt.org'
    let deaths = [
      'instance_8c',
      'instance_8e',
      'instance_8g',
      'instance_8h',
      'instance_8i',
      'instance_8k',
      'instance_8l'
    ]
    deaths = deaths.map(d => `${d}.${serviceType}`)

    const serviceInstances = await discover(serviceType, discover.notOneOf(deaths))
    console.log('%j', serviceInstances)
  })
  it('selectInstance', async function () {
    const selectInstance = require('../index').selectInstance

    const serviceType = '_t8i-n-inst._tcp.dns-sd-lookup.toryt.org'
    let deaths = ['instance_8a', 'instance_8b', 'instance_8c', 'instance_8d']
    deaths = deaths.map(d => `${d}.${serviceType}`)

    const serviceInstance = await selectInstance(serviceType, selectInstance.notOneOf(deaths))
    console.log('%j', serviceInstance)
  })
})
