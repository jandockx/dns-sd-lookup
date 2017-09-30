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
const serviceType5InstancesWithWeight = '_t8i-5inst' + serviceTypePostfix
const must = require('must')

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
  it('works in the nominal case, with 5 instances', function () {
    // noinspection JSUnresolvedVariable
    return selectInstance(serviceType5InstancesWithWeight)
      .must.fulfill(selectionInstanceContract.resolved.implementation(selection => {
        selection.must.be.an.object()
        selection.instance.must.equal('instance 8a.' + serviceType5InstancesWithWeight)
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
    const deaths = [
      `Instance 8a.${serviceType5InstancesWithWeight}`,
      `Instance 8d.${serviceType5InstancesWithWeight}`
    ]
    // noinspection JSUnresolvedVariable
    return selectInstance(serviceType5InstancesWithWeight, notOneOf(deaths))
      .must.fulfill(selectionInstanceContract.resolved.implementation(instance => {
        instance.must.be.an.object()
        instance.instance.must.match(`instance 8b.${serviceType5InstancesWithWeight}`)
        console.log(instance)
      }))
  })
  it.skip('selects according to weight with a filter evenly', function () {
    const batch = 16
    this.timeout(60000)
    const timerLabel = 'selects according to weight evenly'

    const deaths = [
      `Instance 8a.${serviceType5InstancesWithWeight}`,
      `Instance 8b.${serviceType5InstancesWithWeight}`
    ]

    const matchExpr = new RegExp(`(instance 8c|instance 8d)\\.${serviceType5InstancesWithWeight.replace(/\./g, '\\.')}`)

    const expected = {}
    expected[`instance 8c.${serviceType5InstancesWithWeight}`] = 0.3
    expected[`instance 8d.${serviceType5InstancesWithWeight}`] = 0.7

    function totalCount (selections) {
      return Object.keys(selections).reduce(
        (acc, key) => {
          acc += selections[key]
          return acc
        },
        0
      )
    }

    function report (selections) {
      const total = totalCount(selections)
      console.log(`${total} - expected c = 30%, d = 70%`)
      Object.keys(selections).forEach(k => {
        console.log('  %s: %d/%d (%f%%)', k, selections[k], total, Math.round(selections[k] * 1000 / total) / 10)
      })
      console.log()
    }
    console.time(timerLabel)

    function chain (todo, previous) {
      if (todo <= 0) {
        return previous
      }
      return chain(
        todo - batch,
        previous
          .then(selections => {
            const next = []
            for (let i = 0; i < batch; i++) {
              // noinspection JSUnresolvedFunction
              next.push(
                selectInstance(serviceType5InstancesWithWeight, notOneOf(deaths))
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

    return chain(1024, Promise.resolve({}))
      .then(selections => {
        console.timeEnd(timerLabel)
        const total = totalCount(selections)
        Object.keys(expected).forEach(e => {
          Math.abs(expected[e] - (selections[e] / total)).must.be.below(0.025)
        })
      })
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
