variable "region" {
  type    = string
  default = "eu-west-1"
}

variable "domain_name" {
  type        = string
  description = "The domain name for the website."
}

variable "common_tags" {
  description = "Common tags you want applied to all components."
}