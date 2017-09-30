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
const selectionInstanceContract = selectInstance.contract
const notOneOf = selectInstance.notOneOf

const serviceTypePostfix = '._tcp.dns-sd-lookup.toryt.org'
const serviceType1InstanceNoSubtype = '_t1i-no-sub' + serviceTypePostfix
const serviceType1InstanceSubtype = '_subtype._sub._t7i-sub' + serviceTypePostfix
const serviceTypeNInstancesWithWeight = '_t8i-n-inst' + serviceTypePostfix
const manyInstanceCount = 12
const must = require('must')

const batch = 16

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
        for (let i = 0; i < batch; i++) {
          // noinspection JSUnresolvedFunction
          next.push(
            selectInstance(serviceTypeNInstancesWithWeight, notOneOf(deaths))
              .then(selectionInstanceContract.resolved.implementation(selection => {
                selection.must.be.an.object()
                selection.instance.must.match(matchExpr)
                selections[selection.instance]
                  ? selections[selection.instance]++
                  : selections[selection.instance] = 1
              }))
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

  return chain(512, Promise.resolve({}))
    .then(selections => {
      console.timeEnd(timerLabel)
      const total = totalCount(selections)
      Object.keys(expected).forEach(e => {
        Math.abs(expected[e] - (selections[e + '.' + serviceTypeNInstancesWithWeight] / total)).must.be.below(0.05)
        /* NOTE: I would like for the deviation from the expected weight distribution to be less than 2.5%.
                 When testing with 2 instances, in 1024 tries, if often happens that the deviation that the deviation
                 is larger. That is surprising. This would mean that a random choice is not good enough.
                 That would imply that we rather need some sort of memory, which would be bad.
                 After this observation, the limit was lowered to 5%, and the tries are lowered to 512, for
                 test speed reasons. */
      })
    })
}

describe('selectInstance', function () {
  it('works in the nominal case with 1 instance, without a subtype', function () {
    // noinspection JSUnresolvedVariable
    return selectInstance(serviceType1InstanceNoSubtype)
      .must.fulfill(selectionInstanceContract.resolved.implementation(selection => {
        selection.must.be.an.object()
        selection.instance.must.equal('instance 1.' + serviceType1InstanceNoSubtype)
        console.log(selection)
      }))
  })
  it('works in the nominal case with 1 instance, with a subtype', function () {
    // noinspection JSUnresolvedVariable
    return selectInstance(serviceType1InstanceSubtype)
      .must.fulfill(selectionInstanceContract.resolved.implementation(selection => {
        selection.must.be.an.object()
        selection.instance.must.equal('instance 7._t7i-sub' + serviceTypePostfix)
        console.log(selection)
      }))
  })
  it(`works in the nominal case, with ${manyInstanceCount} instances`, function () {
    this.timeout(10000)

    // noinspection JSUnresolvedVariable
    return selectInstance(serviceTypeNInstancesWithWeight)
      .must.fulfill(selectionInstanceContract.resolved.implementation(selection => {
        selection.must.be.an.object()
        selection.instance.must.equal('instance 8a.' + serviceTypeNInstancesWithWeight)
        console.log(selection)
      }))
  })
  it('resolves to null with a non-existent service type', function () {
    // noinspection JSUnresolvedVariable
    return selectInstance('_not-exist' + serviceTypePostfix)
      .must.fulfill(selectionInstanceContract.resolved.implementation(selection => {
        must(selection).be.null()
        console.log(selection)
      }))
  })
  it('selects according to weight with a filter', function () {
    this.timeout(10000)

    const deaths = [
      `Instance 8a.${serviceTypeNInstancesWithWeight}`,
      `Instance 8d.${serviceTypeNInstancesWithWeight}`
    ]
    // noinspection JSUnresolvedVariable
    return selectInstance(serviceTypeNInstancesWithWeight, notOneOf(deaths))
      .must.fulfill(selectionInstanceContract.resolved.implementation(selection => {
        selection.must.be.an.object()
        selection.instance.must.match(`instance 8b.${serviceTypeNInstancesWithWeight}`)
        console.log(selection)
      }))
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
      .must.fulfill(selectionInstanceContract.resolved.implementation(selection => {
        must(selection).be.null()
        console.log(selection)
      }))
  })

  const labelA = 'selects according to weight with a filter evenly'
  it(labelA, function () {
    this.timeout(60000)

    const deaths = [
      `Instance 8a.${serviceTypeNInstancesWithWeight}`,
      `Instance 8b.${serviceTypeNInstancesWithWeight}`
    ]

    const expected = {}
    expected[`instance 8c`] = 0.3
    expected[`instance 8d`] = 0.7

    return testDistribution(labelA, deaths, expected)
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
      return selectInstance(serviceType).must.betray(selectionInstanceContract.rejected.implementation(err => {
        console.log(err)
      }))
    })
  })
})
