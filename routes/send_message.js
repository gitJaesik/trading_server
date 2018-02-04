var nodemailer = require('nodemailer');
var fs = require('fs');
//var config = JSON.parse(fs.readFileSync(__dirname+'/config.json'));	//config.api.key
const config = require('../config');

function sendMailTo(content) {
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
		subject: 'Trading Server',
		text: content
	};

	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
			console.log(error);
		} else {
			//console.log('Email sent: ' + info.response);
		}
	});

}

module.exports = { // 이 모듈은 이 객체를 노출합니다.
	sendMailTo : sendMailTo
};