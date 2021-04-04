variable "application" {
  type    = string
  default = "MoggiezWebUI"
}

variable "region" {
  type    = string
  default = "eu-west-1"
}

variable "website_bucket_name" {
  type    = string
  default = "moggiez-web-ui"
}

variable "domain_name" {
  type    = string
  default = "moggies.com"
}

variable "upload_directory" {
  type    = string
  default = "../out"
}