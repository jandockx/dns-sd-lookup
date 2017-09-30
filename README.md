[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=master)](https://travis-ci.org/Toryt/dns-sd-lookup)

Node library that looks up service instance definitions for a service type defined with [DNS-SD] ([RFC 6763]).

**There is no support for Multicast DNS in this library.** This library
only does look-ups in regular DNS. The functionality is comparable to
`dns-sd -B` and `dns-sd -L` (see [dns-sd]). 





Install
=======

    > yarn add @toryt/dns-sd-lookup

or

    > npm install @toryt/dns-sd-lookup





API
===

`ServiceInstance`
-----------------

All lookup methods return `ServiceInstance` objects. These represent an [RFC 6763] _Service Instance_ description.

Instances have the following properties:

- `type`: string; the full [RFC 6763] _Service Type_ name, including the optional [RFC 6763] _Service Subtype_
- `instance`: string; the full [RFC 6763] _Service Instance_ name
- `host`: string; the FQDN of the host that offers the _Service Instance_ (from the DNS `SRV` resource record)
- `port`: natural Number; the TCP port at which the `host` offers the _Service Instance_ (from the DNS `SRV` resource record)
- `priority`: natural Number, that says with which priority the user should use this instance to fulfill `type`
  (lower is higher priority - from the DNS `SRV` resource record)
- `weight`:  natural Number, that says how often the user should use this instance to fulfill `type`, when
  choosing between instances with the same `priority` (from the DNS `SRV` resource record) 
- `details`: Object, that carries extra details about the _Service Instance_ this represents

The details are the key-value pairs expressed in the DNS `TXT` record. All property names are lower case.
[RFC 6763] boolean attributes (i.e., DNS `TXT` resource record strings that do not contain a `=`-character) are 
represented by a property with the attribute name as property name, and the value `true`. Otherwise, `details` property 
values of are always strings, and never `null` or `undefined`, but they might be the empty string. In general, a
property value of a `ServiceInstance.details` object can also be `false`, but an instance returned by one of the
lookup methods of this library will never return that.

According to [RFC 6763], the `details` should at least have a property `txtvers`, with a string value that represents a 
natural number.
 
    const ServiceInstance = require('@toryt/dns-sd-lookup).ServiceInstance

    const instance = new ServiceInstance({
      type: 'sub type._sub._a-service-type._tcp.dns-sd-lookup.toryt.org',
      instance: 'A Service Instance._a-service-type._tcp.dns-sd-lookup.toryt.org',
      host: 'service-host.dns-sd-lookup.toryt.org',
      port: 443,
      priority: 0,
      weight: 0,
      details: {
        at: JSON.stringify(new Date(2017, 9, 17, 0, 33, 14.535)),
        path: '/a/path',
        '%boolean#true]': true,
        'boolean@false~': false,
        txtvers: '23'
      }
    })

    console.log(instance)
    console.log('%j', instance)



`validate`
----------

A collection of string validation methods, related to [RFC 6763].


### `validate`

The validate-functions are available gathered in this namespace too.

    const validate = require('@toryt/dns-sd-lookup).validate

    console.assert(validate.isValidDomainNamePart === require('@toryt/dns-sd-lookup).isValidDomainNamePart)
    console.assert(validate.isBaseServiceType === require('@toryt/dns-sd-lookup).isBaseServiceType)
    console.assert(validate.isServiceType === require('@toryt/dns-sd-lookup).isServiceType)
    console.assert(validate.isServiceInstance === require('@toryt/dns-sd-lookup).isServiceInstance)



Style
=====

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

This code uses [Standard] coding style.





[DNS-SD]: http://www.dns-sd.org
[RFC 6763]: https://www.ietf.org/rfc/rfc6763.txt
[dns-sd]: https://developer.apple.com/legacy/library/documentation/Darwin/Reference/ManPages/man1/dns-sd.1.html
[Standard]: https://standardjs.com
