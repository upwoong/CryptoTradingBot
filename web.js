const express = require('express')
    , path = require('path')
const expressHandlebars = require('express-handlebars')
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const request = require('request');
const http = require("https");
var fs = require('fs');
let server = require('http').createServer(app);
let io = require('socket.io')(server)
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
app.use(cors({
    origin: true,
    credentials: true
}))
process.setMaxListeners(15);
const { constants } = require('http2');
const { response } = require('express')
app.use(cookieParser())
app.use(
    session({
        key: "logindata",
        secret: "secretuser",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: (3.6e+6) * 24
        },
    })
)

const port = process.env.PORT || 8006
app.engine('handlebars', expressHandlebars.engine({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}))
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))
app.set('views', __dirname + '/views')
let router = express.Router()
app.use('/', router)
const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid/v4");
const { Socket } = require('socket.io');

const payload = {
    access_key: "Foj5SxotcvxxVVEvHOAaxZ8NJya2pJmFd4sWLO4ky",
    nonce: uuidv4(),
};
let bbb = ""
const jwtToken = jwt.sign(payload, "wDSyn3uhGxbqSUK3neR5hzLnX8TrI7dcUKW6pJaL");
const authorizationToken = `Bearer ${jwtToken}`;

const mongo = require("./script/mongo")
const Sellcoin = require("./script/Sellcoin")
//mongoose.set('useFindAndModify', false); //fineOneandupdate 사용하기 위한 구문 지금버전에선 필요없다함 삭제
let options = {
    method: 'GET',
    url: 'https://api.upbit.com/v1/candles/minutes/1?market=KRW-BTC&count=28',
    headers: { Accept: 'application/json' }
};

init() //초기설정
let market = new Array()
let krname = new Array()
function init() {

    const whdahr = {
        method: 'GET',
        url: 'https://api.upbit.com/v1/market/all?isDetails=false',
        headers: { Accept: 'application/json' }
    };
    //.replace(/\-/g,'')  -제거
    request(whdahr, function (error, response, body) {
        if (error) throw new Error(error);
        let obj = JSON.parse(body)

        for (let i = 0; i < obj.length; i++) {
            if (obj[i].market.toString().includes('KRW')) {
                let replace = obj[i].market.split('-').reverse().join(',').replace(',', '')
                market.push(replace)
                krname.push(obj[i].korean_name)
            }
        }
    });
}
function setapi(valuea) {
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

let alloption = "" // 코인의 모든 정보
let value = "" //현재 가격
let mybuyaver = 40000000 //평균매수가격
let mypl = 0 //현재 손익
let myQuantity = 3 //현재 코인수량
function intervalFunc() {
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        alloption = body
        value = alloption.toString().split(',')[6].split(':')[1] //현재 시세 받아오는 곳
        mypl = (value - mybuyaver) * myQuantity //현재 손익 계산
        console.log(value)
        io.emit('currentv', value)
        return value
    });
}
/*
자동매매함수 만드는 방안1
1. 자동매매 버튼 실행시 자동매매 코드가 들어있는 함수를 파일로 만듬 ex) 닉네임123사용자가 버튼 클릭시 function123.js 파일 생성
2. setinterval(function123)을 계속 실행
3. 종료하고 싶을 때, 파일 삭제
*/
//setInterval(asd1("Adw"),1000)
//setInterval(function() { fun.func123("myURl") }, 1000);
//fun.func123("hello")
async function currentcoin() {
    request(options, function (error, response, body) {
        alloption = body;
        value = alloption.toString().split(',')[6].split(':')[1]; //현재 시세 받아오는 곳
        return value
    })
    console.log(value)
    return value
}
/*
async function funfs(nickname,age){
    fs.writeFile(`./${nickname}.js`,"exports.func123 = function(say)\n\{   setInterval(console.log(say), 500,function(error){console.log(error)})}",'utf-8',function(error){
        console.log("success")
    });
    let req = await fetchAge(nickname)
    req.func123(age)
}
funfs("upwoong","hello")
function setreq(nickname){
    const nicka = require(`./${nickname}`)
    return nicka
}
function setTimeoutPromise(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), ms);
    });
  }
async function fetchAge(id) {
    await setTimeoutPromise(1000);
    const nicka = require(`./${id}`)
    return nicka
  }
*/




console.log("aaaaaaaaaaaaaaa")
/**
 * 1. web.js에서 코인값 받기
 * 
 * 2. 스크립트 파일에서 코인값 받기
 * 
 * 스크립트 안에서 데이터베이스 불러와서 저장(처리 가능)
 */
let getjs = ''
app.post('/startm', function (req, res) {
    let pay = req.body.pay
    let name = req.body.name

    async function funfs(nickname, age) {
        console.log("실행중")
        try {
            let req = await fetchAge(name)
            setapi(pay)
            console.log("3")
            getjs = require(`/home/hosting_users/solverduo/apps/solverduo_solverduo/macrofolder/${name}`)
            getjs.func123(pay, name) //이걸 못찾는데요
            console.log("..........")
            console.log(getjs)
        }
        catch (err) {
            console.log(err)
        }
    }
    funfs(name, pay)
    function setTimeoutPromise(ms) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), ms);
        });
    }
    async function fetchAge(id) {
        fs.writeFile(`/home/hosting_users/solverduo/apps/solverduo_solverduo/macrofolder/${name}.js`, `let getjs = require('../script/getRSI')
        const request = require('request')
        const mongo = require("../script/mongo")
        const Setapi = require("../script/Setapi")
        module.exports.boolean = false
        
        /**
         * 해야할거 : 
         * 매수 및 매도할때 얼만큼 매수,매도 할건지
         * 자동 매수할때 돈이 없으면 어떻게 반환처리 할 것인지.
         * 매도할때 일정개수 이하면 전량매도 함수 구현
         * 
         */
        let coinvalue = 1
        let selectcoin = "KRW-BTC"
        let coinquantity = 1
        module.exports.func123 = function(say,name){
            let startmacro = setInterval(function () {
                if(!module.exports.boolean){ //stop and macro
                    Setapi.setapi(say)
                request(options, function (error, response, body) {
                    mongo.Userwallet.findOne({ Username: name }, (err, users) => {
                        mongo.Usertransaction.findOne({ Username: name }, (err, acc) => {
                            console.log(getjs.getRSI(body).RSI)
                            if (getjs.getRSI(body).RSI < 35) {
                                console.log(getjs.getRSI(body).RSI)
                                if (users.buycooltime == "true") {
                                    users.buycooltime = "false"
                                    setTimeout(() => changef(name), 10000);
                                    if (users.Money > coinvalue * coinquantity) {
                                        for (let i = 0; i < users.Holdcoin.length; i++) {
                                            if (users.Holdcoin[i].coinname == selectcoin) {//구매한 코인이 지갑에 있다면
                                                users.Holdcoin[i].coinbuyprice =
                                                    (users.Holdcoin[i].coinquantity * users.Holdcoin[i].coinbuyprice
                                                        + coinquantity * coinvalue) / (users.Holdcoin[i].coinquantity + coinquantity)
                                                console.log(users.Holdcoin[i].coinbuyprice)
                                                users.Holdcoin[i].coinquantity += coinquantity
                                                state = false
                                            }
                                        }
                                        if (state) {
                                            let object = new Object
                                            object.coinname = selectcoin
                                            object.coinquantity = coinquantity
                                            object.coinbuyprice = coinvalue
                                            users.Holdcoin.push(object)
                                        }
                                        let objtra = new mongo.pushtransaction("매수", selectcoin, coinquantity, coinvalue)
                                        acc.transaction.push(objtra)
                                        users.Money -= coinvalue * coinquantity
                                        users.save(function (err) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }
                                        })
                                        acc.save(function (err) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }
                                        })
        
                                    }
        
                                    console.log("매수 완료")
                                }
                            } else if (getjs.getRSI(body).RSI > 65) {
                                if (users.buycooltime == "true") {
                                    users.buycooltime = "false"
                                    setTimeout(() => changef(name), 10000);
                                    users.Money += coinquantity
                                    for (let i = 0; i < users.Holdcoin.length; i++) {
                                        if (users.Holdcoin[i].coinname == selectcoin) {
                                            if (users.Holdcoin[i].coinquantity >= coinquantity) {
                                                users.Holdcoin[i].coinbuyprice =
                                                    (users.Holdcoin[i].coinquantity * users.Holdcoin[i].coinbuyprice
                                                        + coinvalue * (coinquantity * -1)) / (users.Holdcoin[i].coinquantity + (coinquantity * -1))
                                                users.Holdcoin[i].coinquantity -= coinquantity
                                                if (users.Holdcoin[i].coinquantity <= 0) {
                                                    users.Holdcoin.splice(i, 1)
                                                }
                                            }
                                            else {
                                                console.log("aaaa")
                                            }
                                        }
                                    }
                                    let objtra = new mongo.pushtransaction("매도", selectcoin, coinquantity, coinvalue)
                                    acc.transaction.push(objtra)
                                    users.save(function (err) {
                                        if (err) {
                                            console.error(err);
                                            return;
                                        }
                                    })
                                    acc.save(function (err) {
                                        if (err) {
                                            console.error(err);
                                            return;
                                        }
                                    })
                                    console.log("매도 완료")
                                }
                            }
                        })
                    })
        
                })
                } else {
                    clearInterval(startmacro)
                }
                
            }, 1000);
        }
            
        function changef(name) {
            mongo.Userwallet.findOne({ Username: name }, (err, users) => {
                users.buycooltime = "true"
                users.save(function (err) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                })
            })
            console.log("완료")
        }
        
        
        `, 'utf-8', function (error) {
            console.log("success")
        });
        console.log("1")
        await setTimeoutPromise(6000);
        console.log("2")
    }
    res.redirect('Rsi')
})

fs.writeFile(`/home/hosting_users/solverduo/apps/solverduo_solverduo/macrofolder/zxc.js`, `let getjs = require('../script/getRSI')
        const request = require('request')
        const mongo = require("../script/mongo")
        const Setapi = require("../script/Setapi")
        module.exports.boolean = false
        
        /**
         * 해야할거 : 
         * 매수 및 매도할때 얼만큼 매수,매도 할건지
         * 자동 매수할때 돈이 없으면 어떻게 반환처리 할 것인지.
         * 매도할때 일정개수 이하면 전량매도 함수 구현
         * 
         */
        let coinvalue = 1
        let selectcoin = "KRW-BTC"
        let coinquantity = 1
        module.exports.func123 = function(say,name){
            let startmacro = setInterval(function () {
                if(!module.exports.boolean){ //stop and start
                    Setapi.setapi(say)
                request(options, function (error, response, body) {
                    mongo.Userwallet.findOne({ Username: "aaa" }, (err, users) => {
                        mongo.Usertransaction.findOne({ Username: "aaa" }, (err, acc) => {
                            console.log(getjs.getRSI(body).RSI)
                            if (getjs.getRSI(body).RSI < 35) {
                                console.log(getjs.getRSI(body).RSI)
                                if (users.buycooltime == "true") {
                                    users.buycooltime = "false"
                                    setTimeout(() => changef(), 10000);
                                    if (users.Money > coinvalue * coinquantity) {
                                        for (let i = 0; i < users.Holdcoin.length; i++) {
                                            if (users.Holdcoin[i].coinname == selectcoin) {//구매한 코인이 지갑에 있다면
                                                users.Holdcoin[i].coinbuyprice =
                                                    (users.Holdcoin[i].coinquantity * users.Holdcoin[i].coinbuyprice
                                                        + coinquantity * coinvalue) / (users.Holdcoin[i].coinquantity + coinquantity)
                                                console.log(users.Holdcoin[i].coinbuyprice)
                                                users.Holdcoin[i].coinquantity += coinquantity
                                                state = false
                                            }
                                        }
                                        if (state) {
                                            let object = new Object
                                            object.coinname = selectcoin
                                            object.coinquantity = coinquantity
                                            object.coinbuyprice = coinvalue
                                            users.Holdcoin.push(object)
                                        }
                                        let objtra = new mongo.pushtransaction("매수", selectcoin, coinquantity, coinvalue)
                                        acc.transaction.push(objtra)
                                        users.Money -= coinvalue * coinquantity
                                        users.save(function (err) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }
                                        })
                                        acc.save(function (err) {
                                            if (err) {
                                                console.error(err);
                                                return;
                                            }
                                        })
        
                                    }
        
                                    console.log("매수 완료")
                                }
                            } else if (getjs.getRSI(body).RSI > 65) {
                                if (users.buycooltime == "true") {
                                    users.buycooltime = "false"
                                    setTimeout(() => changef(), 10000);
                                    users.Money += coinquantity
                                    for (let i = 0; i < users.Holdcoin.length; i++) {
                                        if (users.Holdcoin[i].coinname == selectcoin) {
                                            if (users.Holdcoin[i].coinquantity >= coinquantity) {
                                                users.Holdcoin[i].coinbuyprice =
                                                    (users.Holdcoin[i].coinquantity * users.Holdcoin[i].coinbuyprice
                                                        + coinvalue * (coinquantity * -1)) / (users.Holdcoin[i].coinquantity + (coinquantity * -1))
                                                users.Holdcoin[i].coinquantity -= coinquantity
                                                if (users.Holdcoin[i].coinquantity <= 0) {
                                                    users.Holdcoin.splice(i, 1)
                                                }
                                            }
                                            else {
                                                console.log("aaaa")
                                            }
                                        }
                                    }
                                    let objtra = new mongo.pushtransaction("매도", selectcoin, coinquantity, coinvalue)
                                    acc.transaction.push(objtra)
                                    users.save(function (err) {
                                        if (err) {
                                            console.error(err);
                                            return;
                                        }
                                    })
                                    acc.save(function (err) {
                                        if (err) {
                                            console.error(err);
                                            return;
                                        }
                                    })
                                    console.log("매도 완료")
                                }
                            }
                        })
                    })
        
                })
                } else {
                    clearInterval(startmacro)
                }
                
            }, 1000);
        }
            
        function changef() {
            mongo.Userwallet.findOne({ Username: "aaa" }, (err, users) => {
                users.buycooltime = "true"
                users.save(function (err) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                })
            })
            console.log("완료")
        }
        
        
        `, 'utf-8', function (error) {
            console.log("success")
        });



app.post('/stopm', function (req, res) {
    let name = req.body.name
    console.log("-------")
    let agetjs = require('/home/hosting_users/solverduo/apps/solverduo_solverduo/macrofolder/upwoong.js')
    console.log(agetjs)
    console.log("aasd : " + agetjs.func123)
    let stopmacro = require(`/home/hosting_users/solverduo/apps/solverduo_solverduo/macrofolder/${name}.js`)
    stopmacro.boolean = true
    fs.unlink(`/home/hosting_users/solverduo/apps/solverduo_solverduo/macrofolder/${name}.js`, (err) => {
        console.log("delete")
    })
    res.redirect('Rsi')
})

function RSIFunc() {
    let aaaa = 0
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        aaaa = getcurrentRSI(body)
        console.log(aaaa)
        mongo.Usermacrocooltime.find(function (err, data) {
            if (aaaa < 60 && data[0].status == "true") { //상태가 true면 구매실행 이후 상태 false로 변환
                mongo.Usermacrocooltime.findOneAndUpdate({}, { $set: { 'status': "false" } }, (err, data) => {
                    if (err) console.log(err)
                    else console.log("저장완료")
                })
                console.log("특정 이하")
                buyFnc() //종목 매수
            }
        })

    });
}

//setInterval(RSIFunc, 500); //0.5초마다 시세 받는 함수 실행
function buyFnc() { //종목 매수 함수 + 쿨타임 넣기
    setTimeout(cooltime, 43200000) //12시간 후에 다시 구매 가능
}
function cooltime() {
    //데이터베이스에서 false 를 true로 바꾸는 문장
}
function getcurrentRSI(body) { //RSI구하는 함수
    let arraybody = ""
    let arraycp = new Array()
    let arraydp = new Array()
    let plusarray = new Array()
    let minusarray = new Array()
    let firstplusav = 0.0
    let firstminusav = 0.0
    let AU = new Array()
    let AD = new Array()
    let RS = new Array()
    let RSI = new Array()
    aaa = body
    value = aaa.toString().split(',')[3].split(':')[1]
    arraybody = aaa.toString().split('},{')
    for (let i = 0; i < arraybody.length; i++) {
        arraycp.push(arraybody[i].split(',')[6].split(':')[1])
    }
    for (let i = 1; i <= arraycp.length; i++) {
        arraydp.push(arraycp[arraycp.length - i])

    }
    for (let i = 0; i < arraydp.length; i++) {
        if (arraydp[i] < arraydp[i + 1]) {
            plusarray.push((arraydp[i + 1] - arraydp[i]))
            minusarray.push(null)
        } else if (arraydp[i] > arraydp[i + 1]) {
            minusarray.push(Math.abs((arraydp[i + 1] - arraydp[i])))
            plusarray.push(null)
        } else if (arraydp[i] == arraydp[i + 1]) {
            plusarray.push(null)
            minusarray.push(null)
        }
    }
    for (let i = 0; i <= plusarray.length - 14; i++) {
        firstplusav += plusarray[i]
    }
    for (let i = 0; i <= minusarray.length - 14; i++) {
        firstminusav += minusarray[i]
    }
    AU.push(firstplusav / 14)
    AD.push(firstminusav / 14)
    for (let i = 15; i <= plusarray.length; i++) {
        AU.push((AU[i - 15] * 13 + plusarray[i - 1]) / 14)
    }
    for (let i = 15; i <= minusarray.length; i++) {
        AD.push((AD[i - 15] * 13 + minusarray[i - 1]) / 14)
    }
    for (let i = 0; i < AU.length; i++) {
        RS.push(AU[i] / AD[i])
    }
    for (let i = 0; i < RS.length; i++) {
        RSI.push(100 - 100 / (1 + RS[i]))
    }
    return RSI[13]
}

/**
 * 거래내역 psuh함수
 * @param {String} kind 
 * @param {String} coinname 
 * @param {String} coinquantity 
 * @param {String} coinbuyprice 
 */

class pushtransaction {
    constructor(kind, coinname, coinquantity, coinbuyprice) {
        this.Date = new Date();
        this.kind = kind;
        this.coinname = coinname;
        this.coinquantity = coinquantity;
        this.coinbuyprice = coinbuyprice;
    }
}



var inputRSI = {
    values: [515, 516, 518, 518, 516, 516, 514, 515, 517, 516, 516, 516, 515, 513, 511, 506, 506, 505, 506, 507, 507, 507],
    period: 14
};
//values : 22개, 기간 14일
var expectedResult = [
    86.41, 86.43, 89.65, 86.50, 84.96, 80.54, 77.56, 58.06
];//예상결과

//console.log(rsi.RSI.calculate(inputRSI)) //rsi 계산

app.get('/abc', function (req, res) {
    res.render('abc', { layout: null })
})

app.get('/login', function (req, res) {
    res.render('login')
})
app.get('/qwe', function (req, res) {
    res.render('qwe', { layout: null, krname: krname, market: market })
})
let page
app.get('/qwe/:page', function (req, res) {
    page = req.params.page
    if (page == null) { page = "BTC" }
    console.log(page)

    res.render('qwe', { layout: null, krname: krname, market: market, page: page })
})
app.get('/qqq', function (req, res) {
    mongo.Usertransaction.findOne({ Username: req.session.logindata.id }, (err, users) => {
        res.render('transaction', { layout: null, tra: users.transaction })
    })
})
app.post('/select', function (req, res) {
    console.log(req.body.id)
})
let macrocontrol
app.post('/startcoin', function (req, res) {
    let bcoin = req.body.buycoin
    macrocontrol = setInterval(RSIFunc, 500); //0.5초마다 시세 받는 함수 실행
})
app.post('/stopmacro', function (req, res) {
    clearInterval(macrocontrol)
    res.render('qwe', { layout: null })
    console.log("매크로정지")
})

app.post('/buycoin', function (req, res) {
    let selectcoin = req.body.coin
    const coinquantity = Number(req.body.coinquantity)
    if (!selectcoin || !coinquantity) {
        res.send(`<script>alert('빈 공간이 있습니다.');location.href='MockInvestment/${req.body.coin}';</script>`);
        return
    }
    selectcoin = selectcoin.replace("KRW", "-KRW").split('-').reverse().join('-')
    setapi(selectcoin)
    let state = true
    request(options, function (error, response, body) {
        alloption = body
        let coinvalue = alloption.toString().split(',')[6].split(':')[1] //현재 시세 받아오는 곳
        mongo.Userwallet.findOne({ Username: req.session.logindata.id }, (err, users) => { //매수 후에 가격 계산
            mongo.Usertransaction.findOne({ Useranme: req.session.logindata.id }, (err, nick) => {
                if (users != null || nick != null) {
                    if (users.Money > coinvalue * coinquantity) {
                        for (let i = 0; i < users.Holdcoin.length; i++) {
                            if (users.Holdcoin[i].coinname == selectcoin) {//구매한 코인이 지갑에 있다면
                                /*
                                평균 단가 = 
                                (기준 매수 수량 * 기존 단가) + (추가 매수 수량 * 매수 가격)
                                / (기존 매수 수량 + 추가 매수 수량)
                                */
                                //users.Holdcoin[i].coinquantity += 5
                                users.Holdcoin[i].coinbuyprice =
                                    (users.Holdcoin[i].coinquantity * users.Holdcoin[i].coinbuyprice
                                        + coinquantity * coinvalue) / (users.Holdcoin[i].coinquantity + coinquantity)
                                console.log(users.Holdcoin[i].coinbuyprice)
                                users.Holdcoin[i].coinquantity += coinquantity //수정해야함
                                state = false
                            }

                        }
                        if (state) {
                            let object = new Object
                            object.coinname = selectcoin
                            object.coinquantity = coinquantity
                            object.coinbuyprice = coinvalue
                            users.Holdcoin.push(object)
                        }
                        let objtra = new pushtransaction("매수", selectcoin, coinquantity, coinvalue)
                        nick.transaction.push(objtra)
                        users.Money -= coinvalue * coinquantity
                        users.save(function (err) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        })
                        nick.save(function (err) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        })

                        res.send(`<script>alert('완료');location.href='MockInvestment/${req.body.coin}';</script>`);
                    }
                    else {
                        res.send(`<script>alert('금액이 부족합니다');location.href='MockInvestment/${req.body.coin}';</script>`);
                    }
                }
                else {
                    console.log('회원 정보가 맞지 않습니다.')
                }

            })
        })
        return value
    });

})
function resolveAfter2Seconds() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('fser');
        }, 2000);
    });
}
app.post('/sellcoin', function (req, res) {
    let selectcoin = req.body.coin
    const coinquantity = Number(req.body.coinquantity)
    if (!selectcoin || !coinquantity) {
        res.send(`<script>alert('빈 공간이 있습니다.');location.href='MockInvestment/${req.body.coin}';</script>`);
        return
    }
    selectcoin = selectcoin.replace("KRW", "-KRW").split('-').reverse().join('-')
    setapi(selectcoin)
    request(options, function (error, response, body) {
        alloption = body
        let coinvalue = alloption.toString().split(',')[6].split(':')[1] //현재 시세 받아오는 곳
        mongo.Userwallet.findOne({ Username: req.session.logindata.id }, (err, users) => { //매수 후에 가격 계산
            mongo.Usertransaction.findOne({ Useranme: req.session.logindata.id }, (err, nick) => {
                if (users != null) {
                    users.Money += coinquantity
                    for (let i = 0; i < users.Holdcoin.length; i++) {
                        if (users.Holdcoin[i].coinname == selectcoin) {
                            if (users.Holdcoin[i].coinquantity >= coinquantity) {
                                users.Holdcoin[i].coinbuyprice =
                                    (users.Holdcoin[i].coinquantity * users.Holdcoin[i].coinbuyprice
                                        + coinvalue * (coinquantity * -1)) / (users.Holdcoin[i].coinquantity + (coinquantity * -1))
                                users.Holdcoin[i].coinquantity -= coinquantity
                                if (users.Holdcoin[i].coinquantity <= 0) {
                                    users.Holdcoin.splice(i, 1)
                                }
                            }
                            else {
                                res.send(`<script>alert('개수가 너무 많습니다.');location.href='MockInvestment/${req.body.coin}';</script>`);
                            }
                        }
                    }
                    let objtra = new pushtransaction(req.session.logindata.id, "매도", selectcoin, coinquantity, coinvalue)
                    nick.transaction.push(objtra)
                    users.save(function (err) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    })
                    nick.save(function (err) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    })
                    res.send(`<script>alert('완료');location.href='MockInvestment/${req.body.coin}';</script>`);
                }
                else {
                    console.log('회원 정보가 맞지 않습니다.')
                }
            })
        })
        /*
        mongo.Userwallet.findOneAndUpdate({ "Username": "aaa", "Holdcoin.coinname": "bit" }, { //코인지갑에 개수 저장
            $set: {
                "Holdcoin.$.coinquantity": 7
            }
        }, function (err, data) {
            if (err) console.log(err)
            console.log("추가완료")
        })
        */
    })
})
//request 안에서 구매기능 넣어야 할듯?
app.post('/selectkrw', function (req, res) {
    let asd = req.body.krname.replace("KRW", "-KRW").split('-').reverse().join('-')
    //.market.split('-').reverse().join(',').replace(',','')
    console.log(asd)
    setapi(asd)
    request(options, function (error, response, body) {
        alloption = body
        let value = alloption.toString().split(',')[6].split(':')[1] //현재 시세 받아오는 곳
        console.log(value)
        return value
    });
})

io.on('connection', function (socket) {
    socket.on('coin', function (data) {
        if (data) {
            let asd = data.replace("KRW", "-KRW").split('-').reverse().join('-')
            console.log("asd : " + asd)
            setapi(asd)
            request(options, function (error, response, body) {
                alloption = body
                let value = alloption.toString().split(',')[6].split(':')[1] //현재 시세 받아오는 곳
                console.log(value)
                socket.emit('setcoin', value)
                return value
            });
        }

    })
});



app.get('/signin', function (req, res) { //로그인 창
    res.render('SignIn')
})

app.get('/signup', function (req, res) { //회원가입창
    res.render('SignUp')
})

app.get('/AutomaticTrading', function (req, res) { //자동매매
    res.render('AutomaticTrading')
})
app.get('/Introduce', function (req, res) { //소개글
    res.render('Introduce')
})

app.get('/Ethereum',function(req,res){
    res.render('Ethereum',{layout:null})
})

app.get('/mainpage', function (req, res) { //메인페이지
    res.render('mainpage')
})
app.get('/MockInvestment/:coin', function (req, res) { //모의투자
    let coin = req.params.coin
    if (coin == null) { coin = "BTC" }
    console.log(coin)
    if (req.session.logindata) { //투자내역
        res.render('MockInvestment', { krname: krname, market: market, coin: coin })
    }
    else {
        res.redirect('../SignIn')
    }
    
})
app.get('/ServiceCenter', function (req, res) { //고객센터 (필x)
    res.render('ServiceCenter')
})
app.get('/Rsi', function (req, res) { //rsi관한 설명
    if (req.session.logindata) { //투자내역
        res.render('Rsi')
    }
    else {
        res.redirect('SignIn')
    }
})

app.get('/News', function (req, res) { //뉴스
    if (req.session.logindata) { //투자내역
        res.render('News')
    }
    else {
        res.redirect('SignIn')
    }
    
})
app.get('/InvestmentDetails', function (req, res) {
    if (req.session.logindata) { //투자내역
    mongo.Usertransaction.findOne({ Username: req.session.logindata.id }, (err, users) => {
        res.render('InvestmentDetails', { transaction: users.transaction})
    })
}
else {
    res.redirect('SignIn')
}

})


app.post('/signupb', function (req, res) {
    mongo.User.find((err, users) => {
        mongo.Userwallet.find((err, wallet) => {
            mongo.Usertransaction.find((err, transaction) => {
                let transactionobject = new Object
                let walletobject = new Object
                let userobject = new Object
                transactionobject.Username = req.body.id
                transactionobject.transaction = new Array()

                walletobject.Username = req.body.id
                walletobject.buycooltime = "true"
                walletobject.Money = 3000000
                walletobject.Holdcoin = new Array()

                userobject.Birthday = req.body.startday
                userobject.Username = req.body.name
                userobject.Id = req.body.id
                userobject.password = req.body.pw
                const newuser = new mongo.User(userobject)
                const newtransaction = new mongo.Usertransaction(transactionobject)
                const newwallet = new mongo.Userwallet(walletobject)
                console.log("----------------")
                newuser.save(function (err) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                })
                newtransaction.save(function (err) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                })
                newwallet.save(function (err) {
                    if (err) {
                        console.error(err);
                        return;
                    }
                })
            })
        })
    })
    res.redirect('SignUp')
})

app.post('/signinb', (req, res) => {
    //User 컬렉션에서 입력한 아이디와 패스워드를 찾아서 있으면 로그인하고 없으면 에러를 표시한다.
    mongo.User.find({ name: req.body.id, password: req.body.pw }, (err, user) => {
        if (err) return res.status(500).send({ message: '에러!' });
        else if (user != "") {
            //세션을 생성한다.
            req.session.logindata =
            {
                id: req.body.id,
                password: req.body.pw,
                name: 'username',
                authorized: true
            }
            //세션을 저장한다.
            req.session.save(err => {
                if (err) console.log(err)
                else console.log(req.session)
            })
            console.log("로그인 성공")
            res.redirect('mainpage')
        }
        else return res.send(`<script>alert('유저 없음');location.href='SignIn';</script>`);
    });
});




app.use((req, res) => {
    res.type('text/plain')
    res.status(404)
    res.send('404 - Not Found')
})


// custom 500 page
app.use((err, req, res, next) => {
    console.error(err.message)
    res.type('text/plain')
    res.status(500)
    res.send('500 - Server Error')
})

server.listen(port, () => console.log(
    `Express started on http://localhost:${port}; ` +
    `press Ctrl-C to terminate.`)
)
  /*
Userwallet.findOneAndUpdate({ Username: "aaa" }, { //코인지갑에 개수 저장  
$addToSet: {
Holdcoin: {
coinname: "qqqq",
coinquantity: 5,
coinbuyprice: coinvalue
}
},
}, function (err, data) {
if (err) console.log(err)
console.log("추가완료")
})
*/