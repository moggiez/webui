infra-init:
	terraform init
preview-infra:
	terraform init && terraform plan
fmt:
	terraform fmt
deploy-test:
	TF_VAR_env=test terraform init && terraform apply
deploy-prod:
	TF_VAR_env=prod terraform init && terraform apply