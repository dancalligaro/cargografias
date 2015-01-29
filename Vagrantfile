# -*- mode: ruby -*-
# vi: set ft=ruby :
 
# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"
 
Vagrant.configure("2") do |config|
    config.vm.box = "hashicorp/precise64"
    config.vm.box_url = "https://vagrantcloud.com/hashicorp/precise64/version/1.1.0/provider/virtualbox.box"
    config.vm.network :forwarded_port, host: 4001, guest: 4001
    config.vm.provision "shell", path: "install.sh"
    config.vm.provision "shell", path: "dev-tools-install.sh"
#    config.vm.synced_folder "./app", "/vagrant", id: "vagrant-root",
#        owner: "vagrant",
#        group: "www-data",
#        mount_options: ["dmode=775,fmode=664"]
    config.vm.provider "virtualbox" do |v|
        v.memory = 1024
        v.cpus = 2
        v.name = "cargografias"
    end
end