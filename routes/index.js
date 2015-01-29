var express = require('express');
var router = express.Router();
var popitService = require('../service/popit.js')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/create', function(req, res) {
  
  var instanceName = req.body.name;
  var popitUrl = req.body.popitUrl;

  popitService.createAndUploadIntance(instanceName, popitUrl)
  	.then(function(){
		res.send('ok, created ' + req.body.name);
	}).catch(function(){
		res.send('error creating instance' + req.body.name);
	});

});

module.exports = router;
