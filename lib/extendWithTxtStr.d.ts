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

// Type definitions for extendWithTxtStr
// Project: @toryt/dns-sd-lookup
// Definitions by: Jan Dockx

/**
 * Interpret a given DNS TXT record string `txtStr`, following
 * [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt), and add the attribute it represents to the given `obj` as property.
 *
 * [RFC 6763](https://www.ietf.org/rfc/rfc6763.txt), section 6.4 and 6.5</a> state:
 *
 * - The key MUST be at least one character.  DNS-SD TXT record strings beginning with an '=' character (i.e., the key
 *   is missing) MUST be silently ignored.
 * - The characters of a key MUST be printable US-ASCII values (0x20-0x7E, i.e., space to '~') [RFC20], excluding '='
 *   (0x3D).
 * - Spaces in the key are significant, whether leading, trailing, or in the middle.
 * - Case is ignored when interpreting a key.
 * - If there is no '=' in a DNS-SD TXT record string, then it is a boolean attribute, simply identified as being
 *   present, with no value.
 * - If a client receives a TXT record containing the same key more than once, then the client MUST silently ignore all
 *   but the first occurrence of that attribute.
 *
 * Note in particular that this standard DOES NOT refer to quoting the first '=' with a back quote '`=', as is done in
 * [RFC 1464](https://tools.ietf.org/html/rfc1464), section 2. Also, in that standard, TXT record strings without any
 * '=' are ignored, and attribute names are trimmed. This implementation thus DOES NOT follow
 * [RFC 1464](https://tools.ietf.org/html/rfc1464).
 *
 * There are therefore 4 categories of results that may be returned:
 * - Attribute not present (Absent)
 * - Attribute present, with no value (e.g., "passreq" -- password required for this service)
 * - Attribute present, with empty value (e.g., "PlugIns=" -- the server supports plugins, but none are presently
 *   installed)
 * - Attribute present, with non-empty value (e.g., "PlugIns=JPEG,MPEG2,MPEG4")
 *
 * If there is a '=' in a DNS-SD TXT record string, then everything after the first '=' to the end of the string is the
 * value. The value can contain any eight-bit values including '='. Any quotation marks, or leading or trailing spaces,
 * are part of the value. It is legal for a value to be any binary data.
 *
 * Each author defining a DNS-SD profile for discovering instances of a particular type of service should define the
 * interpretation of these different kinds of result. In particular, an empty value might imply 'false', 'unknown', etc.
 *
 * Note that we have the issue that we can never return boolean false. An attribute with no value (i.e., no '=' in the
 * string) should be mapped to a property that is 'true'. There is no mapping in the standard for a property that is
 * 'false'. The standard hints at the non-existence of the property, which does map nicely to Javascript's 'falsy'
 * concept, as the value of a non-existent property is 'undefined', which is 'falsy'.
 *
 * Optional guidelines for the creators of the TXT records are:
 *
 * - The key _SHOULD_ be no more than 9 characters long.
 * - A given key _SHOULD NOT_ appear more than once in a TXT record.
 *
 * In this implementation, we choose to return `ServiceInstance` objects with attribute names always in lower case.
 * A TXT record string that contains no '=' will become a property with the entire string as name, and `true` as value.
 * Any TXT record string that does not match the standard's criteria, is silently ignored, i.e., if the attribute name
 * would contain characters not in `[ -<>-~]`, or start with a '=', or repeat an attribute name encountered already.
 *
 * Note that a value added to `obj` will thus be `true` or a a string, which might be empty, and never be `null` or
 * `undefined`.
 */
export function extendWithTxtStr(obj: object, txtStr: string): object
