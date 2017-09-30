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

const Contract = require('@toryt/contracts-iii')
const denodeify = require('denodeify')
const resolveSrv = denodeify(require('dns').resolveSrv)
const resolveTxt = denodeify(require('dns').resolveTxt)
const ServiceInstance = require('./ServiceInstance')
const extract = require('./extract')
const validate = require('./validate')

const lookupInstanceContract = new Contract({
  pre: [validate.isServiceInstance],
  post: [
    function (serviceInstance, result) { return result instanceof Promise }
  ],
  exception: validate.mustNotHappen
})
lookupInstanceContract.resolved = new Contract({
  pre: [
    function (resolution) { return resolution instanceof ServiceInstance }
    // NOTE: cannot express relation between parameter serviceInstance and resolution
  ]
})
lookupInstanceContract.rejected = new Contract({
  pre: [
    function (rejection) { return rejection instanceof Error },
    function (rejection) { return rejection.message === lookupInstanceContract.notValidMessage },
    function (rejection) { return rejection.cause instanceof Error }
    // NOTE: cannot express relation between parameter serviceInstance and rejection.instance
  ]
})

lookupInstanceContract.moreThen1Message = {
  SRV: 'more than 1 SRV record',
  TXT: 'more than 1 TXT record'
}
lookupInstanceContract.notValidMessage = 'service instance definition not valid'

function exactly1 (/* !string */ serviceInstance, /* !string */ recordType, /* !Function */ resolver) {
  return resolver(serviceInstance).then(records => {
    if (records.length > 1) {
      const err = new Error(lookupInstanceContract.moreThen1Message[recordType])
      err.instance = serviceInstance
      err.count = records.length
      throw err
    }
    return records[0]
  })
}

const txtStrPattern = /^([ -<>-~]+)(?:=(.*))?$/

/**
 * <a href="https://www.ietf.org/rfc/rfc6763.txt">RFC 6763, section 6.4 and 6.5</a> state:
 * <ul>
 *  <li>The key MUST be at least one character.  DNS-SD TXT record strings
 *    beginning with an '=' character (i.e., the key is missing) MUST be
 *    silently ignored.</li>
 *  <li>The characters of a key MUST be printable US-ASCII values (0x20-0x7E, i.e., space to '~') [RFC20],
 *    excluding '=' (0x3D).</li>
 *  <li>Spaces in the key are significant, whether leading, trailing, or in the middle.</li>
 *  <li>Case is ignored when interpreting a key.</li>
 *  <li>If there is no '=' in a DNS-SD TXT record string, then it is a boolean attribute,
 *    simply identified as being present, with no value.</li>
 * <li>If a client receives a TXT
 *    record containing the same key more than once, then the client MUST silently ignore all
 *    but the first occurrence of that attribute.</li>
 * </ul>
 *
 * <p>Note in particular that this standard DOES NOT refer to quoting the first '=' with a back quote '`=',
 *   as is done in <a href="https://tools.ietf.org/html/rfc1464">RFC 1464, section 2</a>. Also, in that standard,
 *   TXT record strings without any '=' are ignored, and attribute names are trimmed. This implementation thus
 *   DOES NOT follow <a href="https://tools.ietf.org/html/rfc1464">RFC 1464</a>.</p>
 *
 * <p>There are therefore 4 categories of results that may be returned:
 * <ul>
 *   <li>Attribute not present (Absent)</li>
 *   <li>Attribute present, with no value (e.g., "passreq" -- password required for this service)</li>
 *   <li>Attribute present, with empty value (e.g., "PlugIns=" -- the server supports plugins, but none are
 *     presently installed)</li>
 *   <li>Attribute present, with non-empty value (e.g., "PlugIns=JPEG,MPEG2,MPEG4")</li>
 * </ul>
 * <p>If there is an '=' in a DNS-SD TXT record string, then everything after the first '=' to the end of the
 *   string is the value. The value can contain any eight-bit values including '='. Any quotation marks, or
 *   leading or trailing spaces, are part of the value. It is legal for a value to be any binary data.</p>
 *
 * <p>Each author defining a DNS-SD profile for discovering instances of a particular type of service should
 *   define the interpretation of these different kinds of result. In particular, an empty value might imply
 *   'false', 'unknown', etc.</p>
 * <p>Note that we have the issue that we can never return boolean false. An attribute with no value (i.e., no
 *   '=' in the string) should be mapped to a property that is 'true'. There is no mapping in the standard for
 *   a property that is 'false'. The standard hints at the non-existence of the property, which does map nicely
 *   to Javascript's 'falsy' concept, as the value of a non-existent property is 'undefined', which is 'falsy'.
 *
 * <p>Optional guidelines for the creators of the TXT records are:
 * <ul>
 *  <li>The key SHOULD be no more than 9 characters long.</li>
 *  <li>A given key SHOULD NOT appear more than once in a TXT record.</li>
 * </ul>
 *
 * <p>In this implementation, we choose to return ServiceInstance objects with attribute names always in lower case.
 *  A TXT record string that contains no '=' will become a property with the entire string as name, and {@code true}
 *  as value. Any TXT record string that does not match the standard's criteria, is silently ignored, i.e.,
 *  if the attribute name would contain characters not in `[ -<>-~]`, or start with a '=', or repeat an attribute name
 *  encountered already.</p>
 */
const extendWithTxtStr = new Contract({
  pre: [
    function (obj, txtStr) { return obj && typeof obj === 'object' },
    function (obj, txtStr) { return txtStr && typeof txtStr === 'string' }
  ],
  post: [
    function (obj, txtStr) {
      const result = arguments[arguments.length - 2]
      return result === obj
    }
  ],
  exception: validate.mustNotHappen
}).implementation(function extendWithTxtStr (/* Object */ obj, /* string */ txtStr) {
  const parts = txtStrPattern.exec(txtStr)
  const key = parts[1].toLowerCase()
  console.log(parts)
  obj[key] = parts[2]
  return obj
})

/**
 * Promise for a {@link ServiceInstance}, build from the contents of the SRV and TXT
 * DNS-SD records for {@code serviceInstance}.
 *
 * The Promise is betrayed ({@link lookupInstanceContract.notValidMessage}) when either
 * the SRV resource record or the TXT resource record does not exist , or when there is
 * more then 1 SRV resource record ({@link lookupInstanceContract.moreThen1Message.SRV}),
 * or the TXT resource record ({@link lookupInstanceContract.moreThen1Message.TXT}),
 * respectively.
 *
 * There are no additional preconditions on the contents of the TXT resource record.
 */
function lookupInstanceImpl (/* !string */ serviceInstance) {
  // noinspection JSUnresolvedFunction
  return Promise.all([
    exactly1(serviceInstance, 'SRV', resolveSrv),
    exactly1(serviceInstance, 'TXT', resolveTxt)
      .then(txt => txt.reduce(extendWithTxtStr, {}))
  ])
  .catch(cause => {
    const err = new Error(lookupInstanceContract.notValidMessage)
    err.instance = serviceInstance
    err.cause = cause
    throw err
  })
  .then(data => new ServiceInstance({
    type: `_${extract.type(serviceInstance)}._${extract.protocol(serviceInstance)}.${extract.domain(serviceInstance)}`,
    instance: serviceInstance,
    host: data[0].name,
    port: data[0].port,
    priority: data[0].priority,
    weight: data[0].weight,
    details: data[1]
  }))
}

const lookupInstance = lookupInstanceContract.implementation(lookupInstanceImpl)
lookupInstance.extendWithTxtStr = extendWithTxtStr

module.exports = lookupInstance
