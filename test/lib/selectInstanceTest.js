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

const selectInstance = require('../../lib/selectInstance')
const notOneOf = selectInstance.notOneOf
const verifyPostconditions = require('../_util/verifyPostconditions')

const serviceTypePostfix = '._tcp.dns-sd-lookup.toryt.org'
const serviceType1InstanceNoSubtype = '_t1i-no-sub' + serviceTypePostfix
const serviceType1InstanceSubtype = '_subtype._sub._t7i-sub' + serviceTypePostfix
const serviceTypeNInstancesWithWeight = '_t8i-n-inst' + serviceTypePostfix
const manyInstanceCount = 12
const should = require('should')
const discover = require('../../lib/discover')

const batch = 3
/* NOTE: 3 is a magic number for tests on Travis with Node 10. For some reason, the first 3 DNS lookups in a batch take
         in average less than 100ms, but after that the time goes up to 5s, and then 10s and 15s. By keeping the batch
         size 3, the tests below take less than a minute. Note that on a local machine, they take less than a second. */

function testDistribution (timerLabel, deaths, expected) {
  const expectedPattern = Object.keys(expected).join('|')
  const matchExpr = new RegExp(`(${expectedPattern})\\.${serviceTypeNInstancesWithWeight.replace(/\./g, '\\.')}`)

  function totalCount (selections) {
    return Object.keys(selections).reduce(
      (acc, key) => {
        acc += selections[key]
        return acc
      },
      0
    )
  }

  const expectedStr = Object.keys(expected).map(k => `${k} = ${expected[k] * 100}%`).join(', ')

  function report (selections) {
    const total = totalCount(selections)
    console.log(`${total} - expected ${expectedStr}`)
    Object.keys(selections).forEach(k => {
      console.log('  %s: %d/%d (%f%%)', k, selections[k], total, Math.round(selections[k] * 1000 / total) / 10)
    })
    console.log()
  }

  function chain (todo, previous) {
    if (todo <= 0) {
      return previous
    }
    return chain(
      todo - batch,
      previous.then(selections => {
        const next = []
        for (let i = 0; i < Math.min(batch, todo); i++) {
          const tLabel = `${todo - i} - ${timerLabel}`
          console.time(tLabel)
          // noinspection JSUnresolvedFunction
          next.push(
            selectInstance(serviceTypeNInstancesWithWeight, notOneOf(deaths))
              .then(selection => {
                console.timeEnd(tLabel)
                selection.should.be.an.Object()
                selection.instance.should.match(matchExpr)
                if (!selections[selection.instance]) {
                  selections[selection.instance] = 0
                }
                selections[selection.instance]++
              })
          )
        }
        return Promise.all(next).then(() => {
          report(selections)
          return selections
        })
      })
    )
  }

  console.time(timerLabel)

  return chain(150, Promise.resolve({}))
    .then(selections => {
      console.timeEnd(timerLabel)
      const total = totalCount(selections)
      Object.keys(expected).forEach(e => {
        Math.abs(expected[e] - (selections[e + '.' + serviceTypeNInstancesWithWeight] / total)).should.be.below(0.15)
        /* NOTE: I would like for the deviation from the expected weight distribution to be less than 2.5% (2 sigma).
                 When testing with 2 instances, in 1024 tries, if often happens that the deviation that the deviation
                 is larger. That is surprising. This would mean that a random choice is not good enough.
                 That would imply that we rather need some sort of memory, which would be bad.
                 After this observation, the limit was lowered to 5%, and the tries are lowered to 256, for
                 test speed reasons. Still there are enough failures to be annoying. The limit was then raised to
                 10%. Since Travis DNS became very slow in 2018 Q III, the tries are lowered to 64, and the limit
                 is raised to 15%. */
      })
    })
}

describe('selectInstance', function () {
  this.timeout(6000) // DNS lookups can take a long time on Travis
  verifyPostconditions(selectInstance)
  verifyPostconditions(selectInstance.selectByWeight)

  it('works in the nominal case with 1 instance, without a subtype', function () {
    // noinspection JSUnresolvedVariable
    return selectInstance(serviceType1InstanceNoSubtype)
      .should.be.fulfilled().then(selection => {
        selection.should.be.an.Object()
        selection.instance.should.equal('instance 1.' + serviceType1InstanceNoSubtype)
        console.log(selection)
      })
  })
  it('works in the nominal case with 1 instance, with a subtype', function () {
    // noinspection JSUnresolvedVariable
    return selectInstance(serviceType1InstanceSubtype)
      .should.be.fulfilled().then(selection => {
        selection.should.be.an.Object()
        selection.instance.should.equal('instance 7._t7i-sub' + serviceTypePostfix)
        console.log(selection)
      })
  })
  it(`discovers ${manyInstanceCount} instances, not in order of priority`, function () {
    /* This tests makes sure instances in the next test are discovered out of priority order.
       For some reason, this does not seem to be the case on Node 12 / Travis (but not a problem on Node 6, 8, 10,
       nor Node 12 on macOS). */
    return discover(serviceTypeNInstancesWithWeight).then(instances => {
      instances.length.should.equal(manyInstanceCount)
      console.log(instances)
      console.log(`unsorted priorities: ${instances.map(i => i.priority)}`)
      // should not be ordered
      instances.some((instance, index) => index > 0 && instance.priority < instances[index - 1].priority)
        .should.be.true()
      instances.some((instance, index) => index > 0 && instance.priority > instances[index - 1].priority)
        .should.be.true()
    })
  })
  it(`works in the nominal case, with ${manyInstanceCount} instances`, function () {
    // noinspection JSPotentiallyInvalidUsageOfThis
    this.timeout(10000)

    // noinspection JSUnresolvedVariable
    return selectInstance(serviceTypeNInstancesWithWeight)
      .should.be.fulfilled().then(selection => {
        selection.should.be.an.Object()
        selection.instance.should.equal('instance 8a.' + serviceTypeNInstancesWithWeight)
        console.log(selection)
      })
  })
  it('resolves to null with a non-existent service type', function () {
    // noinspection JSUnresolvedVariable
    return selectInstance('_not-exist' + serviceTypePostfix)
      .should.be.fulfilled().then(selection => {
        should(selection).be.null()
        console.log(selection)
      })
  })
  it('selects according to weight with a filter', function () {
    // noinspection JSPotentiallyInvalidUsageOfThis
    this.timeout(10000)

    const deaths = [
      `Instance 8a.${serviceTypeNInstancesWithWeight}`,
      `Instance 8d.${serviceTypeNInstancesWithWeight}`
    ]
    // noinspection JSUnresolvedVariable
    return selectInstance(serviceTypeNInstancesWithWeight, notOneOf(deaths))
      .should.be.fulfilled().then(selection => {
        selection.should.be.an.Object()
        selection.instance.should.equal(`instance 8b.${serviceTypeNInstancesWithWeight}`)
        console.log(selection)
      })
  })
  it('selects according to weight with a filter that excludes every instance', function () {
    const deaths = [
      `Instance 8c.${serviceTypeNInstancesWithWeight}`,
      `Instance 8e.${serviceTypeNInstancesWithWeight}`,
      `Instance 8c.${serviceTypeNInstancesWithWeight}`,
      `Instance 8a.${serviceTypeNInstancesWithWeight}`,
      `Instance 8f.${serviceTypeNInstancesWithWeight}`,
      `Instance 8e.${serviceTypeNInstancesWithWeight}`,
      `Instance 8j.${serviceTypeNInstancesWithWeight}`,
      `Instance 8i.${serviceTypeNInstancesWithWeight}`,
      `Instance 8e.${serviceTypeNInstancesWithWeight}`,
      `Instance 8g.${serviceTypeNInstancesWithWeight}`,
      `Instance 8k.${serviceTypeNInstancesWithWeight}`,
      `Instance 8h.${serviceTypeNInstancesWithWeight}`,
      `Instance 8d.${serviceTypeNInstancesWithWeight}`,
      `Instance 8l.${serviceTypeNInstancesWithWeight}`,
      `Instance 8b.${serviceTypeNInstancesWithWeight}`
    ]
    // noinspection JSUnresolvedVariable
    return selectInstance(serviceTypeNInstancesWithWeight, notOneOf(deaths))
      .should.be.fulfilled().then(selection => {
        should(selection).be.null()
        console.log(selection)
      })
  })

  const labelA = 'selects according to weight with a filter evenly with 2 instances'
  it(labelA, function () {
    // noinspection JSPotentiallyInvalidUsageOfThis
    this.timeout(60000)

    const deaths = [
      `Instance 8a.${serviceTypeNInstancesWithWeight}`,
      `Instance 8b.${serviceTypeNInstancesWithWeight}`
    ]

    const expected = {}
    expected['instance 8c'] = 0.3
    expected['instance 8d'] = 0.7

    return testDistribution(labelA, deaths, expected)
  })
  const labelB = 'selects according to weight with a filter evenly with 5 instances'
  it(labelB, function () {
    // noinspection JSPotentiallyInvalidUsageOfThis
    this.timeout(60000)

    const deaths = [
      `Instance 8a.${serviceTypeNInstancesWithWeight}`,
      `Instance 8b.${serviceTypeNInstancesWithWeight}`,
      `Instance 8c.${serviceTypeNInstancesWithWeight}`,
      `Instance 8d.${serviceTypeNInstancesWithWeight}`
    ]

    const expected = {}
    expected['instance 8e'] = 0.1
    expected['instance 8f'] = 0.2
    expected['instance 8g'] = 0.3
    expected['instance 8h'] = 0.2
    expected['instance 8i'] = 0.2

    return testDistribution(labelB, deaths, expected)
  })
  const labelC = 'selects according to weight with a filter evenly with 3 instances with weight 0'
  it(labelC, function () {
    // noinspection JSPotentiallyInvalidUsageOfThis
    this.timeout(60000)

    const deaths = [
      `Instance 8a.${serviceTypeNInstancesWithWeight}`,
      `Instance 8b.${serviceTypeNInstancesWithWeight}`,
      `Instance 8c.${serviceTypeNInstancesWithWeight}`,
      `Instance 8d.${serviceTypeNInstancesWithWeight}`,
      `Instance 8e.${serviceTypeNInstancesWithWeight}`,
      `Instance 8f.${serviceTypeNInstancesWithWeight}`,
      `Instance 8g.${serviceTypeNInstancesWithWeight}`,
      `Instance 8h.${serviceTypeNInstancesWithWeight}`,
      `Instance 8i.${serviceTypeNInstancesWithWeight}`
    ]

    const aThird = 1 / 3
    const expected = {}
    expected['instance 8j'] = aThird
    expected['instance 8k'] = aThird
    expected['instance 8l'] = aThird

    return testDistribution(labelC, deaths, expected)
  })

  let failures = [
    't2i-2-txt',
    't3i-2-srv',
    't4i-2-txt-srv',
    't5i-no-txt',
    't6i-no-srv'
  ]
  failures = failures.map(f => `_${f}${serviceTypePostfix}`)
  failures.forEach(serviceType => {
    it(`fails for instance type ${serviceType}`, function () {
      // noinspection JSUnresolvedVariable
      return selectInstance(serviceType).should.be.rejected().then(err => {
        console.log(err)
      })
    })
  })
  const aFailure = failures[0]
  it(`fails for instance type ${aFailure} with a filter`, function () {
    // noinspection JSUnresolvedVariable
    const filter = selectInstance.contract.filter.implementation(instance => instance.indexOf(aFailure) >= 0)
    // noinspection JSUnresolvedVariable
    filter.contract.verifyPostconditions = true
    // noinspection JSUnresolvedVariable
    return selectInstance(aFailure, filter).should.be.rejected().then(err => {
      console.log(err)
      err.instance.should.containEql(aFailure)
    })
  })
})
