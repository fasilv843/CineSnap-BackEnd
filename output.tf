output "instance_id" {
  description = "ID of the EC2 Instance"
  value = aws_instance.app_instance.id
}

output "instance_public_ip" {
  description = "Public IP address of EC2 Instance"
  value = aws_instance.app_instance.public_ip
}

output "instance_public_dns" {
  description = "Public DNS of the EC2 instance"
  value       = aws_instance.app_instance.public_dns
}

output "security_group_id" {
  description = "ID of the Security Group"
  value       = aws_security_group.app_sg.id
}

output "ami_id" {
  description = "AMI ID used for EC2"
  value       = data.aws_ami.ubuntu.id
}

output "vpc_id" {
  value = aws_vpc.app_vpc.id
}

output "subnet_id" {
  value = aws_subnet.app_subnet.id
}