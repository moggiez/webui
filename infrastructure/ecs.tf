resource "aws_ecr_repository" "moggies-repo" {
  name = "moggies-webui-repo"
}

resource "aws_ecs_cluster" "moggies" {
  name = "moggies-webui-cluster"
}