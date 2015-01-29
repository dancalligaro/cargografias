#!/bin/bash
 
# Vars
git="git"
vim="vim"
mongo="mongo"
node="node"
npm="npm"
pm2="pm2"
 
# Function to check if command available
# 0 = true (think of 0 as no errors)
# 1 = false (think of 1 as 1 error)
function isnotavailable() {
    if ! type "$1" > /dev/null;
    then
        return 0
    else
        return 1
    fi
}
 
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
sudo apt-get update
 
if isnotavailable "$vim"
then
	echo "--- Installing Vim + Utilities ---"
	sudo apt-get install vim python-software-properties g++ make build-essential -y
else
    echo -e "\xe2\x9c\x94 Vim already installed"
fi
 
if isnotavailable "$git"
then
	echo "--- Installing Git ---"
	sudo apt-get install git -y
else
    echo -e "\xe2\x9c\x94 Git already installed"
fi
 
if isnotavailable "$mongo"
then
	echo "--- Installing Mongo ---"
	echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
	sudo apt-get install mongodb-org -y
else
    echo -e "\xe2\x9c\x94 Mongo already installed"
fi
 
if isnotavailable "$node"
then
	echo "--- Installing Node ---"
	sudo apt-get install curl -y
	curl -sL https://deb.nodesource.com/setup | sudo bash -
	sudo apt-get install nodejs -y
else
    echo -e "\xe2\x9c\x94 Node already installed"
fi
 
if isnotavailable "$npm"
then
	echo "--- Installing NPM ---"
	sudo apt-get install npm -y
else
    echo -e "\xe2\x9c\x94 NPM already installed"
fi
 
if isnotavailable "$pm2"
then
	sudo npm install pm2 -g --unsafe-perm
else
    echo -e "\xe2\x9c\x94 PM2 already installed"
fi
 
pm2 startup ubuntu
sudo env PATH=$PATH:/usr/bin pm2 startup ubuntu -u vagrant
 
echo "*****  DONE ******"