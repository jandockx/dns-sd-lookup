/*
 * MIT License
 *
 * Copyright (c) 2017-2018 Jan Dockx
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

// Type definitions for selectInstance
// Project: @toryt/dns-sd-lookup
// Definitions by: Jan Dockx

import * as discover from './discover'
import * as ServiceInstance from './ServiceInstance'

export = selectInstance

/**
 * Lookup all instances for the given [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt) _Service Type_ in DNS and resolve
 * to the `ServiceInstance` the user should use. Optionally, you can provide a `filter` function that filters out
 * instances based on the _Service Instance_ name. With that, users can specify _Service Instance_ they do not want,
 * because they know they are not in good health, or because they know by name that they are not interesting.
 *
 * `selectInstance.notOneOf` is a helper function that creates a `filter` function out of an Array of
 * _Service Instance_ names.
 *
 * The function uses `discover`, and the selects the appropriate instance from the resulting Array that have passed the
 * `filter`, according to the rules of [RFC 2782](https://www.ietf.org/rfc/rfc2782.txt). The instance in the list with
 * the lowest `priority` value is chosen. If there is more then 1 instance with the same lowest `priority` value, one is
 * choose random from that set, according to the chance distribution given by the `weight` property values of the
 * instance in the set.
 *
 * The function returns a `Promise`. If there are not exactly 1 DNS `SRV` and exactly 1 DNS `TXT` resource record in DNS
 * for all found instances that pass the `filter`, the `Promise` is betrayed. If there is no `PTR` resource record for
 * the _Service Type_, or all instances are filtered out, the Promise returns `null`.
 */
declare function selectInstance (serviceType: string, filter?: (serviceInstanceName: string) => boolean):
  Promise<ServiceInstance>

declare namespace selectInstance {

  export interface filterContract {

  }

  export interface selectInstanceContract extends Contract {
    filter: discover.filterContract
  }

  export const contract: selectInstanceContract;

  export { notOneOf } from './discover'

  /**
   * [RFC 2782](https://www.ietf.org/rfc/rfc2782.txt) states:
   *
   * > The following algorithm SHOULD be used to order the SRV RRs of the same
   * > priority:
   * >
   * > To select a target to be contacted next, arrange all SRV RRs
   * > (that have not been ordered yet) in any order, except that all
   * > those with weight 0 are placed at the beginning of the list.<br/>
   * > Compute the sum of the weights of those RRs, and with each RR
   * > associate the running sum in the selected order. Then choose a
   * > uniform random number between 0 and the sum computed
   * > (inclusive), and select the RR whose running sum value is the
   * > first in the selected order which is greater than or equal to
   * > the random number selected. The target host specified in the
   * > selected SRV RR is the next one to be contacted by the client.
   * > Remove this SRV RR from the set of the unordered SRV RRs and
   * > apply the described algorithm to the unordered SRV RRs to select
   * > the next target host.  Continue the ordering process until there
   * > are no unordered SRV RRs.  This process is repeated for each
   * > Priority.
   *
   * This algorithm is close to that, without keeping state between calls.
   *
   * The above does not cover the case where all weights are 0 sufficiently,
   * because it says the instances should be arranged in 'any order', which is not
   * necessarily random. The below algorithm chooses a totally random choice when
   * all instances have weight 0.
   */
  export function selectByWeight (instances: ServiceInstance[]): ServiceInstance
}
