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



/*
var params = {
    host: '127.0.0.1',
    port: 4000,
    method: 'GET',
    path: '/api/v1/service'
};
// this is a get, so there's no post data

httpRequest(params).then(function(body) {
    console.log(body);
});
*/

/*
httpRequest(params).then(function(body) {
    console.log(body);
    return httpRequest(otherParams);
}).then(function(body) {
    console.log(body);
    // and so on
});
*/


function notExported(){
	// ...
}

function bittrex() {
	const options = {
		hostname: 'bittrex.com', 
		port: 443,
		path: '/api/v1.1/public/getmarkets',
		method: 'GET'
	};

	const request = https.request(options, (response) => {
        var dataFromBittrex = "";
		// console.log('statusCode:', response.statusCode);
		// console.log('headers:', response.headers);
		response.on('data', (d) => {
			//process.stdout.write(d);
			dataFromBittrex += d;
		});

		response.on('end', ()=> {
            console.log(dataFromBittrex);
		})
	});

	request.on('error', (e) => {
		console.error(e);
	});
	request.end();
}

function bittrex2() {
    const options = {
        hostname: 'bittrex.com', 
        port: 443,
        path: '/api/v1.1/public/getmarkets',
        method: 'GET',
        timeout : 1000*1
    };

/*
    httpsRequest(options).then(function(data) {
        console.log("promise");
        // console.log(data);
        return data;
    }).catch(function (err) {
        console.log(err);
        return "";
    });
*/
    return httpsRequest(options);
}


function google() {
	// request({
	// 	url: "http://www.google.com",
	// 	method: "GET",
	// 	timeout: 1000*0.5,
	// 	followRedirect: true,
	// 	maxRedirects: 10
	// },function(error, response, body){
	// 	if(!error && response.statusCode == 200){
	// 		console.log('sucess!');
	// 	}else{
	// 		console.log('error' + response.statusCode);
	// 	}
	// });
	var params = {
		host: 'www.google.com',
		port: 80,
		method: 'GET',
		path: '/'
	};

	// httpRequest(params).then(function(body) {
	// 	console.log(body);
	// 	return httpRequest(otherParams);
	// }).then(function(body) {
	// 	console.log(body);
 //    // and so on
	// });

	httpRequest(params).then(function(data) {
		return data;
	}).catch(function (err) {
		console.log(err);
		return "";
	});
}

module.exports = { // 이 모듈은 이 객체를 노출합니다.
	bittrex : bittrex,
    bittrex2 : bittrex2,
	google : google
};