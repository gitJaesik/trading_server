var crawl_open = require('./open_api_exchanges'); // 상대 경로나 절대 경로로 모듈의 경로를 정확히 지정해야합니다. .js 확장자는 생략 할 수 있습니다.
var message_system = require('./send_message');
var models = require('../models/index');
const exchange_parser_config = require('../configs/exchange_parser_config.json');

// to make object array with exchange info
var fn_make_exchange_cache = function make_exchange_cache(exchange) {
	var obj = {};
	obj.hostname = exchange.url_info.hostname;
	obj.exchange = exchange.exchange_name;
	obj.parser_data = exchange.data;
	obj.fifo = [];
	obj.continuous = false;
	return obj;
};

function coin_parser_mailer() {

	var exchanges_cache = exchange_parser_config.exchanges.map(fn_make_exchange_cache);

	var fifo = [];
	var fifo2 = [];

	var seq = 0;

	var requestLoop = setInterval(function(){
		console.log(seq++);

		for (var k = 0; k < exchanges_cache.length; k++) {
			if (exchanges_cache[k].continuous == false || exchanges_cache[k].fifo.length != 2)
				continue;
			// todo
			var priceLogs = "";
			for (var i = 0; i < exchanges_cache[k].fifo[0].length; i++) {
				for (var j = 0; j < exchanges_cache[k].fifo[1].length; j++) {
					if (exchanges_cache[k].fifo[0][i][exchanges_cache[k].parser_data.MarketName] == exchanges_cache[k].fifo[1][j][exchanges_cache[k].parser_data.MarketName]) {
						var volumeIncrease = exchanges_cache[k].fifo[0][i][exchanges_cache[k].parser_data.BaseVolume] / exchanges_cache[k].fifo[1][j][exchanges_cache[k].parser_data.BaseVolume];
						var priceIncrease = exchanges_cache[k].fifo[0][i][exchanges_cache[k].parser_data.Last] / exchanges_cache[k].fifo[1][j][exchanges_cache[k].parser_data.Last];
						if (volumeIncrease > 1.01 || volumeIncrease < 0.99|| priceIncrease > 1.01 || priceIncrease < 0.99) {
							var priceLog = `${exchanges_cache[k].exchange} marketname : ${exchanges_cache[k].fifo[0][i][exchanges_cache[k].parser_data.MarketName]}, priceIncrease : ${priceIncrease}, volumeIncrease : ${volumeIncrease}, price : ${exchanges_cache[k].fifo[0][i][exchanges_cache[k].parser_data.Last]}, volume : ${exchanges_cache[k].fifo[0][i][exchanges_cache[k].parser_data.BaseVolume]}`;
							priceLogs += priceLog + '\n';

						}
						break;
					}
				}
			}
			if (priceLogs != "") {
				console.log(priceLogs);
				message_system.sendMailTo(priceLogs);
			}
			exchanges_cache[k].fifo.shift();
		}

		// if (fifo.length == 2) {	// remove 3 more memory
		// 	var priceLogs = "";
		// 	for (var i = 0; i < fifo[0].length; i++) {
		// 		for (var j = 0; j < fifo[1].length; j++) {
		// 			if (fifo[0][i].MarketName == fifo[1][j].MarketName) {
		// 				var volumeIncrease = fifo[0][i].BaseVolume / fifo[1][j].BaseVolume;
		// 				var priceIncrease = fifo[0][i].Last / fifo[1][j].Last;
		// 				if (volumeIncrease > 1.2 || volumeIncrease < 0.8|| priceIncrease > 1.05 || priceIncrease < 0.92) {
		// 					var priceLog = `bt marketname : ${fifo[0][i].MarketName}, priceIncrease : ${priceIncrease}, volumeIncrease : ${volumeIncrease}, price : ${fifo[0][i].Last}, volume : ${fifo[0][i].BaseVolume}`;
		// 					priceLogs += priceLog + '\n';

		// 				}
		// 				break;
		// 			}
		// 		}
		// 	}
		// 	if (priceLogs != "") {
		// 		console.log(priceLogs);
		// 		message_system.sendMailTo(priceLogs);
		// 	}
		// 	fifo.shift();
		// }

		// if (fifo2.length == 2) {	// remove 3 more memory
		// 	var priceLogs2 = "";
		// 	for (var i = 0; i < fifo2[0].length; i++) {
		// 		for (var j = 0; j < fifo2[1].length; j++) {
		// 			if (fifo2[0][i].symbol == fifo2[1][j].symbol) {
		// 				var volumeIncrease2 = fifo2[0][i].quoteVolume / fifo2[1][j].quoteVolume;
		// 				var priceIncrease2 = fifo2[0][i].lastPrice / fifo2[1][j].lastPrice;
		// 				if (volumeIncrease2 > 1.2 || volumeIncrease2 < 0.8 || priceIncrease2 > 1.05 || priceIncrease2 < 0.92) {
		// 					var priceLog2 = `bn marketname : ${fifo2[0][i].symbol}, priceIncrease : ${priceIncrease2}, volumeIncrease : ${volumeIncrease2}, price : ${fifo2[0][i].lastPrice}, volume : ${fifo2[0][i].quoteVolume}`;
		// 					priceLogs2 += priceLog2 + '\n';

		// 				}
		// 				break;
		// 			}
		// 		}
		// 	}
		// 	if (priceLogs2 != "") {
		// 		console.log(priceLogs2);
		// 		message_system.sendMailTo(priceLogs2);
		// 	}
		// 	fifo2.shift();
		// }

		// exchange_parser_config.exchanges.map(crawl_open.crawl_exchange) returns promise array.
		Promise.all(
			exchange_parser_config.exchanges.map(crawl_open.crawl_exchange)
			)
		.then((data)=> {
			// console.log(data);
// 	[ { hostname: 'bittrex.com',
//   data: { success: true, message: '', result: [Object] } },
// { hostname: 'www.binance.com',
//   data: 
//    [ [Object], ... ] }]

// "check" : { 
//       "hasCheck" : "yes",
//       "wrapper" : "object",
//       "success" : "success"
//     },

// [ { hostname: 'bittrex.com', exchange: 'bittrex', fifo: [] },
// { hostname: 'www.binance.com', exchange: 'binance', fifo: [] } ]
			for (var i = 0; i < data.length; ++i) {
				var j = i;
				if (exchange_parser_config.exchanges[j].url_info.hostname != data[i].hostname) {
					// @TODO : check for matching?
				} else {
					// do nothing. fall through probally
				}

				// in this point, exchange_parser_config.exchanges[i] should match with data[i]
				if (exchange_parser_config.exchanges[j].check.hasCheck == "yes") {
					if (exchange_parser_config.exchanges[j].check.success_value == data[i].data[exchange_parser_config.exchanges[j].check.success]) {
						exchanges_cache[j].fifo.push(data[i].data[exchange_parser_config.exchanges[j].check.datacommand]);
						exchanges_cache[j].continuous = true;
					} else {
						exchanges_cache[j].fifo.length = 0;
						exchanges_cache[j].continuous = false;
					}

				} else if (exchange_parser_config.exchanges[j].check.hasCheck == "no") {
					if (data[i].data && data[i].data !== 'null' && data[i].data !== 'undefined') {
						exchanges_cache[j].fifo.push(data[i].data);
						exchanges_cache[j].continuous = true;
					} else {
						exchanges_cache[j].fifo.length = 0;
						exchanges_cache[j].continuous = false;
					}
				}
			}
			console.log(exchanges_cache);

			// if (data[0].success == true) {
			// 	fifo.push(data[0].result);
			// }
			// if (data[1] && data[1] !== 'null' && data[1] !== 'undefined') {
			// 	fifo2.push(data[1]);
			// }
		})
		.catch((err)=> {
			console.log(err);
		});

	}, 1000*40);
}

module.exports = { // 이 모듈은 이 객체를 노출합니다.
	coin_parser_mailer : coin_parser_mailer
};
