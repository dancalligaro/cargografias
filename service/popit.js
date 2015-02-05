var Q = require('q');
var fs = require('fs');
var mongoose = require('mongoose');
var ssh2 = require('ssh2');
var zlib = require('zlib');
var request = require('request');

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
var buildQueue = [];
var currentProcessing = null;

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

function getInstanceProgress(instanceName){
	var deferred = Q.defer();

	console.log( 'here ', instanceName, currentBuilds[instanceName])

	if(currentBuilds[instanceName]){
		console.log('resolving')
		deferred.resolve( {
			log: currentBuilds[instanceName].progressLog, 
			status: currentBuilds[instanceName].status
		} );
	}else{
		console.log('empty')
		deferred.resolve();
	}

	return deferred.promise;
}

function getAllInstances(){
	var deferred = Q.defer();
	deferred.resolve( CargoInstance.find() );
	return deferred.promise;		
}

function getQueue(){
	return buildQueue;
}

function addToBuildQueue(cargoInstance){
	
	if(currentBuilds[cargoInstance.name]){
		
		console.log('error instance already scheduled')
	
	}else{

		currentBuilds[cargoInstance.name] = cargoInstance;	
		buildQueue.push(cargoInstance);	
		processNext();

	}
}

function processNext(){

	console.log('queue length', buildQueue.length)

	if(!currentProcessing){
		currentProcessing = buildQueue.shift();
		if(currentProcessing){
			processInstance(currentProcessing)
				.then(function(){
					currentProcessing.status = 'completed';
					console.log('here it completed - setting status to completed', currentProcessing.status, currentProcessing);
				})
				.catch(function(){

				})
				.finally(function(){
					console.log('checking if there is a new one')
					
					currentProcessing = null;
					setTimeout(processNext, 100);
				});			
		}else{
			console.log('nothing else to process')
		}
	}

}

function processInstance(instance){

	console.log('processing instance', instance.name)

	var deferred = Q.defer();
	var persons, organizations, posts, memberships;

	instance.progressLog = [];
	instance.progressLog.push('Loading Persons...')

	var url = 'http://' + instance.popitUrl + '.popit.mysociety.org/api/v0.1/export.json';

	request(url, function (error, response, body) {
		
		if( error ){
			console.log('error requesting file', url);
			instance.progressLog.push('error requesting file ' + url);
			deferred.reject({error: error});
		}else{
			if ( response.statusCode == 200 ){
				uploadFilesToServer(instance.name, body).progress(function(msg){
					instance.progressLog.push(msg);
				}).then(function(){
					deferred.resolve();
				}).catch(function(){
					deferred.reject('error uploading file');
				});
			} else if (response.statusCode == 404 ){
				console.log('404 not found', url);
				instance.progressLog.push('404 not found ' + url);
				deferred.reject({ code: response.statusCode, error: error});
			} else {
				console.log('error requesting file', url);
				instance.progressLog.push('error requesting file ' + url);
				deferred.reject({ code: response.statusCode, error: error});
			}
		}

	})

	return deferred.promise;

}

function uploadFilesToServer(instanceName, data){
	
	var deferred = Q.defer();
	var conn = new ssh2();
	var files = [
		{name: 'data.json', file: data}
	];

	conn.on(
	    'connect',
	    function () {
	        console.log( "- connected" );
	        deferred.notify('SSH connected')
	    }
	);
	 
	conn.on(
	    'ready',
	    function () {
	        console.log( "- ready" );
	 
	        conn.sftp(
	            function (err, sftp) {

	                if ( err ) {
	                    console.log( "Error, problem starting SFTP: %s", err );
	                    deferred.reject("Error, problem starting SFTP: %s", err)
	                }else{

		 	            console.log( "- SFTP started" );
		 	            deferred.notify("SFTP started");
		 
		                function uploadFile(file){
	
							zlib.gzip( file.file, function (error, result) {
								
								if(error){
									console.log('- error gzipping file', file.name)
									deferred.notify('- error gzipping file', file.name)
								}else{

					                var destinationPath = process.env.SSH_BASE_UPLOAD_PATH + "/" + instanceName + "-" + file.name
					                var writeStream = sftp.createWriteStream( destinationPath );

									console.log('uploading file ', file.name)
									console.log('uploading to ', destinationPath);

					                writeStream.write(result, function(){

				                    	deferred.notify('upload complete ' + file.name)
				                        console.log( "- file transferred " + file.name );
				                        
					                	if(files.length > 0){
					                		setTimeout(function(){
					                			uploadFile(files.shift());
					                		},1)
					                	}else{
					                		console.log('resolving deferred uploding files')
					                		deferred.notify('everything uploaded');
					                		deferred.resolve();
					                		sftp.end();
					                	}

					                });

								}
							});

		                }

		                uploadFile(files.shift());

	                }
	            }
	        );
	    }
	);
	 
	conn.on(
	    'error',
	    function (err) {
	        console.log( "- connection error: %s", err );
	    }
	);
	 
	conn.on(
	    'end',
	    function () {
	        
	    }
	);

	conn.connect(
	    {
	        "host": process.env.SSH_HOST,
	        "port": 22,
	        "username": process.env.SSH_USER,
	        "password": process.env.SSH_PASSWORD
	    }
	);

	return deferred.promise;
};


//Testing upload to server;

/*
	uploadFilesToServer('juanita', "['a', 'b']", "['a', 'b']", "['a', 'b']", "['a', 'b']").then(function(){
		console.log("=====================================");
		uploadFilesToServer('papapapa', "['a', 'b']", "['a', 'b']", "['a', 'b']", "['a', 'b']")
	})
*/


// // TEsting create a random intsance
// createAndUploadIntance("holaquetal" + (+ new Date()), "cargograssfias");

// // Testing enqueing
// setTimeout(function(){
// 	createAndUploadIntance("lalala" + (+ new Date()), "cargografias");
// }, 500);

// setTimeout(function(){
// 	createAndUploadIntance("lalala" + (+ new Date()), "cargografias");
// }, 1000);

//createAndUploadIntance("lalala" + (+ new Date()), "cargografias");


module.exports = {
	createAndUploadIntance: createAndUploadIntance, 
	getAllInstances: getAllInstances, 
	getInstanceProgress: getInstanceProgress
};


