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
console.log(exchange_parser_config.exchanges);

var map_var = exchange_parser_config.exchanges.map(fn2);

console.log(map_var[0][0]);
