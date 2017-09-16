/* eslint-env mocha */

const ServiceInstance = require('../../lib/ServiceInstance')
const x = require('cartesian')
const must = require('must')

const protocols = ['udp', 'tcp']
const subtypes = [null, 'a-subtype', '_A Subtype']

function createKwargs (protocol, subtype) {
  // noinspection SpellCheckingInspection
  return {
    domain: 'dns-sd-lookup.toryt.org',
    protocol: protocol,
    type: 'a-service-type',
    subtype: subtype,
    instance: 'This Is a Servîce Instance ∆ Name'
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
      protocol: protocols,
      subtype: subtypes
    })
    // noinspection JSUnresolvedFunction
    cases.forEach(c => {
      it(`works as expected for protocol '${c.protocol}' and subtype '${c.subtype}'`, function () {
        const kwargs = createKwargs(c.protocol, c.subtype)
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
      protocol: protocols,
      subtype: subtypes
    })
    // noinspection JSUnresolvedFunction
    cases.forEach(c => {
      it(`can be stringified for protocol '${c.protocol}' and subtype '${c.subtype}'`, function () {
        const kwargs = createKwargs(c.protocol, c.subtype)
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
        // noinspection JSUnresolvedVariable
        must(reverse.subtype).equal(subject.subtype)
        // noinspection JSUnresolvedVariable
        reverse.instance.must.equal(subject.instance)
        console.log(reverse)
        const fullCircle = new ServiceInstance(reverse)
        fullCircle.must.eql(subject)
      })
    })
  })
})
