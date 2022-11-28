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
const Sellscript = require("./script/Sellcoin")
const Buyscript = require("./script/Buycoin")
const Setapi = require("./script/Setapi")


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


/**
 * 1. web.js에서 코인값 받기
 * 
 * 2. 스크립트 파일에서 코인값 받기
 * 
 * 스크립트 안에서 데이터베이스 불러와서 저장(처리 가능)
 */
//로컬로 할시 교체할 주소 : require = ./macrofolder/${name}.js
//                       : writrefile : macrofolder/${name}.js
//호스팅 할시 교체할 주소 : /home/hosting_users/solverduo/apps/solverduo_solverduo/macrofolder/${name}.js
let getjs = ''
app.post('/startm', function (req, res) {
    let kind = req.body.kind
    let name = req.session.logindata.id  //닉네임
    let buypoint = req.body.buypoint //매수지점
    let sellpoint = req.body.sellpoint //매도지점
    async function funfs(nickname, age) {
        console.log("실행중")
        try {
            let req = await fetchAge(name)
            setapi(kind)
            console.log("3")
            getjs = require(`/home/hosting_users/solverduo/apps/solverduo_solverduo/macrofolder/${name}.js`)
            console.log(getjs)
            getjs.func123(kind, name,buypoint,sellpoint)
        }
        catch (err) {
            console.log(err)
        }
    }
    funfs(name, kind)
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
        
        let coinvalue = 1
        let selectcoin = "KRW-BTC"
        let coinquantity = 1
        module.exports.func123 = function(say,name,buypoint,sellpoint){
            let startmacro = setInterval(function () {
                if(!module.exports.boolean){ //stop and macro
                    Setapi.setapi(say)
                request(options, function (error, response, body) {
                    alloption = body
                coinvalue = alloption.toString().split(',')[6].split(':')[1] //현재 시세 받아오는 곳
                    mongo.Userwallet.findOne({ Username: name }, (err, users) => {
                        mongo.Usertransaction.findOne({ Username: name }, (err, acc) => {
                            console.log(getjs.getRSI(body).RSI)
                            if (getjs.getRSI(body).RSI < buypoint) {
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
                                                module.exports.boolean = false
                                            }
                                        }
                                        if (module.exports.boolean) {
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
                                    console.log("종류 : " + say)
                                console.log("매수 가격 : " + coinvalue)
                                console.log("매수 갯수 : " + coinquantity)
                                    console.log("매수 완료")
                                }
                            } else if (getjs.getRSI(body).RSI > sellpoint) {
                                if (users.buycooltime == "true") {
                                    users.buycooltime = "false"
                                    setTimeout(() => changef(name), 10000);
                                    users.Money += coinquantity
                                    for (let i = 0; i < users.Holdcoin.length; i++) {
                                        if (users.Holdcoin[i].coinname == selectcoin) {
                                            if (users.Holdcoin[i].coinquantity >= coinquantity) {
                                                let pricereturn = (coinvalue - users.Holdcoin[i].coinbuyprice) * coinquantity
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
                                    let objtra = new mongo.pushtransaction("매도", selectcoin, coinquantity, coinvalue,pricereturn)
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
        await setTimeoutPromise(6000);
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


/**
 * 거래내역 psuh함수
 * @param {String} kind 
 * @param {String} coinname 
 * @param {String} coinquantity 
 * @param {String} coinbuyprice 
 */

class pushtransaction {
    constructor(kind, coinname, coinquantity, coinbuyprice,pricereturn) {
        this.Date = new Date();
        this.kind = kind;
        this.coinname = coinname;
        this.coinquantity = coinquantity;
        this.coinbuyprice = coinbuyprice;
        this.pricereturn = pricereturn
    }
}


app.post('/buycoin', function (req, res) {
    let selectcoin = req.body.coin
    const coinquantity = Number(req.body.coinquantity)
    if (!selectcoin || !coinquantity) {
        res.send(`<script>alert('빈 공간이 있습니다.');location.href='MockInvestment/${req.body.coin}';</script>`);
        return
    }
    //awdawdaw
    selectcoin = selectcoin.replace("KRW", "-KRW").split('-').reverse().join('-')
    setapi(selectcoin)
    let state = true
    request(options, function (error, response, body) {
        alloption = body
        let coinvalue = alloption.toString().split(',')[6].split(':')[1] //현재 시세 받아오는 곳
        mongo.Userwallet.findOne({ Username: req.session.logindata.id }, (err, users) => { //매수 후에 가격 계산
            mongo.Usertransaction.findOne({ Username: req.session.logindata.id }, (err, nick) => {
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
                        console.log(nick)
                        console.log(users)
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

//판매시 금액시 수량을 더하는 코드 수정해야함
//수익률 : (현재 코인가격 * 수량) - 현재 평균가
app.post('/sellcoin', function (req, res) {
    let selectcoin = req.body.coin
    const coinquantity = Number(req.body.coinquantity)
    if (!selectcoin || !coinquantity) {
        res.send(`<script>alert('빈 공간이 있습니다.');location.href='MockInvestment/${selectcoin}';</script>`);
        return
    }
    selectcoin = selectcoin.replace("KRW", "-KRW").split('-').reverse().join('-')
    setapi(selectcoin)
    request(options, function (error, response, body) {
        alloption = body
        let coinvalue = alloption.toString().split(',')[6].split(':')[1] //현재 시세 받아오는 곳
        mongo.Userwallet.findOne({ Username: req.session.logindata.id }, (err, users) => { //매수 후에 가격 계산
            mongo.Usertransaction.findOne({ Username: req.session.logindata.id }, (err, nick) => {
                if (users != null) {
                    users.Money += coinquantity
                    for (let i = 0; i < users.Holdcoin.length; i++) {
                        if (users.Holdcoin[i].coinname == selectcoin) {
                            if (users.Holdcoin[i].coinquantity >= coinquantity) {
                                let pricereturn = (coinvalue - users.Holdcoin[i].coinbuyprice) * coinquantity
                                users.Holdcoin[i].coinbuyprice =
                                    (users.Holdcoin[i].coinquantity * users.Holdcoin[i].coinbuyprice
                                        + coinvalue * (coinquantity * -1)) / (users.Holdcoin[i].coinquantity + (coinquantity * -1))
                                users.Holdcoin[i].coinquantity -= coinquantity
                                if (users.Holdcoin[i].coinquantity <= 0) {
                                    users.Holdcoin.splice(i, 1)
                                }
                                let objtra = new mongo.pushtransaction("매도", selectcoin, coinquantity, coinvalue, pricereturn)
                                nick.transaction.push(objtra)
                            }
                            else {
                                res.send(`<script>alert('개수가 너무 많습니다.');location.href='MockInvestment/${req.body.coin}';</script>`);
                            }
                        }
                    }
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
    })
})

//함수의 매개변수들 최종적으로 수정해야함
//리팩토링한코인매수
app.post('/buycoinre', function (req, res) {
    let selectcoin = req.body.coin
    const coinquantity = Number(req.body.coinquantity)
    if (!selectcoin || !coinquantity) {
        res.send(`<script>alert('빈 공간이 있습니다.');location.href='MockInvestment/${req.body.coin}';</script>`);
        return
    }
    //awdawdaw
    selectcoin = selectcoin.replace("KRW", "-KRW").split('-').reverse().join('-')
    let Buyvalue = Buyscript.asyncCall(selectcoin,0.1,1,0).then(function(returnvalue){
        asyncvalue = returnvalue
        switch(asyncvalue){
            case 1: console.log("정상적인 완료")
            res.send(`<script>alert('완료');location.href='MockInvestment/${req.body.coin}';</script>`);
            break
            case 2: console.log("개수가 많음")
            res.send(`<script>alert('개수가 너무 많습니다.');location.href='MockInvestment/${req.body.coin}';</script>`);
            break
            default : console.log("회원정보 틀림")
        }
        console.log(asyncvalue)
    })
})



//리팩토링 한 코인매도
app.post('/sellcoinre',function(req,res){
    let selectcoin = req.body.coin
    const coinquantity = Number(req.body.coinquantity)
    let asyncvalue = 0
    selectcoin = selectcoin.replace("KRW", "-KRW").split('-').reverse().join('-')
    if (!selectcoin || !coinquantity) {
        res.send(`<script>alert('빈 공간이 있습니다.');location.href='MockInvestment/${selectcoin}';</script>`);
        return
    }
    let Sellvalue = Sellscript.asyncCall("KRW-BTC",0.1,1,0).then(function(returnvalue){
        asyncvalue = returnvalue
        switch(asyncvalue){
            case 1: console.log("정상적인 완료")
            res.send(`<script>alert('완료');location.href='MockInvestment/${req.body.coin}';</script>`);
            break
            case 2: console.log("개수가 많음")
            res.send(`<script>alert('개수가 너무 많습니다.');location.href='MockInvestment/${req.body.coin}';</script>`);
            break
            default : console.log("회원정보 틀림")
        }
        console.log(asyncvalue)
    })
    console.log("Sellvalue : " + Sellvalue)
    console.log("asyncvalue : " + asyncvalue)
})
/*
리팩토링
let asyncvalue = 0
let asdaaaa = Sellscript.asyncCall("KRW-BTC",0.1,1,0).then(function(returnvlaue){
    console.log(asyncvalue = returnvlaue)
})
setTimeout(() => {
    console.log(asyncvalue)
}, 5000);
*/
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
/*
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
        Setapi.currentcoin(data).then(function(coinvalue){
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
 //   }
//});

/*
내일 무조건 함
여기서 웹소켓 안쓰고
핸들바에서 써서 바로 불러온다음
현재값에 있는 것을 매수 매도시 req.body로 가져온다?
일리 있음
*/
/*
const WebSocket = require('ws')

let recvData = "";

function tradeServerConnect(codes) {
    let ws = new WebSocket('wss://api.upbit.com/websocket/v1');
    ws.on('open', ()=>{
        console.log('trade websocket is connected')
        const str = `[{"ticket":"find"},{"type":"trade","codes":["${codes}"]}]`;
        ws.send(str);
    })  
    ws.on('message', (data)=>{
        try {
            console.log(ws)
            let str = data.toString('utf-8')
            recvData = JSON.parse(str)
            //console.log(recvData)
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

app.get('/Ethereum', function (req, res) {
    res.render('Ethereum', { layout: null })
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
            res.render('InvestmentDetails', { transaction: users.transaction })
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

let optionscxz = {
        method: 'GET',
        url: `https://api.upbit.com/v1/candles/minutes/1?market=${value}&count=28`,
        headers: { Accept: 'application/json' }
    };


/*
const optionsasd = {
    method: 'GET',
    url: 'https://api.upbit.com/v1/market/all?isDetails=false',
    headers: {accept: 'application/json'}
  };
  
  request(optionsasd, function (error, response, body) {
    if (error) throw new Error(error);
    let cbody
    alloption = body;
    cbody = alloption.toString().split('},{')
    let newArray = new Array()
    for(let i =0;i<cbody.length/3;i++){
        if(((cbody[i].split(":")[1].replace(/"/g,'').split(',')[0]).includes("KRW"))){
            newArray.push((cbody[i].split(":")[1].replace(/"/g,'').split(',')[0]))
        }
        //console.log(cbody[i].split(":")[1].replace(/"/g,'').split(',')[0])
    }
    //console.log(newArray)
    for(let i =0;i<newArray.length;i++){
        let url = "https://api.upbit.com/v1/candles/minutes/10"
        //let querystring = {"market":newArray[i],"count":"1"}
        //let response = request("GET", url, params=querystring)
        //let data = response.json()
        optionscxz.url = `https://api.upbit.com/v1/candles/minutes/1?market=${newArray[i]}&count=1`
        
        request(optionscxz, function (error, response, body) {
            alloption = body;
            value = alloption.toString().split(',') //현재 시세 받아오는 곳
            console.log(newArray[i])
            console.log(value)
            return value
        })
        
        
    }
    
  });
  */

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
다음에 해야할거
똑같은 코드로 다른 소켓통신 하는법 찾기
소켓 종료하는거 찾기
현재 코인시세 받는것.
Setapi.currentcoin("KRW-BTC").then(function(value){
    console.log(value.value)
})
*/