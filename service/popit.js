var Toolkit = require('popit-toolkit');
var Q = require('q');
var fs = require('fs');

function createAndUploadIntance(instanceName, popitUrl){

	var deferred = Q.defer();

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

	return deferred.promise;
}

module.exports = {
	createAndUploadIntance: createAndUploadIntance
};

