resource "aws_s3_bucket" "www_bucket" {
  bucket = "www.${var.bucket_name}"
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
  policy = templatefile("templates/s3-policy.json", { bucket = "www.${var.bucket_name}" })

  website {
    index_document = "index.html"
    error_document = "404.html"
  }
}

# S3 bucket for redirecting non-www to www.
resource "aws_s3_bucket" "root_bucket" {
  bucket = var.bucket_name
  acl    = "public-read"
  policy = templatefile("templates/s3-policy.json", { bucket = var.bucket_name })

  website {
    redirect_all_requests_to = "https://www.${var.domain_name}"
  }

  tags = var.common_tags
}