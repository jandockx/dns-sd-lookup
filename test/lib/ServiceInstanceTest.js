/* eslint-env mocha */

const ServiceInstance = require('../../lib/ServiceInstance')
const x = require('cartesian')

const protocols = ['udp', 'tcp']

const domains = [
  'dns-sd-lookup1.toryt.org',
  'dns-sd-lookup2.toryt.org'
]
const types = [
  '_a-service-type',
  'sub type._sub._a-service-type'
]
const instanceName = 'This is An Instance Name'

const cases = x({
  typeDomain: domains,
  protocol: protocols,
  type: types,
  instanceDomain: domains
})

function createKwargs (c) {
  const type = `${c.type}._${c.protocol}.${c.typeDomain}`
  const instance = `${instanceName}.${c.type}._${c.protocol}.${c.instanceDomain}`
  // noinspection SpellCheckingInspection
  return {
    type: type,
    instance: instance,
    host: 'hostname.hostdomain.toryt.org'
  }
}

describe('ServiceInstance', () => {
  describe('constructor', () => {
    it('is a constructor', function () {
      ServiceInstance.must.have.property('prototype')
      ServiceInstance.prototype.must.have.property('constructor', ServiceInstance)
    })
    it('has an implementation that is a constructor', function () {
      ServiceInstance.must.have.property('implementation')
      // noinspection JSUnresolvedVariable
      ServiceInstance.implementation.must.be.a.function()
      // noinspection JSUnresolvedVariable
      ServiceInstance.implementation.must.have.property('prototype')
      // noinspection JSUnresolvedVariable
      ServiceInstance.implementation.prototype.must.have.property(
        'constructor',
        ServiceInstance.implementation
      )
    })

    // noinspection JSUnresolvedFunction
    cases.forEach(c => {
      const kwargs = createKwargs(c)
      it(`works as expected for type '${kwargs.type}' and instance '${kwargs.instance}'`, function () {
        const subject = new ServiceInstance(kwargs)
        subject.must.be.instanceof(ServiceInstance)
        subject.must.be.frozen()
        // noinspection JSUnresolvedFunction
        subject.must.be.valid()
        console.log(subject)
      })
    })
  })

  describe('stringify', () => {
    // noinspection JSUnresolvedFunction
    cases.forEach(c => {
      const kwargs = createKwargs(c)
      it(`can be stringified for type '${kwargs.type}' and instance '${kwargs.instance}'`, function () {
        const kwargs = createKwargs(c)
        const subject = new ServiceInstance(kwargs)
        const result = JSON.stringify(subject)
        result.must.be.a.string()
        result.must.match(/^{.*}$/)
        console.log(result)
        const reverse = JSON.parse(result)
        reverse.must.be.an.object()
        // noinspection JSUnresolvedVariable
        reverse.type.must.equal(subject.type)
        // noinspection JSUnresolvedVariable
        reverse.instance.must.equal(subject.instance)
        console.log(reverse)
        const fullCircle = new ServiceInstance(reverse)
        fullCircle.must.eql(subject)
      })
    })
  })
})
