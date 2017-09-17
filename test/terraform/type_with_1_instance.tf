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
  type           = "type-1-instance-no-subtype"
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

module "instance-double_txt" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/serviceInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "tcp"
  type           = "type-2-double-txt"
  instance       = "Instance\\0402"
  host           = "host-of-instance-2.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "4545"
  priority       = "46"
  weight         = "47"

  details = {
    aDetail = "This is a detail 2"
    txtvers = "48"
  }

  ttl = "${var.ttl}"
}

resource "aws_route53_record" "instance-double_txt-txt2" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${lookup(module.instance-double_txt.II-instance, "instance")}"
  type    = "TXT"
  ttl     = "${var.ttl}"

  records = ["This is a detail 2b\"\"txtvers=49"]
}

module "instance-double_srv" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/serviceInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "tcp"
  type           = "type-3-double-srv"
  instance       = "Instance\\0403"
  host           = "host-of-instance-3.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "5050"
  priority       = "51"
  weight         = "52"

  details = {
    aDetail = "This is a detail 3"
    txtvers = "53"
  }

  ttl = "${var.ttl}"
}

resource "aws_route53_record" "instance-double_srv-srv2" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${lookup(module.instance-double_srv.II-instance, "instance")}"
  type    = "SRV"
  ttl     = "${var.ttl}"

  records = [
    "${format("%d %d %d %s", 54, 55, 56, "host-of-instance-3b.${aws_route53_zone.dns_sd_lookup.name}")}",
  ]
}

module "instance-double_txt_srv" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/serviceInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "tcp"
  type           = "type-4-double-txt"
  instance       = "Instance\\0404"
  host           = "host-of-instance-4.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "5757"
  priority       = "58"
  weight         = "59"

  details = {
    aDetail = "This is a detail 4"
    txtvers = "60"
  }

  ttl = "${var.ttl}"
}

resource "aws_route53_record" "instance-double_txt_srv-txt2" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${lookup(module.instance-double_txt_srv.II-instance, "instance")}"
  type    = "TXT"
  ttl     = "${var.ttl}"

  records = [
    "This is a detail 4b\"\"txtvers=61",
  ]
}

resource "aws_route53_record" "instance-double_txt_srv-srv2" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${lookup(module.instance-double_txt_srv.II-instance, "instance")}"
  type    = "SRV"
  ttl     = "${var.ttl}"

  records = [
    "${format("%d %d %d %s", 62, 63, 64, "host-of-instance-4b.${aws_route53_zone.dns_sd_lookup.name}")}",
  ]
}
