var https = require('https');
var http = require('http');
var request = require('request');


function httpRequest(params, postData) {
	return new Promise(function(resolve, reject) {
		var req = http.request(params, function(res) {
            // reject on bad status
            if (res.statusCode < 200 || res.statusCode >= 300) {
            	return reject(new Error('statusCode=' + res.statusCode));
            }
            // cumulate data
            var body = [];
            res.on('data', function(chunk) {
            	body.push(chunk);
            });
            // resolve on end
            res.on('end', function() {
            	try {
            		// console.log(body);
            		body = JSON.parse(Buffer.concat(body).toString());
            	} catch(e) {
            		reject(e);
            	}
            	resolve(body);
            });
        });
        // reject on request error
        req.on('error', function(err) {
            // This is not a "Second reject", just a different sort of failure
            reject(err);
        });
        if (postData) {
        	req.write(postData);
        }
        // IMPORTANT
        req.end();
    });
}


function httpsRequest(params, postData) {
    return new Promise(function(resolve, reject) {
        var req = https.request(params, function(res) {
            // reject on bad status
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            // cumulate data
            var body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            // resolve on end
            res.on('end', function() {
                // console.log("end");
                // console.log(body);
                try {
                    // console.log(body);
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch(e) {
                    reject(e);
                }
                //console.log(body);
                resolve(body);
            });
        });
        // reject on request error
        req.on('error', function(err) {
            // This is not a "Second reject", just a different sort of failure
            reject(err);
        });
        if (postData) {
            req.write(postData);
        }
        // IMPORTANT
        req.end();
    });
}

function notExported(){
	// ...
}

function crawl_exchange(exchange) {
    // below option @TODO : timeout setting change
    const options = {
        hostname: exchange.url_info.hostname, 
        port: exchange.url_info.port,
        path: exchange.url_info.path,
        method: exchange.url_info.method,
        timeout : 1000*1.5
    };

    return httpsRequest(options);
}


function bittrex() {
    // path: '/api/v1.1/public/getmarkets',
    const options = {
        hostname: 'bittrex.com', 
        port: 443,
        path: '/api/v1.1/public/getmarketsummaries',
        method: 'GET',
        timeout : 1000*1.5
    };

    return httpsRequest(options);
}

function binance() {
    // path: '/api/v1.1/public/getmarkets',
    const options = {
        hostname: 'www.binance.com', 
        port: 443,
        path: '/api/v1/ticker/24hr',
        method: 'GET',
        timeout : 1000*1.5
    };

    return httpsRequest(options);
}



function google() {

	var params = {
		host: 'www.google.com',
		port: 80,
		method: 'GET',
		path: '/'
	};

	httpRequest(params).then(function(data) {
		return data;
	}).catch(function (err) {
		console.log(err);
		return "";
	});
}

module.exports = { // 이 모듈은 이 객체를 노출합니다.
    crawl_exchange : crawl_exchange,
	bittrex : bittrex,
    binance : binance,
	google : google
};