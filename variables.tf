
###########
# Variables
###########

variable "custom_domain" {
  description = "Your custom domain"
  type        = string
  default     = "moggies.io"
}

variable "custom_domain_zone_name" {
  description = "The Route53 zone name of the custom domain"
  type        = string
  default     = "moggies.io."
}

variable "env" {
  description = "Environment"
  type        = string
  default     = "test"
}