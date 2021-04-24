resource "aws_acm_certificate" "ssl_certificate_main" {
  domain_name               = var.domain_name
  subject_alternative_names = ["*.${var.domain_name}"]
  validation_method         = "EMAIL"

  tags = var.common_tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "cert_validation_main" {
  certificate_arn = aws_acm_certificate.ssl_certificate_main.arn
}