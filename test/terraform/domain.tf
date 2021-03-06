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

resource "aws_route53_delegation_set" "main" {
  reference_name = "Main dns-sd-lookup Delegation Set"

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_route53_zone" "dns_sd_lookup" {
  name              = "dns-sd-lookup.toryt.org"
  delegation_set_id = "${aws_route53_delegation_set.main.id}"

  tags {
    environment = "test"
  }
}

module "meta" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/domain_version"
  zone_id        = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  domain_name    = "${aws_route53_zone.dns_sd_lookup.name}"
  ns-domain_name = "${aws_route53_zone.dns_sd_lookup.name_servers[0]}"
  ttl            = "${var.ttl}"

  additional_meta = {
    build = "${var.build}"
  }
}
