build-static:
	NEXT_PUBLIC_GA_TRACKING_ID=123 npm run build-static
deploy:
	echo "Under construction!"
infra-init:
	cd infrastructure && terraform init
infra-debug:
	cd infrastructure && TF_LOG=DEBUG terraform apply -auto-approve infra
deploy: build-static
	cd infrastructure && terraform init && terraform apply -auto-approve
preview: build-static
	cd infrastructure && terraform init && terraform plan
fmt:
	cd infrastructure && terraform fmt
undeploy:
	cd infrastructure && terraform destroy