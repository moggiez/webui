terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
  }
}

provider "aws" {
  region = var.region
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

resource "aws_s3_bucket" "ui_bucket" {
  bucket = var.website_bucket_name
  acl    = "public-read"

  tags = {
    Project     = var.application
    Name        = "Website"
    Environment = "production"
  }

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
  policy = jsonencode(
    {
      "Version" : "2008-10-17",
      "Statement" : [
        {
          "Sid" : "PublicReadForGetBucketObjects",
          "Effect" : "Allow",
          "Principal" : {
            "AWS" : "*"
          },
          "Action" : "s3:GetObject",
          "Resource" : "arn:aws:s3:::${var.website_bucket_name}/*"
        }
      ]
    }
  )

  website {
    index_document = "index.html"
    error_document = "404.html"
  }
}

resource "aws_s3_bucket_object" "static_files" {
  for_each     = fileset(var.upload_directory, "**/*.*")
  bucket       = aws_s3_bucket.ui_bucket.id
  key          = each.value
  source       = "${var.upload_directory}/${each.value}"
  acl          = "public-read"
  etag         = filebase64sha256("${var.upload_directory}/${each.value}")
  content_type = lookup(local.content_type, element(split(".", each.value), length(split(".", each.value)) - 1), "text/html")
}