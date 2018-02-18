const config = require('../config.json');
// console.log(config);

const exchange_parser_config = require('../configs/exchange_parser_config.json');
// console.log(exchange_parser_config);
// console.log(exchange_parser_config.exchanges);
// console.log(exchange_parser_config.exchanges.length);

// for (var i = 0; i < exchange_parser_config.exchanges.length; i++) {
// 	console.log(exchange_parser_config.exchanges[i]);
// }

// console.log(exchange_parser_config.exchanges);

var fn = function asyncMultiplyBy2(v){ // sample async action
    return new Promise(resolve => setTimeout(() => resolve(v * 2), 100));
};

var fn2 = function plusone(v) {
	return v+1;
};

// console.log(exchange_parser_config.exchanges);

var map_var = exchange_parser_config.exchanges.map(fn2);

// console.log(map_var[0][0]);

// make exchange cache array
var fn_make_exchange_cache = function make_exchange_cache(exchange) {
	var obj = {};
	obj.hostname = exchange.url_info.hostname;
	obj.exchange = exchange.exchange_name;
	obj.fifo = [];
	return obj;
};
var exchanges_cache = exchange_parser_config.exchanges.map(fn_make_exchange_cache);
console.log(exchanges_cache);
var hostname_str = 'hostname';
console.log(exchanges_cache[0].hostname);
console.log(exchanges_cache[0][hostname_str]);
console.log(exchanges_cache[0]['hostname']);

// data는 array이지만 obj이어야 한다.
// 지금 데이터는 2d array, 1d는 seq, 2d는 data가 담당하고 있다.
// todo는 1d array이며, array이의 내용은 obj, obj안에 이름과 data파트가 있고, data part는 seq가 되어야 한다.

