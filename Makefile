infra-init:
	cd infrastructure && terraform init
init-waypoint:
	waypoint init && docker pull hashicorp/waypoint:latest && waypoint install --platform=docker -accept-tos
infra-debug:
	cd infrastructure && TF_LOG=DEBUG terraform apply -auto-approve infra
deploy-infra:
	cd infrastructure && terraform init && terraform apply -auto-approve
preview-infra:
	cd infrastructure && terraform init && terraform plan
fmt:
	cd infrastructure && terraform fmt
destroy-infra:
	cd infrastructure && terraform destroy
deploy:
	waypoint up
destroy:
	waypoint destroy