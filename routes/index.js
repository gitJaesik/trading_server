var express = require('express');
var router = express.Router();
// var fs = require('fs');
// var config = JSON.parse(fs.readFileSync(__dirname+'/config.json'));	//config.api.key

// run once
var coin_parser_mailer = require('./coin_parser_mailer');
coin_parser_mailer.coin_parser_mailer();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/bittrex', function(req, res, next) {

});


module.exports = router;
