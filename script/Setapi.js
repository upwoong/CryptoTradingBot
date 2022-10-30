const request = require('request')
 let value = 0
module.exports.setapi = function (valuea) {
    options = {
        method: 'GET',
        url: `https://api.upbit.com/v1/candles/minutes/1?market=${valuea}&count=28`,
        headers: { Accept: 'application/json' }
    };
    request(options, function (error, response, body) {
        alloption = body
        value = alloption.toString().split(',')[6].split(':')[1] //현재 시세 받아오는 곳
    });
    return value
}