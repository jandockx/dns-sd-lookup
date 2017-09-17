This Terraform configuration defines the test environment for the integration tests
of `lookupInstance`, `discover` and `selectInstance`.

There are no services behind these definitions.

The TTL has impact on the speed of the tests.
When we test, e.g., 100 lookups, with a TTL of 30s, we see a stall in every test for
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

(This seems impossible to debug. There is no doubt a reason, but Terraform give
no information on `data "external"` progress, even in case of failure, even in
DEBUG logs).
