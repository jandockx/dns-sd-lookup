Node CLI script that looks up service instance definitions for a service type defined with DNS-SD (RFC 6763).

The functionality can also be used as a library in another component.





Use as a CLI program
====================

Prerequisites
-------------

[Node] and should be installed. [Yarn] is advised.



Installation
------------

    > yarn global add @toryt/dns-sd-lookup

or

    > npm install -g @toryt/dns-sd-lookup



Run
---

`bin/dns_sd_lookup.js` is a CLI tool that uses this code.
This program is installed in npm as `dns_sd_lookup`.

The command returns a JSON representation of all service instances that are found
for the given service type in the given domain.



Help
----

See

     > dns_sd_lookup -h

for help.



Parameters
----------

Execute

    > dns_sd_lookup -h

for a description of the parameters.

Parameters are defined in rc files, in environment variables, or command line parameters. Add files, environment
variables and / or command line parameters, to override a default setting,  according to the rules defined in [rc].

Parameter values defined in a location with higher precedence override parameter values defined in locations
with lower precedence. The parameters can be defined in, in descending order of
precedence:

- command line arguments: see `dns_sd_lookup -h` for a list and a description
- environment variables:  of the form `dns_sd_lookup_${parameter name}`
- an rc file which you refer to in the `--config` command line argument
- a rc file `.dns_sd_lookuprc` in the cwd, or any of it's parents
- `$HOME/.dns_sd_lookuprc`
- `$HOME/.dns_sd_lookup/config`
- `$HOME/.config/dns_sd_lookup`
- `$HOME/.config/dns_sd_lookup/config`
- `/etc/dns_sd_lookuprc`
- `/etc/dns_sd_lookup/config`

### Example rc file

    type = _jeff._sub._api._tcp.dns-sd-lookup.toryt.org



Example usage
-------------

// MUDO

    > dns_sd_lookup
    {
// MUDO
    }





Use as a library
================

Installation
------------

    > yarn add @toryt/dns-sd-lookup

or

    > npm install @toryt/dns-sd-lookup --save


// MUDO





Style
=====

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

This code uses [Standard] coding style.





[Node]: https://nodejs.org/
[Yarn]: https://yarnpkg.com/
[rc]: https://www.npmjs.com/package/rc
[Standard]: https://standardjs.com
