var Toolkit = require('popit-toolkit');
var Q = require('q');
var fs = require('fs');
var mongoose = require('mongoose');
require('dotenv').load();

if(!process.env.MONGO_DB_URL){
	throw "Missing process.env.MONGO_DB_URL";
}

mongoose.connect(process.env.MONGO_DB_URL);

var CargoInstance = mongoose.model('CargoInstances', { 
	name: String, 
	popitUrl: String, 
	status: String, 
	created: {
		type: Date, 
		default: Date.now
	}
});


var currentBuilds = {};

function createAndUploadIntance(instanceName, popitUrl){

	var deferred = Q.defer();

	CargoInstance.findOne({ name : instanceName }, function(err, cargoInstance){
		if(err){
			console.log('error querying for existing instances', err);		
			deferred.reject(err);
		}else{
			if(cargoInstance){
				console.log('instance already exists', instanceName)
				deferred.reject('instance already exists', instanceName);
			}else{

				var instanceData = { name: instanceName, popitUrl: popitUrl, status: 'creating' };
				var ci = new CargoInstance(instanceData);
				ci.save(function (err) {
				  if (err) {
				  	console.log('error saving new instance', instanceData);
				  	deferred.reject(err);
				  }else{
				  	console.log('created instance', ci._id);
				  	addToBuildQueue(ci);
				  	deferred.resolve(ci);
				  }
				});
			}
		}
	});

	return deferred.promise;
}

function getBuildStatus(instanceName){

	var deferred = Q.defer();
	
	if(currentBuilds[instanceName]){
		deferred.resolve(currentBuilds[instanceName].status)
	}else{
		deferred.resolve( CargoInstance.findOne({ name : instanceName }) );
	}

	return deferred.promise;	
}

function getAllInstances(){
	var deferred = Q.defer();
	deferred.resolve( CargoInstance.find() );
	return deferred.promise;		
}

function addToBuildQueue(cargoInstance){
	if(currentBuilds[cargoInstance.name]){
		console.log('error instance already scheduled for creation')
	}else{
		currentBuilds[cargoInstance.name] = cargoInstance;	

		/*

			toolkit = Toolkit({
				host: popitUrl + ".popit.mysociety.org"
			});

		 	Q.all([
		 		
				toolkit.loadAllItems('persons'), 
				toolkit.loadAllItems('organizations'),
				toolkit.loadAllItems('posts'), 
				toolkit.loadAllItems('memberships')
			
			]).spread(function(persons, organizations, posts, memberships){
				
				fs.writeFileSync('/vagrant/dump/persons.json', JSON.stringify(persons))
				fs.writeFileSync('/vagrant/dump/organizations.json', JSON.stringify(organizations))
				fs.writeFileSync('/vagrant/dump/posts.json', JSON.stringify(posts))
				fs.writeFileSync('/vagrant/dump/memberships.json', JSON.stringify(memberships))

				deferred.resolve();

			}).catch(function(err){
				deferred.reject(err);
			});


		*/

	}
}

module.exports = {
	createAndUploadIntance: createAndUploadIntance, 
	getAllInstances: getAllInstances
};
