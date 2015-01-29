var Toolkit = require('popit-toolkit');
var Q = require('q');

function createAndUploadIntance(instanceName, popitUrl){

	var deferred = Q.defer();

	toolkit = Toolkit({
		host: popitUrl
	});

	Q.all([
		toolkit.loadAllItems('persons'), 
		toolkit.loadAllItems('organizations'), 
		toolkit.loadAllItems('posts'), 
		toolkit.loadAllItems('memberships')
	
	]).spread(function(persons, organizations, posts, memberships){
		//
	}).catch(function(err){
		deferred.reject(err);
	});

	return deferred.promise;
}

module.exports = {
	createAndUploadIntance: createAndUploadIntance; 
};

