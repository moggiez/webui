# resource "aws_ses_domain_identity" "_" {
#   domain = var.domain_name
# }

# resource "aws_route53_record" "amazonses_verification_record" {
#   zone_id = aws_route53_zone.main.zone_id
#   name    = "_amazonses.${var.domain_name}"
#   type    = "TXT"
#   ttl     = "600"
#   records = [aws_ses_domain_identity._.verification_token]
# }

# resource "aws_route53_record" "mx" {
#   zone_id = aws_route53_zone.main.zone_id
#   type    = "MX"
#   name    = var.domain_name
#   ttl     = "600"
#   records = ["10 inbound-smtp.us-east-1.amazonaws.com"]
# }