variable "aws_profile" {
    description = "AWS Profile"
    type = string
    default = "default"
}

variable "aws_region" {
    description = "Region to deploy AWS Infrastructure"
    type = string
    default = "ap-south-1"
}

variable "ec2_name" {
  description = "Value of the Name for the EC2 Instance"
  type        = string
  default     = "CineSnap Server"
}

variable "ec2_instance_type" {
  description = "EC2 Instance Type"
  type        = string
  default     = "t2.micro"
}

# variable "allowed_ports" {
#   type    = list(number)
#   default = [22, 3000]
# }

# variable "allowed_cidr" {
#   type    = list(string)
#   default = ["0.0.0.0/0"]
# }

variable "allowed_ingress" {
  type = list(object({
    port  = number
    cidrs = list(string)
  }))

  default = [
    { port = 22,   cidrs = ["0.0.0.0/0"] },   # SSH allowed only from VPC
    { port = 3000, cidrs = ["0.0.0.0/0"] },     # App port open to the world
    { port = 80, cidrs = ["0.0.0.0/0", "::/0"] },
  ]
}

variable "vpc_cidr" {
  description = "Value of the CIDR range for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "vpc_name" {
  description = "Value of the name for the VPC"
  type        = string
  default     = "CineSnap VPC"
}

variable "subnet_cidr" {
  description = "Value of the subnet CIDR for the VPC"
  type        = string
  default     = "10.0.1.0/24"
}

variable "subnet_name" {
  description = "Value of the subnet name for the VPC"
  type        = string
  default     = "CineSnap Subnet"
}

variable "igw_name" {
  description = "Value of the Internet Gateway for the VPC"
  type        = string
  default     = "CineSnap Internet Gateway"
}

variable "subnet_az" {
  description = "Availability Zone for the subnet"
  type        = string
  default     = "ap-south-1a"
}