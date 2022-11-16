const request = require('request')
module.exports.setapi = function (value) {
    options = {
        method: 'GET',
        url: `https://api.upbit.com/v1/candles/minutes/1?market=${value}&count=28`,
        headers: { Accept: 'application/json' }
    };
}