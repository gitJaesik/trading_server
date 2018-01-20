var express = require('express');
var router = express.Router();
// var https = require('https');
// var http = require('http');
// var request = require('request');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync(__dirname+'/config.json'));	//config.api.key
var crawl_open = require('./open_api_exchanges'); // 상대 경로나 절대 경로로 모듈의 경로를 정확히 지정해야합니다. .js 확장자는 생략 할 수 있습니다.

var requestLoop = setInterval(function(){

	crawl_open.bittrex().then((data)=> {
		console.log(data);
	}).catch((err)=> {
		console.log(err);
	});


}, 1000*5);


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/bittrex', function(req, res, next) {

});


router.get('/mail', function(req, res, next) {

	var nodemailer = require('nodemailer');

	var transporter = nodemailer.createTransport({
		service: config.mailing.service,
		auth: {
			user: config.mailing.user,
			pass: config.mailing.pass
		}
	});

	var mailOptions = {
		from: config.mailing.user,
		to: config.mailing.to,
		subject: 'Sending Email using Node.js',
		text: 'That was easy!'
	};

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response);
		}
	});

});


module.exports = router;
