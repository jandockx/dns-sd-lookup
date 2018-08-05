/*
 * MIT License
 *
 * Copyright (c) 2018 - 2018 Jan Dockx
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

// Type definitions for extract
// Project: @toryt/dns-sd-lookup
// Definitions by: Jan Dockx

/**
 * Protocols available in DNS-SD as string: 'upd' or 'tcp'.
 */
export type Protocol = 'udp' | 'tcp'

/**
 * Extract the domain from a [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt) _Service Type_ or _Service Instance_
 * `fqdn`.
 */
export function domain(fqdn: string): string

/**
 * Extract the protocol ('upd' or 'tcp') from a [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt) _Service Type_ or
 * _Service Instance_ `fqdn`.
 */
export function protocol(fqdn: string): Protocol

/**
 * Extract the (base) type from a [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt) _Service Type_ or _Service Instance_
 * `fqdn`.
 */
export function type(fqdn: string): string

/**
 * Extract the instance from a [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt) _Service Instance_ `fqdn`.
 */
export function instance(fqdn: string): string

/**
 * Extract the subtype from a [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt) _Service Type_ `fqdn`. If there is no
 * subtype, the result is `undefined`.
 *
 * This is essentially the same as extracting an instance name, except that
 *
 * - there might not be a subtype; we return `undefined`
 * - we skip the '._sub' domain name part
 *
 * According to DNS-SD, a subtype does not have to start with a '_'. Therefor, if there is a starting '_', it is part of
 * the name, and not removed.
 */
export function subtype(fqdn: string): string
