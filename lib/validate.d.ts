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

// Type definitions for extract
// Project: @toryt/dns-sd-lookup
// Definitions by: Jan Dockx

export const maxLength: number;
export const maxLabelLength: number;
export const subtypeOrInstance: RegExp;
export const serviceType: RegExp;
export const serviceInstance: RegExp;

/**
 * The given string is a valid DNS-SD subtype or short instance name.
 *
 * This means it is a _DNS label_, with dots and backslashes escaped. A DNS label consists of at least 1, and not more
 * then 63 characters ('octets'). Any character (octet) is allowed in a DNS label. (This in contrast to a _host name_,
 * the parts of an _internet host name_, _DNS domain_ or _DNS subdomain_, for which the allowed characters are limited.
 * E.g., they cannot contain '_' or spaces, control characters, etc.).
 *
 * This function does not allow gratuitous escapes, i.e., a backslash must be followed by a dot or another
 * backslash.
 */
export function isSubtypeOrInstanceName(label: any): boolean

/**
 * The given string represents a [RFC 6763] base _Service Type_, i.e., a _Service Type_ without a subtype.
 */
export function isBaseServiceType(fullName: any): boolean
export function isServiceType(fullName: any): boolean
export function isServiceInstance(fullName: any): boolean
export function isNatural(nr: any, max?: any): boolean

// [RFC 6763]: https://www.ietf.org/rfc/rfc6763.txt
