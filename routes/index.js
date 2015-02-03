var express = require('express');
var router = express.Router();
var popitService = require('../service/popit.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/create', function(req, res) {
  
  var instanceName = req.body.name;
  var popitUrl = req.body.popitInstance;

  popitService.createAndUploadIntance(instanceName, popitUrl)
  	.then(function(instance){
		res.send({
			status: 'ok', 
			message: 'enqueued ' + req.body.name
		});
	}).catch(function(error){
		res.send({
			status: 'error', 
			message: 'error creating instance' + req.body.name + "\n" + error
		});
	});

});


router.get('/api/createstatus/:instancename', function(req, res){
	
	var instanceName = req.params.instancename;

	popitService.getBuildStatus(instanceName).then(function(status){
		res.send({
			status: 'ok', 
			message: status
		})
	})

});

router.get('/api/currentbuildstatus/:instancename', function(req, res){

	console.log(req.params, req.params.instancename);

	var instanceName = req.params.instancename;

	popitService.getInstanceProgress(instanceName).then(function(log){
		res.send({
			status: 'ok', 
			log: log
		});
	});

});

router.get('/api/instances', function(req,res){

	popitService.getAllInstances()
	.then(function(list){
		res.send(list);
		console.log(list);
	})
	.catch(function(error){
		res.send(error);
		console.log('error', error);
	})
});


module.exports = router;
