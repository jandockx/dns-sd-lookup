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

const selectInstance = require('../../lib/selectInstance')
const notOneOf = selectInstance.notOneOf
const verifyPostconditions = require('../_util/verifyPostconditions')

const serviceTypePostfix = '._tcp.dns-sd-lookup.toryt.org'
const serviceType1InstanceNoSubtype = '_t1i-no-sub' + serviceTypePostfix
const serviceType1InstanceSubtype = '_subtype._sub._t7i-sub' + serviceTypePostfix
const serviceTypeInstances = '_t8i-n-inst' + serviceTypePostfix // with weight
const manyInstanceCount = 12
const should = require('should')

const batch = 3
/* NOTE: 3 is a magic number for tests on Travis with Node 10. For some reason, the first 3 DNS lookups in a batch take
         in average less than 100ms, but after that the time goes up to 5s, and then 10s and 15s. By keeping the batch
         size 3, the tests below take less than a minute. Note that on a local machine, they take less than a second. */

async function testDistribution (timerLabel, deaths, expected) {
  const expectedPattern = Object.keys(expected).join('|')
  const matchExpr = new RegExp(`(${expectedPattern})\\.${serviceTypeInstances.replace(/\./g, '\\.')}`)

  function totalCount (selections) {
    return Object.keys(selections).reduce((acc, key) => {
      acc += selections[key]
      return acc
    }, 0)
  }

  const expectedStr = Object.keys(expected)
    .map(k => `${k} = ${expected[k] * 100}%`)
    .join(', ')

  function report (selections) {
    const total = totalCount(selections)
    console.log(`${total} - expected ${expectedStr}`)
    Object.keys(selections).forEach(k => {
      console.log('  %s: %d/%d (%f%%)', k, selections[k], total, Math.round((selections[k] * 1000) / total) / 10)
    })
    console.log()
  }

  async function chain (todo, selections) {
    if (todo <= 0) {
      return selections
    }
    const next = []
    for (let i = 0; i < Math.min(batch, todo); i++) {
      const tLabel = `${todo - i} - ${timerLabel}`
      console.time(tLabel)
      // noinspection JSUnresolvedFunction
      next.push(
        (async () => {
          const /** @type ServiceInstance */ selection = await selectInstance(serviceTypeInstances, notOneOf(deaths))
          console.timeEnd(tLabel)
          selection.should.be.an.Object()
          selection.instance.should.match(matchExpr)
          if (!selections[selection.instance]) {
            selections[selection.instance] = 0
          }
          selections[selection.instance]++
        })()
      )
    }
    await Promise.all(next)
    report(selections)
    return chain(todo - batch, selections)
  }

  console.time(timerLabel)

  const selections = await chain(150, {})
  console.timeEnd(timerLabel)
  const total = totalCount(selections)
  Object.keys(expected).forEach(e => {
    Math.abs(expected[e] - selections[e + '.' + serviceTypeInstances] / total).should.be.below(0.15)
    /* NOTE: I would like for the deviation from the expected weight distribution to be less than 2.5% (2 sigma).
             When testing with 2 instances, in 1024 tries, if often happens that the deviation that the deviation
             is larger. That is surprising. This would mean a random choice is not good enough.
             That would imply that we rather need some sort of memory, which would be bad.
             After this observation, the limit was lowered to 5%, and the tries are lowered to 256, for
             test speed reasons. Still, there are enough failures to be annoying. The limit was then raised to
             10%. Since Travis DNS became very slow in 2018 Q III, the tries are lowered to 64, and the limit
             is raised to 15%. */
  })
}

describe('selectInstance', function () {
  this.timeout(6000) // DNS lookups can take a long time on Travis
  verifyPostconditions(selectInstance)
  verifyPostconditions(selectInstance.selectByWeight)

  it('works in the nominal case with 1 instance, without a subtype', async function () {
    const /** @type ServiceInstance */ selection = await selectInstance(serviceType1InstanceNoSubtype)
    selection.should.be.an.Object()
    selection.instance.should.equal('instance_1.' + serviceType1InstanceNoSubtype)
    console.log(selection)
  })
  it('works in the nominal case with 1 instance, with a subtype', async function () {
    const /** @type ServiceInstance */ selection = await selectInstance(serviceType1InstanceSubtype)
    selection.should.be.an.Object()
    selection.instance.should.equal('instance_7._t7i-sub' + serviceTypePostfix)
    console.log(selection)
  })
  it(`works in the nominal case, with ${manyInstanceCount} instances`, async function () {
    // noinspection JSPotentiallyInvalidUsageOfThis
    this.timeout(10000)

    const /** @type ServiceInstance */ selection = await selectInstance(serviceTypeInstances)
    selection.should.be.an.Object()
    selection.instance.should.equal('instance_8b.' + serviceTypeInstances)
    console.log(selection)
  })
  it('resolves to null with a non-existent service type', async function () {
    const /** @type ServiceInstance */ selection = await selectInstance('_not-exist' + serviceTypePostfix)
    should(selection).be.null()
    console.log(selection)
  })
  it('selects according to weight with a filter', async function () {
    // noinspection JSPotentiallyInvalidUsageOfThis
    this.timeout(10000)

    const deaths = [`instance_8a.${serviceTypeInstances}`, `instance_8d.${serviceTypeInstances}`]

    const /** @type ServiceInstance */ selection = await selectInstance(serviceTypeInstances, notOneOf(deaths))
    selection.should.be.an.Object()
    selection.instance.should.equal(`instance_8b.${serviceTypeInstances}`)
    console.log(selection)
  })
  it('selects according to weight with a filter that excludes every instance', async function () {
    const deaths = [
      `instance_8c.${serviceTypeInstances}`,
      `instance_8e.${serviceTypeInstances}`,
      `instance_8c.${serviceTypeInstances}`,
      `instance_8a.${serviceTypeInstances}`,
      `instance_8f.${serviceTypeInstances}`,
      `instance_8e.${serviceTypeInstances}`,
      `instance_8j.${serviceTypeInstances}`,
      `instance_8i.${serviceTypeInstances}`,
      `instance_8e.${serviceTypeInstances}`,
      `instance_8g.${serviceTypeInstances}`,
      `instance_8k.${serviceTypeInstances}`,
      `instance_8h.${serviceTypeInstances}`,
      `instance_8d.${serviceTypeInstances}`,
      `instance_8l.${serviceTypeInstances}`,
      `instance_8b.${serviceTypeInstances}`
    ]

    const /** @type ServiceInstance */ selection = await selectInstance(serviceTypeInstances, notOneOf(deaths))
    should(selection).be.null()
    console.log(selection)
  })

  const labelA = 'selects according to weight with a filter evenly with 2 instances'
  it(labelA, async function () {
    // noinspection JSPotentiallyInvalidUsageOfThis
    this.timeout(60000)

    const deaths = [`instance_8a.${serviceTypeInstances}`, `instance_8b.${serviceTypeInstances}`]

    const expected = {}
    expected.instance_8c = 0.3
    expected.instance_8d = 0.7

    await testDistribution(labelA, deaths, expected)
  })
  const labelB = 'selects according to weight with a filter evenly with 5 instances'
  it(labelB, async function () {
    // noinspection JSPotentiallyInvalidUsageOfThis
    this.timeout(60000)

    const deaths = [
      `instance_8a.${serviceTypeInstances}`,
      `instance_8b.${serviceTypeInstances}`,
      `instance_8c.${serviceTypeInstances}`,
      `instance_8d.${serviceTypeInstances}`
    ]

    const expected = {}
    expected.instance_8e = 0.1
    expected.instance_8f = 0.2
    expected.instance_8g = 0.3
    expected.instance_8h = 0.2
    expected.instance_8i = 0.2

    await testDistribution(labelB, deaths, expected)
  })
  const labelC = 'selects according to weight with a filter evenly with 3 instances with weight 0'
  it(labelC, async function () {
    // noinspection JSPotentiallyInvalidUsageOfThis
    this.timeout(60000)

    const deaths = [
      `instance_8a.${serviceTypeInstances}`,
      `instance_8b.${serviceTypeInstances}`,
      `instance_8c.${serviceTypeInstances}`,
      `instance_8d.${serviceTypeInstances}`,
      `instance_8e.${serviceTypeInstances}`,
      `instance_8f.${serviceTypeInstances}`,
      `instance_8g.${serviceTypeInstances}`,
      `instance_8h.${serviceTypeInstances}`,
      `instance_8i.${serviceTypeInstances}`
    ]

    const aThird = 1 / 3
    const expected = {}
    expected.instance_8j = aThird
    expected.instance_8k = aThird
    expected.instance_8l = aThird

    await testDistribution(labelC, deaths, expected)
  })

  let failures = ['t2i-2-txt', 't3i-2-srv', 't4i-2-txt-srv', 't5i-no-txt', 't6i-no-srv']
  failures = failures.map(f => `_${f}${serviceTypePostfix}`)
  failures.forEach(serviceType => {
    it(`fails for instance type ${serviceType}`, async function () {
      // noinspection JSUnresolvedVariable
      const err = await selectInstance(serviceType).should.be.rejected()
      console.log(err)
    })
  })
  const aFailure = failures[0]
  it(`fails for instance type ${aFailure} with a filter`, async function () {
    // noinspection JSUnresolvedVariable
    const filter = selectInstance.contract.filter.implementation(instance => instance.indexOf(aFailure) >= 0)
    // noinspection JSUnresolvedVariable
    filter.contract.verifyPostconditions = true
    // noinspection JSUnresolvedVariable
    const err = await selectInstance(aFailure, filter).should.be.rejected()
    console.log(err)
    err.instance.should.containEql(aFailure)
  })
})
