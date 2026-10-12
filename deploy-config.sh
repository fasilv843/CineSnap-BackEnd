#!/bin/bash
set -e

# Log output
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

sudo apt-get update -y
sudo apt-get upgrade -y

#Install and configure Nginx
sudo apt-get install -y nginx

# Overwrite only the default site
cat > /etc/nginx/sites-available/default <<'EOF'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Test and restart nginx
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx


##* Installing Docker ####

# 1. Install prerequisites
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# 2. Add Docker GPG key
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg

# 3. Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
| tee /etc/apt/sources.list.d/docker.list > /dev/null

apt-get update -y

# 4. Install Docker & Compose plugin
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# 6. Enable & start Docker service
sudo systemctl enable docker
sudo systemctl start docker

#* Installation of NGINX and Docker is success

## TODO - Remaining Configurations
# Install git and clone project repo (for docker-compose.prod.yml)
# Login to github, for pulling image from Github Container Registry - Require credentials
# copy .env.production secrets to server (.env are not saved on github)
# Finally docker compose up -d


############################################################
# NOTE FOR FUTURE ME
#
# Stopped here because these steps and the remaining steps
# (cloning the repo, managing secrets, pulling
# images, and running docker-compose) are better
# handled with configuration management tools
# like **Ansible, Chef, or AWS SSM** in production.
#
#############################################################