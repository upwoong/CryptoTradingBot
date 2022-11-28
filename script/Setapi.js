const request = require('request')
module.exports.setapi = function (value) {
    options = {
        method: 'GET',
        url: `https://api.upbit.com/v1/candles/minutes/1?market=${value}&count=28`,
        headers: { Accept: 'application/json' }
    };
}
module.exports.currentcoin = async function(coin){
    this.setapi(coin)
    let value = 0
    request(options, function (error, response, body) {
        alloption = body;
        value = alloption.toString().split(',')[6].split(':')[1]; //현재 시세 받아오는 곳
        return value
    })
    let asd = await resolveAfter2Seconds(value);
    return {
        value : value
    }
}



function resolveAfter2Seconds(value) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(value);
        }, 2000);
    });
}