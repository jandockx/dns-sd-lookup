# @toryt/dns-sd-lookup History

## master

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=master)](https://travis-ci.org/Toryt/dns-sd-lookup)
[![codecov](https://codecov.io/bb/toryt/dns-sd-lookup/branch/master/graph/badge.svg)](https://codecov.io/bb/toryt/dns-sd-lookup)

## feature/pipelines

[![Build Status](https://img.shields.io/bitbucket/pipelines/toryt/dns-sd-lookup/feature/pipelines.svg)](https://bitbucket.org/toryt/dns-sd-lookup/addon/pipelines/home#!/results/branch/feature%252Fpipelines/page/1)
[![codecov](https://codecov.io/bb/toryt/dns-sd-lookup/branch/feature/pipelines/graph/badge.svg)](https://codecov.io/bb/toryt/dns-sd-lookup)

- Transition from Github to Bitbucket, and from Travis to Bitbucket pipelines.
- Make tests that were relaxed in 1.1.10 for Travis stricter again.

## 1

### 1.1

#### 1.1.15

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.15)](https://travis-ci.org/Toryt/dns-sd-lookup)
[![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.15/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup)

- Dependency updates.
- Release in response to a `lodash` security alert.

#### 1.1.14

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.14)](https://travis-ci.org/Toryt/dns-sd-lookup)
[![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.14/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup)

- Dependency updates. 
- Update `js-yaml` in package-json, to resolve security issues
- Drop support for Node 6

#### 1.1.13

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.13)](https://travis-ci.org/Toryt/dns-sd-lookup)
[![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.13/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup)

- README changes

#### 1.1.12

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.12)](https://travis-ci.org/Toryt/dns-sd-lookup)
[![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.12/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup)

- update dependencies, a/o to remove security issue with `handlebars` via nyc
- remove `postinstall` (that was a bad idea)
- add dependency on `ppwcode/scripts` as submodule, and use it in CI

#### 1.1.11

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.11)](https://travis-ci.org/Toryt/dns-sd-lookup)
[![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.11/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup)

- change test assertion framework from `must` to `should`
- update dependencies
- make Node 10 default dev environment.

#### 1.1.10

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.10)](https://travis-ci.org/Toryt/dns-sd-lookup)
[![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.10/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup)

- add `postinstall` to always have up-to-date [CREDITS](./CREDITS.md)
- update dependencies
- Try to resolve Travis issues: Change DNS test batch size to 3, because Travis has an issue with bigger batches.

There still are regular test timeouts after this. This is the main reason to consider Bitbucket Pipelines as an 
alternative.

#### 1.1.9

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.9)](https://travis-ci.org/Toryt/dns-sd-lookup)
[![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.9/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup)

- tweak README

#### 1.1.8

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.8)](https://travis-ci.org/Toryt/dns-sd-lookup)
[![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.8/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup)

- update dependencies
- refactor to new `standard` requirements
- test on Node 10
- fix `codecov`
- Try to resolve Travis issues: raise the bar for some tests :-(
- replace `npm-shrinkwrap` with `package-lock`

This now means that we no longer have a lock on Node 6. No worries though, because the lock is only for dev and test, 
as this is a library in the first place.

#### 1.1.7

_skipped_

- update dependencies
- tweak README
- make Node 8 default dev environment.

#### 1.1.6

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.6)](https://travis-ci.org/Toryt/dns-sd-lookup)
[![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.6/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup)

- change links in doc from Bitbucket to Github

#### 1.1.5

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.5)](https://travis-ci.org/Toryt/dns-sd-lookup)
[![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.5/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup)

- update dependencies
- develop in Node 6
- update from `@toryt/contracts-iii` to `@toryt/contracts-iv`
- add extra postconditions and tests
- no longer use `yarn`
- stop using Bitbucket pipelines - there are too few build minutes on Bitbucket

#### 1.1.4

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.4)](https://travis-ci.org/Toryt/dns-sd-lookup)
[![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.4/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup)

- test Node 8 on Travis

#### 1.1.3

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.3)](https://travis-ci.org/Toryt/dns-sd-lookup)
[![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.3/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup)

- update dependencies
- refactor to new `standard` requirements
- add `preversion` script

#### 1.1.2

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.2)](https://travis-ci.org/Toryt/dns-sd-lookup)
[![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.2/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup)

- update dependencies
- add cases in DNS

#### 1.1.1

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.1)](https://travis-ci.org/Toryt/dns-sd-lookup)
[![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.1/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup)

- tweak README

#### 1.1.0

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.1.0)](https://travis-ci.org/Toryt/dns-sd-lookup)
[![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.1.0/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup)

- add `validate#isSubtypeOrInstanceName`
- update dependencies
- tweak README

### 1.0

#### 1.0.2

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.0.2)](https://travis-ci.org/Toryt/dns-sd-lookup)
[![codecov](https://codecov.io/gh/Toryt/dns-sd-lookup/branch/v1.0.2/graph/badge.svg)](https://codecov.io/gh/Toryt/dns-sd-lookup)

- update dependencies
- add `codecov`, and generate from Travis

#### 1.0.1

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.0.1)](https://travis-ci.org/Toryt/dns-sd-lookup)

- remove license info from `*.md` files - they are visible, and that is not the intention

#### 1.0.0

[![Build Status](https://travis-ci.org/Toryt/dns-sd-lookup.svg?branch=v1.0.0)](https://travis-ci.org/Toryt/dns-sd-lookup)

- first release
