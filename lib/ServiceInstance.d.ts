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

// Type definitions for ServiceInstance
// Project: @toryt/dns-sd-lookup
// Definitions by: Jan Dockx

export = ServiceInstance

/**
 * All lookup methods return `ServiceInstance` objects. These represent a
 * [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt) _Service Instance_ description.
 */
declare class ServiceInstance {
  constructor(kwargs: ServiceInstance.Kwargs)

  /**
   * Full [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt) _Service Type_ name, including the optional
   * [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt) _Service Subtype_.
   */
  readonly type: string;

  /**
   * [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt) _Service Instance_ name.
   */
  readonly instance: string;

  /**
   * FQDN of the host that offers the _Service Instance_ (from the DNS `SRV` resource record).
   */
  readonly host: string;

  /**
   * TCP port at which the `host` offers the _Service Instance_ (from the DNS `SRV` resource record).
   */
  readonly port: number;

  /**
   * Natural that says with which priority the user should use this instance to fulfill `type` (lower is higher
   * priority - from the DNS `SRV` resource record).
   */
  readonly priority: number;

  /**
   * Natural that says how often the user should use this instance to fulfill `type`, when choosing between instances
   * with the same `priority` (from the DNS `SRV` resource record).
   */
  readonly weight: number;

  /**
   * Object, that carries extra details about the _Service Instance_ this represents.
   *
   * The details are the key-value pairs expressed in the DNS `TXT` record. All property names are lower case.
   * [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt) boolean attributes (i.e., DNS `TXT` resource record strings that
   * do not contain a `=`-character) are represented by a property with the attribute name as property name, and the
   * value `true`. Otherwise, `details` property values of are always strings, and never `null` or `undefined`, but they
   * might be the empty string. In general, a property value of a `ServiceInstance.details` object can also be `false`,
   * but an instance returned by one of the lookup methods of this library will never return that.
   *
   * According to [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt), the `details` should at least have a property
   * `txtvers`, with a string value that represents a natural number.
   */
  readonly details: object;
}

declare namespace ServiceInstance {
  /**
   * `kwargs` for {@link ServiceInstance} constructor.
   */
  export interface Kwargs {
    /**
     * Full [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt) _Service Type_ name, including the optional
     * [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt) _Service Subtype_.
     */
    type: string;

    /**
     * [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt) _Service Instance_ name.
     */
    instance: string;

    /**
     * FQDN of the host that offers the _Service Instance_ (from the DNS `SRV` resource record).
     */
    host: string;

    /**
     * TCP port at which the `host` offers the _Service Instance_ (from the DNS `SRV` resource record).
     */
    port: number;

    /**
     * Natural that says with which priority the user should use this instance to fulfill `type` (lower is higher
     * priority - from the DNS `SRV` resource record).
     */
    priority: number;

    /**
     * Natural that says how often the user should use this instance to fulfill `type`, when choosing between instances
     * with the same `priority` (from the DNS `SRV` resource record).
     */
    weight: number;

    /**
     * Object, that carries extra details about the _Service Instance_ the new object will represent.
     *
     * The details are the key-value pairs expressed in the DNS `TXT` record. All property names are lower case.
     * [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt) boolean attributes (i.e., DNS `TXT` resource record strings that
     * do not contain a `=`-character) are represented by a property with the attribute name as property name, and the
     * value `true`. Otherwise, `details` property values of are always strings, and never `null` or `undefined`, but
     * they might be the empty string. In general, a property value of a `ServiceInstance.details` object can also be
     * `false`.
     *
     * According to [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt), the `details` should at least have a property
     * `txtvers`, with a string value that represents a natural number.
     */
    readonly details: object;
  }

  export const contract: Contract
}
