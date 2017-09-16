/* eslint-env mocha */

const ServiceInstance = require('../../lib/ServiceInstance')

function createKwargs () {
  return {domain: 'dns-sd-lookup.toryt.org'}
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
    it('works as expected', function () {
      const kwargs = createKwargs()
      const subject = new ServiceInstance(kwargs)
      subject.must.be.instanceof(ServiceInstance)
      // noinspection JSUnresolvedFunction
      subject.must.be.valid()
      console.log(subject)
    })
  })
  describe('stringify', () => {
    it('can be stringified', function () {
      const kwargs = createKwargs()
      const subject = new ServiceInstance(kwargs)
      const result = JSON.stringify(subject)
      result.must.be.a.string()
      result.must.match(/^{.*}$/)
      console.log(result)
      const reverse = JSON.parse(result)
      reverse.must.be.an.object()
      // noinspection JSUnresolvedVariable
      reverse.domain.must.equal(subject.domain)
      console.log(reverse)
      const fullCircle = new ServiceInstance(reverse)
      fullCircle.must.eql(subject)
    })
  })
})
