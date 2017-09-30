output "I-zone_id" {
  value = "${aws_route53_zone.dns_sd_lookup.zone_id}"
}

output "I-zone_fqdn" {
  value = "${aws_route53_zone.dns_sd_lookup.name}"
}

output "I-zone_ns" {
  value = "${aws_route53_zone.dns_sd_lookup.name_servers}"
}

output "I-type_with_1_instance_no_subtype-instance" {
  value = "${module.instance-type_with_1_instance_no_subtype.II-instance}"
}

output "I-double_txt-instance" {
  value = "${aws_route53_record.instance-double_txt-srv.name}"
}

output "I-double_srv-instance" {
  value = "${aws_route53_record.instance-double_srv-srv.name}"
}

output "I-double_txt_srv-instance" {
  value = "${aws_route53_record.instance-double_txt_srv-srv.name}"
}

output "I-no_txt-instance" {
  value = "${aws_route53_record.instance-no_txt-srv.name}"
}

output "I-no_srv-instance" {
  value = "${aws_route53_record.instance-no_srv-txt.name}"
}

output "I-type_with_1_instance_subtype" {
  value = "${module.instance-type_with_1_instance_subtype.II-instance}"
}

output "I-n_instances" {
  value = [
    "${module.instance-type_with_n_instances_a.I-instance}",
    "${module.instance-type_with_n_instances_b.I-instance}",
    "${module.instance-type_with_n_instances_c.I-instance}",
    "${module.instance-type_with_n_instances_d.I-instance}",
    "${module.instance-type_with_n_instances_e.I-instance}",
    "${module.instance-type_with_n_instances_g.I-instance}",
    "${module.instance-type_with_n_instances_h.I-instance}",
    "${module.instance-type_with_n_instances_i.I-instance}",
    "${module.instance-type_with_n_instances_j.I-instance}",
    "${module.instance-type_with_n_instances_k.I-instance}",
    "${module.instance-type_with_n_instances_l.I-instance}",
  ]
}
