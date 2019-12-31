This Terraform configuration defines the test environment for the integration tests
of `lookupInstance`, `discover` and `selectInstance`.

There are no services behind these definitions.

The TTL has impact on the speed of the tests.
When we test, e.g., 100 look-ups, with a TTL of 30s, we see a stall in every test for
several seconds.
This is when the TTL has passed, and the DNS system goes back all the way to the
SOA.

Setting a longer TTL will result in less stalls. A non-stalled lookup is
fast enough. However, a longer TTL also results in less flexibility. When the
service definition changes, it might take a maximum of the TTL, and half the TTL
on average (plus a few seconds), before clients know about the change. Also,
access of the SOA will be more frequent with a shorter TTL, which results in higher
traffic costs at AWS.

If this fails …
===============

… you probably forgot to commit and push. The scripts in
`@ppwcode/terraform-ppwcode-modules` don't want to apply if the repo
is unsafe.

Also, you first need to create the hosted zone without the meta information,
and then add it, or it won't work.

(This seems impossible to debug. There is no doubt a reason, but Terraform gives
no information on `data "external"` progress, even in case of failure, even in
DEBUG logs).

Issues with non-printable characters
====================================

In DNS, resource record set names are dot-separated sequences of _labels_. Labels are sequences of octets, and all
octets are allowed. Octets thus are interpreted as ASCII characters. Since all octets are allowed, also non-printable
characters, the space, and the period are allowed.

AWS Route53 documentation
[DNS Domain Name Format/Formatting Domain Names for Hosted Zones and Records](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/DomainNameFormat.html#domain-name-format-hosted-zones)
specifies what AWS Route53 does.

The following characters are used as is in labels:

    a-z0-9-!"#$%&'()*+,-/:;<=>?@[\]^_`{|}~\.

_Note that this list contains `.`, but that is the label separator._

When you send `[A-Z]`, the characters are converted to lower case.
To send other octets, you must send the octal escape code `\nnn`.

Notably, for the period, you should send `\056`. For space, `\040`. For `ä`, `\344`.

AWS Route53 stores all characters that are not

    a-z0-9-_

as octal escapes, and returns them as octal escapes.

This means you can _send_, e.g., `@`, but you get back `\100`. Note that you can also send `\100` for the same effect.
This applies to all the characters:

    !"#$%&'()*+,-/:;<=>?@[\]^`{|}~\

(Not the period).

[Terraform PR 4183](https://github.com/terraform-providers/terraform-provider-aws/pull/4183/files/b5fa8ed08131d7643ee48ce73806df08f581487e#diff-7f12b54e3263d749179bfb63338a8919)
changes `func cleanRecordName` to always un-escape resource record set names returned from AWS, before it is compared
to the name specified by the user. This means the user can use `!"#$%&'()*+,-/:;<=>?@[\]^`{|}~\` in resource record set
names, but not octal codes.

If the user specifies `a@b.example.org`, this is send _as is_ to AWS. AWS returns `a\100b.example.org`, which is cleaned
to `a@b.example.org`, which is the same as what was send.

If the user specifies `a\\100b.example.org`, this is send as `a\100b.example.org` to AWS. AWS returns
`a\100b.example.org`, which is cleaned to `a@b.example.org`, which is _not the same as what was send_. Terraform now no
longer recognizes this.

For `!"#$%&'()*+,-/:;<=>?@[\]^`{|}~\`, the obvious workaround is to not use the octal representation.

But it is now impossible to use any other non-printable character, like the period, the space,
or `ä`:

| User specified        | Send                 | Returned             | Cleaned           |
| --------------------- | -------------------- |  ------------------- | ----------------- |
| `a\\056b.example.org` | `a\056b.example.org` | `a\056b.example.org` | `a.b.example.org` |
| `a\\040b.example.org` | `a\040b.example.org` | `a\040b.example.org` | `a b.example.org` |
| `a\\344b.example.org` | `a\344b.example.org` | `a\344b.example.org` | `aäb.example.org` |

For the user to be able to specify the period (`\056`), `\000-\039`, or `\177`, it must be possible for the user to
specify escape codes. While the Go character escapes could be used for `\000-\039` (e.g., `\t` for `\011`), there is
no other option for the period (`\056`).

A solution therefor is to not clean what is returned from AWS, but instead make sure we compare what is returned
to an escaped version of what the user specified.
