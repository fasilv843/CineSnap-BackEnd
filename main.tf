provider "aws" {
  profile = var.aws_profile
  region = var.aws_region
}

# VPC
resource "aws_vpc" "app_vpc" {
  cidr_block = var.vpc_cidr

  tags = {
    Name = var.vpc_name
  }
}

# Security Group - allow SSH & HTTP
resource "aws_security_group" "app_sg" {
  name        = "cinesnap-sg"
  description = "Allow SSH and HTTP"
  vpc_id      = aws_vpc.app_vpc.id

    #   ingress {
    #     from_port   = 22
    #     to_port     = 22
    #     protocol    = "tcp"
    #     cidr_blocks = ["0.0.0.0/0"]
    #   }

    #   ingress {
    #     from_port   = 3000
    #     to_port     = 3000
    #     protocol    = "tcp"
    #     cidr_blocks = ["0.0.0.0/0"]
    #   }

  dynamic "ingress" {
    for_each = var.allowed_ingress
    content {
      from_port   = ingress.value.port
      to_port     = ingress.value.port
      protocol    = "tcp"
      cidr_blocks       = [for cidr in ingress.value.cidrs : cidr if can(regex("^([0-9]{1,3}\\.){3}[0-9]{1,3}/[0-9]+$", cidr))]
      ipv6_cidr_blocks  = [for cidr in ingress.value.cidrs : cidr if can(regex(":", cidr))]
    }
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }
}

# Internet Gateway
resource "aws_internet_gateway" "app_igw" {
  vpc_id = aws_vpc.app_vpc.id

  tags = {
    Name = var.igw_name
  }
}

# Route Table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.app_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.app_igw.id
  }

  tags = {
    Name = "PublicRouteTable"
  }
}

# Subnet
resource "aws_subnet" "app_subnet" {
  vpc_id     = aws_vpc.app_vpc.id
  cidr_block = var.subnet_cidr
  availability_zone       = var.subnet_az
  map_public_ip_on_launch = true

  tags = {
    Name = var.subnet_name
  }
}


# Route Table Association
resource "aws_route_table_association" "public_rt_assoc" {
  subnet_id      = aws_subnet.app_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

# EC2 Instance
resource "aws_instance" "app_instance" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.ec2_instance_type
  subnet_id                   = aws_subnet.app_subnet.id
  vpc_security_group_ids      = [aws_security_group.app_sg.id]
  associate_public_ip_address = true
  key_name                    = "CineSnapKey"

  user_data = file("${path.module}/deploy-config.sh")

  tags = {
    Name = var.ec2_name
  }
}
