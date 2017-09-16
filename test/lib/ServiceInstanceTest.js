/* eslint-env mocha */

const ServiceInstance = require('../../lib/ServiceInstance')
const x = require('cartesian')

const protocols = ['udp', 'tcp']

function createKwargs (protocol) {
  return {
    domain: 'dns-sd-lookup.toryt.org',
    protocol: protocol,
    type: 'a-service-type'
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

    const cases = x({
      protocol: protocols
    })
    // noinspection JSUnresolvedFunction
    cases.forEach(c => {
      it(`works as expected for ${c.protocol}`, function () {
        const kwargs = createKwargs(c.protocol)
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
    const cases = x({
      protocol: protocols
    })
    // noinspection JSUnresolvedFunction
    cases.forEach(c => {
      it(`can be stringified for ${c.protocol}`, function () {
        const kwargs = createKwargs(c.protocol)
        const subject = new ServiceInstance(kwargs)
        const result = JSON.stringify(subject)
        result.must.be.a.string()
        result.must.match(/^{.*}$/)
        console.log(result)
        const reverse = JSON.parse(result)
        reverse.must.be.an.object()
        // noinspection JSUnresolvedVariable
        reverse.domain.must.equal(subject.domain)
        // noinspection JSUnresolvedVariable
        reverse.protocol.must.equal(subject.protocol)
        // noinspection JSUnresolvedVariable
        reverse.type.must.equal(subject.type)
        console.log(reverse)
        const fullCircle = new ServiceInstance(reverse)
        fullCircle.must.eql(subject)
      })
    })
  })
})
