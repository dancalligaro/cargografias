var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/create', function(req, res) {
  res.send('ok, created ' + req.body.name);
});

module.exports = router;
