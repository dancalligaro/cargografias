#!/bin/bash
 
# Vars
grunt="grunt"
ruby="ruby"
gem="gem"
sass="sass"
nodemon="nodemon"
 
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
 
cd /vagrant/
 
# Grunt
if isnotavailable "$grunt"
then
    echo "--- Installing Grunt CLI version ---"
    sudo npm install -g grunt-cli
else
    echo -e "\xe2\x9c\x94 Grunt already installed"
fi
 
if isnotavailable "$ruby"
then
    echo "--- Installing Ruby ---"
    sudo apt-get install ruby-full rubygems -y
else
    echo -e "\xe2\x9c\x94 Ruby already installed"
fi
 
if isnotavailable "$gem"
then
    echo "--- Installing Ruby Gem ---"
    sudo apt-get install libgemplugin-ruby -y
else
    echo -e "\xe2\x9c\x94 Ruby Gem already installed"
fi
 
if isnotavailable "$sass"
then
    echo "--- Installing Sass ---"
    sudo apt-get install ruby-sass -y
else
    echo -e "\xe2\x9c\x94 Sass already installed"
fi
 
# Grunt
if isnotavailable "$nodemon"
then
    echo "--- Installing Nodemon ---"
    sudo npm install -g nodemon
else
    echo -e "\xe2\x9c\x94 Nodemon already installed"
fi
 
echo "--- READY ---"

 
echo "cd /vagrant" >> /home/vagrant/.bashrc