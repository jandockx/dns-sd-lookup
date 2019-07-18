# @toryt/dns-sd-lookup

Node library that looks up service instance definitions for a service type defined with [DNS-SD] ([RFC 6763]).

[![npm version](http://img.shields.io/npm/v/@toryt/dns-sd-lookup.svg?style=flat)](https://npmjs.org/package/@toryt/dns-sd-lookup "View this project on npm")
![downloads](https://img.shields.io/npm/dt/@toryt/dns-sd-lookup.svg)
![dependencies](https://img.shields.io/david/Toryt/dns-sd-lookup.svg)
![development dependencies](https://img.shields.io/david/dev/Toryt/dns-sd-lookup.svg)
[![issues](https://img.shields.io/github/issues/Toryt/dns-sd-lookup.svg)](https://github.com/Toryt/dns-sd-lookup/issues)
[![pull requests](https://img.shields.io/github/issues-pr-closed/Toryt/dns-sd-lookup.svg)](https://github.com/Toryt/dns-sd-lookup/pulls)
![contributors](https://img.shields.io/github/contributors/Toryt/dns-sd-lookup.svg)
![last commit](https://img.shields.io/github/last-commit/Toryt/dns-sd-lookup.svg)
![commit activity](https://img.shields.io/github/commit-activity/y/Toryt/dns-sd-lookup.svg)
![# languages](https://img.shields.io/github/languages/count/Toryt/dns-sd-lookup.svg)
![top language](https://img.shields.io/github/languages/top/Toryt/dns-sd-lookup.svg)

This project is maintained on [Bitbucket](https://bitbucket.org/toryt/dns-sd-lookup) and released on 
[npm](https://www.npmjs.com/package/@toryt/dns-sd-lookup).

**There is no support for Multicast DNS in this library.** This library only does look-ups in regular DNS. The 
functionality is comparable to `dns-sd -B` and `dns-sd -L` (see [dns-sd]). 



## Install

    > npm install --save @toryt/dns-sd-lookup



## Other

- See [API] for detailed documentation
- [release history]
- Released under the [MIT License]
- `dns-sd-lookup` builds on the work of many people through [F/OSS]. See the [credits].



## Side information

While building this library, I had to burrow through some confusion. Here are some notes:

* [Difference between DNS labels and full names, and internet host names]
* [How to define multi-string TXT resource records]



## Style

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

This code uses [Standard] coding style.

Coverage with [Istanbul] and [Codecov].



[DNS-SD]: http://www.dns-sd.org
[dns-sd]: https://developer.apple.com/legacy/library/documentation/Darwin/Reference/ManPages/man1/dns-sd.1.html
[Difference between DNS labels and full names, and internet host names]: ./On_dns_full_and_domain_and_host_names.md
[How to define multi-string TXT resource records]: ./HowtoDefineMultiStringTXTRecords.md
[Standard]: https://standardjs.com
[Istanbul]: https://istanbul.js.org
[Codecov]: https://codecov.io/bb/toryt/dns-sd-lookup
[MIT License]: ./LICENSE
[F/OSS]: https://opensource.org
[API]: ./API.md
[credits]: ./CREDITS.md
[release history]: ./HISTORY.md
