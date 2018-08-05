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

// Type definitions for discover
// Project: @toryt/dns-sd-lookup
// Definitions by: Jan Dockx

import * as ServiceInstance from './ServiceInstance'

export = discover

/**
 * Lookup all instances for the given [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt) _Service Type_ in DNS and resolve
 * to an Array of `ServiceInstance` objects that represent them. Optionally, you can provide a `filter` function that
 * filters out instances based on the _Service Instance_ name. With that, users can specify _Service Instance_ they do
 * not want, because they know they are not in good health, or because they know by name that they are not interesting.
 *
 * `discover.notOneOf` is a helper function that creates a `filter` function out of an Array of _Service Instance_
 * names.
 *
 * The function does a lookup for the DNS `PTR` resource records for the _Service Type_, and does `lookupInstance` for
 * all instances found, that pass the `filter`.
 *
 * The function returns a `Promise`. If there are not exactly 1 DNS `SRV` and exactly 1 DNS `TXT` resource record in DNS
 * for all found instances that pass the `filter`, the `Promise` is betrayed. If there is no `PTR` resource record for
 * the _Service Type_, or all instances are filtered out, the Promise returns the empty Array.
 */
declare function discover (serviceType: string, filter?: discover.filter): Promise<ServiceInstance[]>

declare namespace discover {

  export interface FilterContract extends Contract {
  }

  export interface discoverContract extends Contract {
    filter: FilterContract
    notOneOf: Contract
  }

  export const contract: discoverContract;

  /**
   * Filter callback, according to the specs of {@link Array.prototype.filter}, for array of `string`, representing
   * _Service Instance_ names.
   */
  export type filter = (serviceInstanceName: string, index: number, array: string[]) => boolean

  export namespace filter {
    export const contract: FilterContract
  }

  /**
   * Helper function that creates a {@link filter} function out of an Array of _Service Instance_ names.
   * The resulting function returns `true` if the passed in _Service Instance_ name does not occur in
   * `deathInstances`, and `false` if it does.
   */
  export function notOneOf (deathInstances: string[]): filter

  export namespace notOneOf {
    export const contract: Contract
  }
}
