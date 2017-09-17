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

// noinspection SpellCheckingInspection
const serviceType = '_test._sub._unittest._tcp.dns-sd-lookup.toryt.org'

describe('selectInstance', function () {
  it('selects according to weight', function () {
    // noinspection JSUnresolvedVariable
    return selectInstance(serviceType, ['test_instance_unit_test0._tcp.dns-sd-lookup.toryt.org']).must.fulfill(details => {
      details.must.be.an.object()
      console.log(details)
    })
  })
  it('selects according to weight evenly', function () {
    const batch = 5
    this.timeout(30000)
    const timerLabel = 'selects according to weight evenly'

    function report (selections) {
      const total = Object.keys(selections).reduce(
        (acc, key) => {
          acc += selections[key]
          return acc
        },
        0
      )
      console.log(total)
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
              next.push(
                selectInstance(serviceType, ['test_instance_unit_test0._tcp.dns-sd-lookup.toryt.org'])
                  .then(selection => {
                    selections[selection.instance]
                      ? selections[selection.instance]++
                      : selections[selection.instance] = 1
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

    return chain(100, Promise.resolve({}))
      .then(selections => {
        console.timeEnd(timerLabel)
      })
  })
})
