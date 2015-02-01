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
  	.then(function(persons){
		res.send('ok, created ' + req.body.name);
	}).catch(function(){
		res.send('error creating instance' + req.body.name);
	});

});

router.get('/api/time', function(req, res){
	res.send({ status : counter});
});

setInterval(function(){
	counter += 1;
}, 1000);

module.exports = router;
