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

module "instance-type_with_1_instance_no_subtype" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/serviceInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "tcp"
  type           = "type-with-1-instance-no-subtype"
  instance       = "Instance\\040Of\\040Type\\040With\\0401\\040Instance, No Subtype"
  host           = "host-of-instance-with-type-of-1-instance-no-subtype.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "4242"
  priority       = "43"
  weight         = "44"

  details = {
    aDetail = "This is a detail"
    txtvers = "1"
  }

  ttl = "${var.ttl}"
}
