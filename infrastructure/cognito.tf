resource "aws_cognito_user_pool" "moggies" {
  name = "moggies.io"

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }
}