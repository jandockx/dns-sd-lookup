<!--
  MIT License

  Copyright (c) 2017-2017 Jan Dockx

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
-->

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

(This seems impossible to debug. There is no doubt a reason, but Terraform give
no information on `data "external"` progress, even in case of failure, even in
DEBUG logs).
