io.on('connection', function (socket) {
    let coin
    let interval
    socket.on('coin', function (data) {
        if (data) {
            coin = data
            let asd = data.replace("KRW", "-KRW").split('-').reverse().join('-')
            console.log("asd : " + asd)
            setapi(asd)
            interval = setInterval(()=>callback(asd), 1000);
            socket.emit('setcoin', value)
            }
            socket.on('disconnect', function (zxc) {
                clearInterval(interval)
                console.log("종료" + data)
                // 클라이언트의 연결이 끊어졌을 경우 실행됨
           });
    })
    function callback(data) {
        console.log(data)
        Setapi.currentcoin(data).then(function(coinvalue){
            console.log(coinvalue.value)
            value = coinvalue.value
        })
        socket.emit('setcoin', value)
        /*
        request(options, function (error, response, body) {
            alloption = body
            let value = alloption.toString().split(',')[6].split(':')[1] //현재 시세 받아오는 곳
            socket.emit('setcoin', value)      
            return value
        });
        */
    }
});
/*
const WebSocket = require('ws')

let recvData = "";

function tradeServerConnect(codes) {
    let coin
    let ws = new WebSocket('wss://api.upbit.com/websocket/v1');
    ws.on('open', ()=>{
        console.log('trade websocket is connected')
        const str = `[{"ticket":"find"},{"type":"trade","codes":["${codes}"]}]`;
        ws.send(str);
    })  
    ws.on('close', ()=>{
        console.log('trade websocket is closed');
        setTimeout(function() {
            console.log('trade 재접속');
            tradeServerConnect(codes);
        }, 1000);
    })
    ws.on('disconnect',()=>{
        clearInterval(interval)
    })
    


    ws.on('message', (data)=>{
        try {
            let str = data.toString('utf-8')
            recvData = JSON.parse(str)
        } catch (e) {
            console.log(e)
        }
    })
}


async function start() {
	tradeServerConnect('KRW-BTC')
    function print()
    {
        console.log('recvData',recvData['trade_price']);
    }
    setInterval(print,5000);

}

start()
*/
