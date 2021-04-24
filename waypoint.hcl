project = "webui"


labels = { "project" = "moggies" }

# An application to deploy.
app "nextjs-webui" {
    build {
        use "pack" {}
        
        registry {
            use "aws-ecr" {
                region     = "eu-west-1"
                repository = "moggies-webui-repo"
                tag        = gitrefpretty()
            }
        }

    }

    deploy {
        use "aws-ecs" {
            cluster = "moggies-webui-cluster"
            region  = "eu-west-1"
            memory  = "512"
            alb {
                certificate = "arn:aws:acm:eu-west-1:989665778089:certificate/6d064504-7b45-414e-8bb2-78ef4d5b2009"
                domain_name = "moggies.io"
                zone_id = "Z1031385SQRT6FLV9XUJ"
            }
        }
    }
}
