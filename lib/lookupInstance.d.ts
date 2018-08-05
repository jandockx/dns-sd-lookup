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

// Type definitions for lookupInstance
// Project: @toryt/dns-sd-lookup
// Definitions by: Jan Dockx

import * as extendWithTxtStr from './extendWithTxtStr'
import * as ServiceInstance from './ServiceInstance'

export = lookupInstance

/**
 * Lookup the definition a [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt) _Service Instance_ in DNS and resolve to a
 * `ServiceInstance` that represents it.
 *
 * The function returns a `Promise`. If not exactly 1 DNS `SRV` and exactly 1 DNS `TXT` resource record is found in DNS
 * for the given _Service Instance_, the `Promise` is betrayed. The `details` property holds an object that contains all
 * valid attributes found in the DNS `TXT` resource record, according to {@link extendWithTxtStr}.
 *
 * `Promise` for a {@link ServiceInstance}, build from the contents of the `SRV` and `TXT` DNS-SD records for
 * `serviceInstance`.
 *
 * The Promise is betrayed ({@link lookupInstance.NotValidException}) when either the `SRV` resource record or the `TXT`
 * resource record does not exist , or when there is more then 1 ({@link lookupInstance.MoreThen1Exception}) `SRV`
 * resource record ({@link lookupInstance.moreThen1Message.SRV}), or `TXT` resource record
 * ({@link lookupInstance.moreThen1Message.TXT}), respectively.
 *
 * There are no additional preconditions on the contents of the `TXT` resource record.
 */
declare function lookupInstance (serviceInstance: string): Promise<ServiceInstance>

declare namespace lookupInstance {

  /**
   * Messages in {@link Error} when {@link lookupInstance} finds more then 1 `SRV` or `TXT` resource record,
   * respectively, for the given _Service Instance_.
   */
  export interface MoreThen1 {
    /**
     * Message in {@link Error} when {@link lookupInstance} finds more then 1 `SRV` resource record for the given
     * _Service Instance_.
     */
    readonly SRV: string

    /**
     * Message in {@link Error} when {@link lookupInstance} finds more then 1 `TXT` resource record for the given
     * _Service Instance_.
     */
    readonly TXT: string
  }

  /**
   * Exception when {@link lookupInstance} encounters an invalid definition in DNS for the given _Service Instance_.
   */
  export interface LookupInstanceException extends Error {
    /**
     * The _Service Instance_ that has the invalid definition in DNS.
     */
    instance: string
  }

  /**
   * Exception when {@link lookupInstance} finds more then 1 `SRV` or `TXT` resource record for the given
   * _Service Instance_. The `message` is one of {@link lookupInstance.LookupInstanceContract.moreThen1Message}.
   * The message makes clear for which resource record type more then 1 instance was encountered.
   *
   * It is possible that more then 1 resource record instance exists for the other type too.
   */
  export interface MoreThen1Exception extends LookupInstanceException {
    /**
     * The number of `SRV` or `TXT` resource record instances that were found for _Service Definition_.
     */
    count: number
  }

  /**
   * Exception when {@link lookupInstance} finds a definition for the given _Service Instance_ that is invalid, other
   * than {@link MoreThen1Exception}. The `message` is {@link lookupInstance.LookupInstanceContract.notValidMessage}.
   */
  export interface NotValidException extends LookupInstanceContract {
    /**
     * The underlying cause for which the found _Service Instance_ is invalid.
     */
    readonly cause: any
  }

  export interface LookupInstanceContract extends Contract {
    /**
     * Messages in {@link MoreThen1Exception} when {@link lookupInstance} finds more then 1 `SRV` or `TXT` resource
     * record for the given _Service Instance_.
     */
    moreThen1Message: MoreThen1

    /**
     * Message in {@link NotValidException} when {@link lookupInstance} finds a definition for the given _Service
     * Instance_ that is invalid, other than {@link MoreThen1}.
     */
    notValidMessage: string
  }

  export const contract: LookupInstanceContract
}
