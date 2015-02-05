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

router.get('/api/currentbuildstatus/:instancename', function(req, res){

	var instanceName = req.params.instancename;

	popitService.getInstanceProgress(instanceName).then(function(info){

		if(info){
			res.send({
				status: 'ok', 
				importStatus: info.status,
				log: info.log
			});			
		}else{
			res.send({
				status: 'error', 
				message: 'no data for instance'
			});
		}

	});

});

router.get('/api/instances', function(req,res){

	popitService.getAllInstances()
	.then(function(list){
		res.send(list);
	})
	.catch(function(error){
		res.send(error);
	})
});


module.exports = router;
