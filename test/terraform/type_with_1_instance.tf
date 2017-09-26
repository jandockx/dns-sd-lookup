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

variable "protocol" {
  default = "tcp"
}

// NOTE: service type names have a max lenght of 13 chars

module "instance-type_with_1_instance_no_subtype" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/serviceInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "${var.protocol}"
  type           = "t1i-no-sub"                                                            // type for instance 1 - no subtype
  instance       = "Instance\\0401"
  host           = "host-of-instance-1.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "4141"
  priority       = "42"
  weight         = "43"

  details = {
    aDetail = "This is a detail 1"
    txtvers = "44"
  }

  ttl = "${var.ttl}"
}

locals {
  instance-double_txt-type          = "t2i-2-txt"
  instance-double_txt-full_type     = "_${local.instance-double_txt-type}._${var.protocol}.${aws_route53_zone.dns_sd_lookup.name}"
  instance-double_txt-instance      = "Instance\\0402"
  instance-double_txt-full_instance = "${local.instance-double_txt-instance}.${local.instance-double_txt-full_type}"
}

resource "aws_route53_record" "instance-double_txt-ptr" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${local.instance-double_txt-full_type}"
  type    = "PTR"
  ttl     = "${var.ttl}"

  records = [
    "${local.instance-double_txt-full_instance}",
  ]
}

resource "aws_route53_record" "instance-double_txt-txt" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${local.instance-double_txt-full_instance}"
  type    = "TXT"
  ttl     = "${var.ttl}"

  records = [
    "This is a detail 2a\"\"txtvers=60",
    "This is a detail 2b\"\"txtvers=61",
  ]
}

resource "aws_route53_record" "instance-double_txt-srv" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${local.instance-double_txt-full_instance}"
  type    = "SRV"
  ttl     = "${var.ttl}"

  records = [
    "${format("%d %d %d %s", 47, 48, 4949, "host-of-instance-2.${aws_route53_zone.dns_sd_lookup.name}")}",
  ]
}

locals {
  instance-double_srv-type          = "t3i-2-srv"
  instance-double_srv-full_type     = "_${local.instance-double_srv-type}._${var.protocol}.${aws_route53_zone.dns_sd_lookup.name}"
  instance-double_srv-instance      = "Instance\\0403"
  instance-double_srv-full_instance = "${local.instance-double_srv-instance}.${local.instance-double_srv-full_type}"
}

resource "aws_route53_record" "instance-double_srv-ptr" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${local.instance-double_srv-full_type}"
  type    = "PTR"
  ttl     = "${var.ttl}"

  records = [
    "${local.instance-double_srv-full_instance}",
  ]
}

resource "aws_route53_record" "instance-double_srv-txt" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${local.instance-double_srv-full_instance}"
  type    = "TXT"
  ttl     = "${var.ttl}"

  records = [
    "This is a detail 3\"\"txtvers=50",
  ]
}

resource "aws_route53_record" "instance-double_srv-srv" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${local.instance-double_srv-full_instance}"
  type    = "SRV"
  ttl     = "${var.ttl}"

  records = [
    "${format("%d %d %d %s", 51, 52, 5353, "host-of-instance-3a.${aws_route53_zone.dns_sd_lookup.name}")}",
    "${format("%d %d %d %s", 54, 55, 5656, "host-of-instance-3b.${aws_route53_zone.dns_sd_lookup.name}")}",
  ]
}

locals {
  instance-double_txt_srv-type          = "t4i-2-txt-srv"
  instance-double_txt_srv-full_type     = "_${local.instance-double_txt_srv-type}._${var.protocol}.${aws_route53_zone.dns_sd_lookup.name}"
  instance-double_txt_srv-instance      = "Instance\\0404"
  instance-double_txt_srv-full_instance = "${local.instance-double_txt_srv-instance}.${local.instance-double_txt_srv-full_type}"
}

resource "aws_route53_record" "instance-double_txt_srv-ptr" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${local.instance-double_txt_srv-full_type}"
  type    = "PTR"
  ttl     = "${var.ttl}"

  records = [
    "${local.instance-double_txt_srv-full_instance}",
  ]
}

resource "aws_route53_record" "instance-double_txt_srv-txt" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${local.instance-double_txt_srv-full_instance}"
  type    = "TXT"
  ttl     = "${var.ttl}"

  records = [
    "This is a detail 4a\"\"txtvers=60",
    "This is a detail 4b\"\"txtvers=61",
  ]
}

resource "aws_route53_record" "instance-double_txt_srv-srv" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${local.instance-double_txt_srv-full_instance}"
  type    = "SRV"
  ttl     = "${var.ttl}"

  records = [
    "${format("%d %d %d %s", 59, 60, 6161, "host-of-instance-4a.${aws_route53_zone.dns_sd_lookup.name}")}",
    "${format("%d %d %d %s", 62, 63, 6464, "host-of-instance-4b.${aws_route53_zone.dns_sd_lookup.name}")}",
  ]
}

locals {
  instance-no_txt-type          = "t5i-no-txt"
  instance-no_txt-full_type     = "_${local.instance-no_txt-type}._${var.protocol}.${aws_route53_zone.dns_sd_lookup.name}"
  instance-no_txt-instance      = "Instance\\0405"
  instance-no_txt-full_instance = "${local.instance-no_txt-instance}.${local.instance-no_txt-full_type}"
}

resource "aws_route53_record" "instance-no_txt-ptr" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${local.instance-no_txt-full_type}"
  type    = "PTR"
  ttl     = "${var.ttl}"

  records = [
    "${local.instance-no_txt-full_instance}",
  ]
}

resource "aws_route53_record" "instance-no_txt-srv" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${local.instance-no_txt-full_instance}"
  type    = "SRV"
  ttl     = "${var.ttl}"

  records = [
    "${format("%d %d %d %s", 65, 66, 6767, "host-of-instance-5.${aws_route53_zone.dns_sd_lookup.name}")}",
  ]
}

locals {
  instance-no_srv-type          = "t6i-no-srv"
  instance-no_srv-full_type     = "_${local.instance-no_srv-type}._${var.protocol}.${aws_route53_zone.dns_sd_lookup.name}"
  instance-no_srv-instance      = "Instance\\0406"
  instance-no_srv-full_instance = "${local.instance-no_srv-instance}.${local.instance-no_srv-full_type}"
}

resource "aws_route53_record" "instance-no_srv-ptr" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${local.instance-no_srv-full_type}"
  type    = "PTR"
  ttl     = "${var.ttl}"

  records = [
    "${local.instance-no_srv-full_instance}",
  ]
}

resource "aws_route53_record" "instance-no_srv-txt" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${local.instance-no_srv-full_instance}"
  type    = "TXT"
  ttl     = "${var.ttl}"

  records = [
    "This is a detail 6\"\"txtvers=68",
  ]
}
