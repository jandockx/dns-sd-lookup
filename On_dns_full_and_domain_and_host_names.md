# On DNS Full Names, Domain Names, and Host Names

## https://www.ietf.org/rfc/rfc2181.txt, 11

A _DNS full name_ is a sequence of _labels_ separated by dots ('.')

> The DNS itself places only one restriction on the particular labels that can be used to identify resource records.
> That one restriction relates to the length of the label and the full name. The length of any one label is limited to
> between 1 and 63 octets. A full domain name is limited to 255 octets (including the separators). […] Those
> restrictions aside, any binary string whatever can be used as the label of any resource record."

The _DNS full name_, _domain name_, or _FQDN_ of a DNS resource record is not necessarily a _host name_. The syntax of
_host names_ is more strict. The terms _full name_ and _host name_ are relatively unambiguous. The terms _domain name_
and _FQDN_ are use in different texts both for _DNS full names_ and _internet host names_. Mostly, _FQDN_ refers to an
_internet host name_, but actually a _domain name_ is a _DNS full name_.

https://en.wikipedia.org/wiki/Domain_name

> Labels in the Domain Name System are case-insensitive
>
> The full domain name may not exceed a total length of 253 ASCII characters in its textual representation.
>
> Hostnames impose restrictions on the characters allowed in the corresponding domain name. A valid hostname is also a
> valid domain name, but a valid domain name may not necessarily be valid as a hostname.

This means that `validator.isFQDN`, and peer implementations (like `is-fqdn`, `joi.isFqdn`, …) are wrongly named. They
are validating _host names_, not _domain names_ or _full names_. They do not allow any byte in labels, but limit the
allowed characters.

> The character set allowed in the Domain Name System is based on ASCII […] ICANN approved the Internationalized domain
> name (IDNA) system, which maps Unicode strings used in application user interfaces into the valid DNS character set by
> an encoding called Punycode. For example, københavn.eu is mapped to xn--kbenhavn-54a.eu."

## https://en.wikipedia.org/wiki/Hostname

> Hostnames are composed of series of labels concatenated with dots, as are all domain names. […] Each label must be
> from 1 to 63 characters long, and the entire hostname (including the delimiting dots but not a trailing dot) has a
> maximum of 253 ASCII characters. The Internet standards […] mandate that component hostname labels may contain only
> the ASCII letters 'a' through 'z' (in a case-insensitive manner), the digits '0' through '9', and the minus sign
> ('-'). The original specification of hostnames in RFC 952, mandated that labels could not start with a digit or with a
> minus sign, and must not end with a minus sign. However, a subsequent specification (RFC 1123) permitted hostname
> labels to start with digits. No other symbols, punctuation characters, or white space are permitted."
>
> While a hostname may not contain other characters, such as the underscore character (\_), other DNS names may contain
> the underscore. Systems such […] service records use the underscore as a means to assure that their special character
> is not confused with hostnames."

## In practice, 2017

### https://www.kinamo.be/en/support/faq/domain-name-syntax

> Domain names with the following tld's can contain special characters: .be domain name:
> ßàáâãóôþüúðæåïçèõöÿýòäœêëìíøùîûñé"

### https://www.iplocation.net/domain-names

> What are the valid characters and how long can it be?
>
> - Only alphanumeric (A through Z, 0 through 9) and dash (-) characters are allowed. No symbols including @ are
>   allowed.
> - Domain name cannot begin with a dash.
> - Domain name can be 1 to 63 characters long excluding TLD (.com, .net or .org), but you may only register names that
>   are only 3 - 63 characters long. A single letter (or digit) domain names for .COM, .NET and .ORG are reserved by
>   IANA, and cannot be registered. The 2 char domain names are only available through secondary market.
> - Domain name is case-insensitive, but usually written in all lower-case."

The allowed characters in a host name differ between TLDs, and change over time.

## Existing regular expressions and validators

### http://rubular.com/r/KByADagF3Z

    /[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+/

is only correct in a very strict, early sense.

### https://stackoverflow.com/a/41701826/4580818

> My RegEx I came up with while doing the Hostname/FQDN validation in javascript:
>
> - FQDN:
>
>       ^(?!:\/\/)(?!.{256,})(([a-z0-9][a-z0-9_-]*?\.)+?[a-z]{2,6}?)$/i
>
> - Hostname or FQDN
>
>       ^(?!:\/\/)(?!.{256,})(([a-z0-9][a-z0-9_-]*?)|([a-z0-9][a-z0-9_-]*?\.)+?[a-z]{2,6}?)$/i
>
> Both expressions use look-ahead to check the total string length which can be up to 255 characters. They also do a
> lazy check .{x,y}?. Note that it is using case-insensitive match /i."

is interesting, but only allows a-z0-9. The difference between 'hostname or FQDN" and "fqdn" is unclear to me.

## Service names

### https://www.ietf.org/rfc/rfc6763.txt, 7

> The rules for Service Names [RFC6335] state that they may be no more than fifteen characters long (not counting the
> mandatory underscore), consisting of only letters, digits, and hyphens, must begin and end with a letter or digit,
> must not contain consecutive hyphens, and must contain at least one letter. […] While both uppercase and lowercase
> letters may be used for mnemonic clarity, case is ignored for comparison purposes.
