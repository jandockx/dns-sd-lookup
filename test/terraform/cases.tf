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

// NOTE: service type names have a max lenght of 15 chars

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

module "instance-type_with_1_instance_subtype" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/serviceInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "${var.protocol}"
  type           = "t7i-sub"
  subtype        = "subtype"
  instance       = "Instance\\0407"
  host           = "host-of-instance-7.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "6868"
  priority       = "69"
  weight         = "70"

  details = {
    aDetail = "This is a detail 71"
    txtvers = "72"
  }

  ttl = "${var.ttl}"
}

locals {
  type_with_n_instances = "t8i-n-inst"
}

module "instance-type_with_n_instances_a" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/dnsSdInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "${var.protocol}"
  type           = "${local.type_with_n_instances}"
  instance       = "Instance\\0408a"
  host           = "host-of-instance-8a.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "7373"
  priority       = "50"
  weight         = "75"

  details = {
    aDetail = "This is a detail 76"
    txtvers = "77"
  }

  ttl = "${var.ttl}"
}

module "instance-type_with_n_instances_b" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/dnsSdInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "${var.protocol}"
  type           = "${local.type_with_n_instances}"
  instance       = "Instance\\0408b"
  host           = "host-of-instance-8b.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "7878"
  priority       = "100"
  weight         = "80"

  details = {
    aDetail = "This is a detail 81"
    txtvers = "82"
  }

  ttl = "${var.ttl}"
}

module "instance-type_with_n_instances_c" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/dnsSdInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "${var.protocol}"
  type           = "${local.type_with_n_instances}"
  instance       = "Instance\\0408c"
  host           = "host-of-instance-8c.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "8383"
  priority       = "150"
  weight         = "3"

  details = {
    aDetail = "This is a detail 86"
    txtvers = "87"
  }

  ttl = "${var.ttl}"
}

module "instance-type_with_n_instances_d" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/dnsSdInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "${var.protocol}"
  type           = "${local.type_with_n_instances}"
  instance       = "Instance\\0408d"
  host           = "host-of-instance-8d.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "8888"
  priority       = "150"
  weight         = "7"

  details = {
    aDetail = "This is a detail 91"
    txtvers = "92"
  }

  ttl = "${var.ttl}"
}

module "instance-type_with_n_instances_e" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/dnsSdInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "${var.protocol}"
  type           = "${local.type_with_n_instances}"
  instance       = "Instance\\0408e"
  host           = "host-of-instance-8e.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "9393"
  priority       = "200"
  weight         = "10"

  details = {
    aDetail = "This is a detail 96"
    txtvers = "97"
  }

  ttl = "${var.ttl}"
}

module "instance-type_with_n_instances_f" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/dnsSdInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "${var.protocol}"
  type           = "${local.type_with_n_instances}"
  instance       = "Instance\\0408f"
  host           = "host-of-instance-8f.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "9898"
  priority       = "200"
  weight         = "20"

  details = {
    aDetail = "This is a detail 99"
    txtvers = "100"
  }

  ttl = "${var.ttl}"
}

module "instance-type_with_n_instances_g" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/dnsSdInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "${var.protocol}"
  type           = "${local.type_with_n_instances}"
  instance       = "Instance\\0408g"
  host           = "host-of-instance-8g.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "1111"
  priority       = "200"
  weight         = "30"

  details = {
    aDetail = "This is a detail 102"
    txtvers = "103"
  }

  ttl = "${var.ttl}"
}

module "instance-type_with_n_instances_h" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/dnsSdInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "${var.protocol}"
  type           = "${local.type_with_n_instances}"
  instance       = "Instance\\0408h"
  host           = "host-of-instance-8h.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "1515"
  priority       = "200"
  weight         = "20"

  details = {
    aDetail = "This is a detail 106"
    txtvers = "107"
  }

  ttl = "${var.ttl}"
}

module "instance-type_with_n_instances_i" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/dnsSdInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "${var.protocol}"
  type           = "${local.type_with_n_instances}"
  instance       = "Instance\\0408i"
  host           = "host-of-instance-8i.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "1818"
  priority       = "200"
  weight         = "20"

  details = {
    aDetail = "This is a detail 109"
    txtvers = "110"
  }

  ttl = "${var.ttl}"
}

module "instance-type_with_n_instances_j" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/dnsSdInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "${var.protocol}"
  type           = "${local.type_with_n_instances}"
  instance       = "Instance\\0408j"
  host           = "host-of-instance-8j.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "2121"
  priority       = "300"
  weight         = "0"

  details = {
    aDetail = "This is a detail 112"
    txtvers = "113"
  }

  ttl = "${var.ttl}"
}

module "instance-type_with_n_instances_k" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/dnsSdInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "${var.protocol}"
  type           = "${local.type_with_n_instances}"
  instance       = "Instance\\0408k"
  host           = "host-of-instance-8k.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "2424"
  priority       = "300"
  weight         = "0"

  details = {
    aDetail = "This is a detail 115"
    txtvers = "116"
  }

  ttl = "${var.ttl}"
}

module "instance-type_with_n_instances_l" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/dnsSdInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "${var.protocol}"
  type           = "${local.type_with_n_instances}"
  instance       = "Instance\\0408l"
  host           = "host-of-instance-8l.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "2727"
  priority       = "300"
  weight         = "0"

  details = {
    aDetail = "This is a detail 118"
    txtvers = "119"
  }

  ttl = "${var.ttl}"
}

resource "aws_route53_record" "type_with_n_instances-PTR" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${lookup(module.instance-type_with_n_instances_a.I-instance, "type")}"
  type    = "PTR"
  ttl     = "${var.ttl}"

  records = [
    "${lookup(module.instance-type_with_n_instances_a.I-instance, "instance")}",
    "${lookup(module.instance-type_with_n_instances_b.I-instance, "instance")}",
    "${lookup(module.instance-type_with_n_instances_c.I-instance, "instance")}",
    "${lookup(module.instance-type_with_n_instances_d.I-instance, "instance")}",
    "${lookup(module.instance-type_with_n_instances_e.I-instance, "instance")}",
    "${lookup(module.instance-type_with_n_instances_f.I-instance, "instance")}",
    "${lookup(module.instance-type_with_n_instances_g.I-instance, "instance")}",
    "${lookup(module.instance-type_with_n_instances_h.I-instance, "instance")}",
    "${lookup(module.instance-type_with_n_instances_i.I-instance, "instance")}",
    "${lookup(module.instance-type_with_n_instances_j.I-instance, "instance")}",
    "${lookup(module.instance-type_with_n_instances_k.I-instance, "instance")}",
    "${lookup(module.instance-type_with_n_instances_l.I-instance, "instance")}",
  ]
}

locals {
  type_with_weird_names    = "t9i-weird"
  subtype_with_weird_names = "_Subtype\\040\\.\\040\\\\\\040escapes,\\040non-ascii\\040\\044\\113\\035?(/\\040just\\040as\\040LongAs\\040allowed"
}

module "instance-type_with_weird_names_a" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/dnsSdInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "${var.protocol}"
  type           = "${local.type_with_weird_names}"
  instance       = "Instance\\0409a"
  host           = "host-of-instance-9a.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "3232"
  priority       = "300"
  weight         = "10"

  details = {
    aDetail = "This is a detail 121"
    txtvers = "122"
  }

  ttl = "${var.ttl}"
}

module "instance-type_with_weird_names_b" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/dnsSdInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "${var.protocol}"
  type           = "${local.type_with_weird_names}"
  instance       = "Instance\\0409b,$\\.\\040?(/\\\\"
  host           = "host-of-instance-9b.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "3333"
  priority       = "300"
  weight         = "70"

  details = {
    aDetail = "This is a detail 123"
    txtvers = "124"
  }

  ttl = "${var.ttl}"
}

module "instance-type_with_weird_names_c" {
  source         = "../../node_modules/@ppwcode/terraform-ppwcode-modules/dnsSdInstance"
  domain-name    = "${aws_route53_zone.dns_sd_lookup.name}"
  domain-zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  protocol       = "${var.protocol}"
  type           = "${local.type_with_weird_names}"
  instance       = "Instance\\0409c"
  host           = "host-of-instance-9b.${aws_route53_zone.dns_sd_lookup.name}"
  port           = "3434"
  priority       = "300"
  weight         = "20"

  details = {
    aDetail = "This is a detail 125"
    txtvers = "126"
  }

  ttl = "${var.ttl}"
}

resource "aws_route53_record" "type_with_weird_names-PTR" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${lookup(module.instance-type_with_weird_names_a.I-instance, "type")}"
  type    = "PTR"
  ttl     = "${var.ttl}"

  records = [
    "${lookup(module.instance-type_with_weird_names_a.I-instance, "instance")}",
    "${lookup(module.instance-type_with_weird_names_b.I-instance, "instance")}",
    "${lookup(module.instance-type_with_weird_names_c.I-instance, "instance")}",
  ]
}

resource "aws_route53_record" "subtype_with_weird_names-PTR" {
  zone_id = "${aws_route53_zone.dns_sd_lookup.zone_id}"
  name    = "${local.subtype_with_weird_names}._sub.${lookup(module.instance-type_with_weird_names_a.I-instance, "type")}"
  type    = "PTR"
  ttl     = "${var.ttl}"

  records = [
    "${lookup(module.instance-type_with_weird_names_a.I-instance, "instance")}",
    "${lookup(module.instance-type_with_weird_names_b.I-instance, "instance")}",
    "${lookup(module.instance-type_with_weird_names_c.I-instance, "instance")}",
  ]
}
