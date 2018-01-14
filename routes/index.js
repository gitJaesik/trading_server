var express = require('express');
var router = express.Router();
var https = require('https');
var http = require('http');
var request = require('request');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync(__dirname+'/config.json'));	//config.api.key

var requestLoop = setInterval(function(){
	request({
		url: "http://www.google.com",
		method: "GET",
		timeout: 1000*0.5,
		followRedirect: true,
		maxRedirects: 10
	},function(error, response, body){
		if(!error && response.statusCode == 200){
			console.log('sucess!');
		}else{
			console.log('error' + response.statusCode);
		}
	});
}, 1000*1);


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

/*
router.get('/bittrex', function(req, res, next) {
	http.get({
		hostname: 'localhost',
		port: 80,
		path: '/',
  		agent: false  // create a new agent just for this one request
		}, (res) => {
  		// Do stuff with response
	});
});
*/
/* GET BTC from bittrex */

router.get('/bittrex', function(req, res, next) {
	/*
	var options = {
		host: 'http://bittrex.com/api/v1.1/public/getmarkets',
		port: 80,
		path: '/',
		method: 'POST'
	};

	http.request(options, function(response) {
		console.log('STATUS: ' + response.statusCode);
		console.log('HEADERS: ' + JSON.stringify(response.headers));
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
		});
	}).end();
	*/

	const options = {
		hostname: 'bittrex.com', 
		port: 443,
		path: '/api/v1.1/public/getmarkets',
		method: 'GET'
	};

	var dataFromBittrex = "";
	const request = https.request(options, (response) => {
		console.log('statusCode:', response.statusCode);
		console.log('headers:', response.headers);
		response.on('data', (d) => {
			process.stdout.write(d);
			//dataFromBittrex += d;
		});
	});

	request.on('error', (e) => {
		console.error(e);
	});
	request.end();

	res.send(JSON.stringify(dataFromBittrex));
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
