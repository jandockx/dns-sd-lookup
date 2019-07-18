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



| Version | Build Status | Coverage |
|:--------|:-------------|:---------|
| `feature/pipelines` | [![Build Status](https://img.shields.io/bitbucket/pipelines/toryt/dns-sd-lookup/feature/pipelines.svg)](https://bitbucket.org/toryt/dns-sd-lookup/addon/pipelines/home#!/results/branch/feature%252Fpipelines/page/1) | [![codecov](https://codecov.io/bb/toryt/dns-sd-lookup/branch/feature/pipelines/graph/badge.svg)](https://codecov.io/bb/toryt/dns-sd-lookup) |
| `master` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=master)](https://travis-ci.org/Toryt/dns-sd-lookup) | [![codecov](https://codecov.io/bb/toryt/dns-sd-lookup/branch/master/graph/badge.svg)](https://codecov.io/bb/toryt/dns-sd-lookup) |
| `1.1.15` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.15)](https://travis-ci.org/Toryt/dns-sd-lookup) | [![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.15/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup) |
| `1.1.14` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.14)](https://travis-ci.org/Toryt/dns-sd-lookup) | [![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.14/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup) |
| `1.1.13` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.13)](https://travis-ci.org/Toryt/dns-sd-lookup) | [![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.13/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup) |
| `1.1.12` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.12)](https://travis-ci.org/Toryt/dns-sd-lookup) | [![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.12/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup) |
| `1.1.11` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.11)](https://travis-ci.org/Toryt/dns-sd-lookup) | [![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.11/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup) |
| `1.1.10` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.10)](https://travis-ci.org/Toryt/dns-sd-lookup) | [![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.10/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup) |
| `1.1.9` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.9)](https://travis-ci.org/Toryt/dns-sd-lookup) | [![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.9/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup) |
| `1.1.8` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.8)](https://travis-ci.org/Toryt/dns-sd-lookup) | [![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.8/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup) |
| `1.1.7` | _skipped_ | |
| `1.1.6` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.6)](https://travis-ci.org/Toryt/dns-sd-lookup) | [![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.6/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup) |
| `1.1.5` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.5)](https://travis-ci.org/Toryt/dns-sd-lookup) | [![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.5/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup) |
| `1.1.4` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.4)](https://travis-ci.org/Toryt/dns-sd-lookup) | [![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.4/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup) |
| `1.1.3` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.3)](https://travis-ci.org/Toryt/dns-sd-lookup) | [![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.3/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup) |
| `1.1.3` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.2)](https://travis-ci.org/Toryt/dns-sd-lookup) | [![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.2/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup) |
| `1.1.1` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.1)](https://travis-ci.org/Toryt/dns-sd-lookup) | [![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.1/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup) |
| `1.1.0` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.0)](https://travis-ci.org/Toryt/dns-sd-lookup) | [![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.0/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup) |
| `1.0.2` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.0.2)](https://travis-ci.org/Toryt/dns-sd-lookup) | [![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.0.2/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup) |
| `1.0.1` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.0.1)](https://travis-ci.org/Toryt/dns-sd-lookup) | |
| `1.0.0` | [![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.0.0)](https://travis-ci.org/Toryt/dns-sd-lookup) | |





## Install

    > npm install --save @toryt/dns-sd-lookup



## Other

- [API]



## Side information

While building this library, I had to burrow through some confusion. Here are some notes:

* [Difference between DNS labels and full names, and internet host names]
* [How to define multi-string TXT resource records]





## Style

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

This code uses [Standard] coding style.

Coverage with [Istanbul] and [Codecov].




## License

Released under the [MIT License]

Copyright (c) 2017-2019 Jan Dockx

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.





## Credits

`dns-sd-lookup` builds on the work of many people through [F/OSS]. See the [credits].





## Plan


## MUDO


## TODO

* get rid of nodegit (indirect for terraform)
* Make `prettier-standard`
* Further automate build (with tags, and building of [`CREDITS.md`](CREDITS.md), …)






[DNS-SD]: http://www.dns-sd.org
[RFC 6763]: https://www.ietf.org/rfc/rfc6763.txt
[dns-sd]: https://developer.apple.com/legacy/library/documentation/Darwin/Reference/ManPages/man1/dns-sd.1.html
[RFC 2782]: https://www.ietf.org/rfc/rfc2782.txt
[Difference between DNS labels and full names, and internet host names]: ./On_dns_full_and_domain_and_host_names.md
[How to define multi-string TXT resource records]: ./HowtoDefineMultiStringTXTRecords.md
[Standard]: https://standardjs.com
[Istanbul]: https://istanbul.js.org
[Codecov]: https://codecov.io/bb/toryt/dns-sd-lookup
[MIT License]: ./LICENSE
[F/OSS]: https://opensource.org
[API]: ./API.md
[credits]: ./CREDITS.md
