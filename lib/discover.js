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

const denodeify = require('denodeify')
const resolvePtr = denodeify(require('dns').resolvePtr)
const lookupInstance = require('./lookupInstance')
const ServiceInstance = require('./ServiceInstance')

function discover (/* !string */ serviceType, /* string[]= */ deathInstances) {
  // noinspection JSUnresolvedFunction
  return resolvePtr(serviceType).then(response => {
    // noinspection JSUnresolvedFunction
    return Promise.all(
      response
        .filter(instanceName => !deathInstances || deathInstances.indexOf(instanceName) < 0)
        .map(instanceName =>
          lookupInstance(instanceName)
            .catch(err => err)
            .then(instance => {
              const kwargs = Object.create(instance)
              kwargs.type = serviceType
              return new ServiceInstance(kwargs)
            })
        )
    )
  })
}

module.exports = discover
