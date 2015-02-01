var express = require('express');
var router = express.Router();
var popitService = require('../service/popit.js')

var counter = 0;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/create', function(req, res) {
  
  var instanceName = req.body.name;
  var popitUrl = req.body.popitInstance;

  popitService.createAndUploadIntance(instanceName, popitUrl)
  	.then(function(instance){
		res.send('ok, created ' + req.body.name);
	}).catch(function(error){
		res.send('error creating instance' + req.body.name + "\n" + error);
	});

});


router.get('/api/createstatus/:instancename', function(req, res){

	req.params.instancename;
	//holis

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

router.get('/api/time', function(req, res){
	res.send({ status : counter});
});

setInterval(function(){
	counter += 1;
}, 1000);

module.exports = router;
