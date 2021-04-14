terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.region
}

provider "aws" {
  alias  = "acm_provider"
  region = "us-east-1"
}

locals {
  content_type = {
    "html" : "text/html",
    "htm" : "text/html",
    "svg" : "image/svg+xml",
    "jpg" : "image/jpeg",
    "jpeg" : "image/jpeg",
    "gif" : "image/gif",
    "png" : "application/pdf",
    "css" : "text/css",
    "js" : "application/javascript",
    "txt" : "text/plain",
    "ico" : "image/x-icon"
  }
}

resource "aws_s3_bucket_object" "static_files" {
  for_each     = fileset(var.upload_directory, "**/*.*")
  bucket       = aws_s3_bucket.www_bucket.id
  key          = each.value
  source       = "${var.upload_directory}/${each.value}"
  acl          = "public-read"
  etag         = filebase64sha256("${var.upload_directory}/${each.value}")
  content_type = lookup(local.content_type, element(split(".", each.value), length(split(".", each.value)) - 1), "text/html")
}