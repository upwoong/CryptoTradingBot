
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
const rsi = require('technicalindicators')
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

const port = process.env.PORT || 8001
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
// ë씪ì슦í꽣 ì궗ì슜í븯ì뿬 ë씪ì슦í똿 í븿ì닔 ë벑濡
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

const ta = require('ta.js');

const mongo = require("./script/mongo")
const Sellcoin = require("./script/Sellcoin")
//mongoose.set('useFindAndModify', false); //fineOneandupdate ì궗ì슜í븯湲° ì쐞í븳 援щЦ 吏湲덈쾭ì쟾ì뿉ì꽑 í븘ì슂ì뾾ë떎í븿 ì궘ì젣
let options = {
    method: 'GET',
    url: 'https://api.upbit.com/v1/candles/minutes/1?market=KRW-BTC&count=28',
    headers: { Accept: 'application/json' }
};

init() //
let market = new Array()
let krname = new Array()
function init() {

    const whdahr = {
        method: 'GET',
        url: 'https://api.upbit.com/v1/market/all?isDetails=false',
        headers: { Accept: 'application/json' }
    };
    //.replace(/\-/g,'')  -ì젣嫄°
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
        value = alloption.toString().split(',')[6].split(':')[1] //í쁽ì옱 ì떆ì꽭 諛쏆븘ì삤ë뒗 怨³
    });
    return value
}

let alloption = "" // 肄붿씤ì쓽 紐⑤뱺 ì젙蹂´
let value = "" //í쁽ì옱 媛寃©
let mybuyaver = 40000000 //í룊洹좊ℓì닔媛寃©
let mypl = 0 //í쁽ì옱 ì넀ì씡
let myQuantity = 3 //í쁽ì옱 肄붿씤ì닔ë웾
function intervalFunc() {
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        alloption = body
        value = alloption.toString().split(',')[6].split(':')[1] //í쁽ì옱 ì떆ì꽭 諛쏆븘ì삤ë뒗 怨³
        mypl = (value - mybuyaver) * myQuantity //í쁽ì옱 ì넀ì씡 怨꾩궛
        console.log(value)
        io.emit('currentv', value)
        return value
    });
}
/*
ì옄ë룞留ㅻℓí븿ì닔 留뚮뱶ë뒗 諛⑹븞1
1. ì옄ë룞留ㅻℓ 踰꾪듉 ì떎í뻾ì떆 ì옄ë룞留ㅻℓ 肄붾뱶媛 ë뱾ì뼱ì엳ë뒗 í븿ì닔瑜¼ í뙆ì씪濡 留뚮벉 ex) ë땳ë꽕ì엫123ì궗ì슜ì옄媛 踰꾪듉 í겢由­ì떆 function123.js í뙆ì씪 ì깮ì꽦
2. setinterval(function123)ì쓣 怨꾩냽 ì떎í뻾
3. 醫낅즺í븯怨  ì떢ì쓣 ë븣, í뙆ì씪 ì궘ì젣
*/
//setInterval(asd1("Adw"),1000)
//setInterval(function() { fun.func123("myURl") }, 1000);
//fun.func123("hello")
async function currentcoin() {
    request(options, function (error, response, body) {
        alloption = body;
        value = alloption.toString().split(',')[6].split(':')[1]; //í쁽ì옱 ì떆ì꽭 諛쏆븘ì삤ë뒗 怨³
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





/**
 * 1. web.jsì뿉ì꽌 肄붿씤媛 諛쏄린
 * 
 * 2. ì뒪í겕由쏀듃 í뙆ì씪ì뿉ì꽌 肄붿씤媛 諛쏄린
 * 
 * ì뒪í겕由쏀듃 ì븞ì뿉ì꽌 ë뜲ì씠í꽣踰좎씠ì뒪 遺덈윭ìì꽌 ì ì옣(泥섎━ 媛ë뒫)
 */
app.post('/startm', function (req, res) {
    let pay = req.body.pay
    let name = req.body.name
    async function funfs(nickname, age) {
        fs.writeFile(`./${nickname}.js`, `let getjs = require('./script/getRSI')
        const request = require('request')
        const mongo = require("./script/mongo")
        const Setapi = require("./script/Setapi")
        let value = 0
        
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
        setTimeout(() => {
            setInterval(function () {
                Setapi.setapi("KRW-BTC")
                request(options, function (error, response, body) {
                    mongo.Userwallet.findOne({ Username: "aaa" }, (err, users) => {
                        mongo.Usertransaction.findOne({ Username: "aaa" }, (err, acc) => {
                            console.log(getjs.getRSI(body).RSI)
                            if (getjs.getRSI(body).RSI < 35) {
                                console.log(getjs.getRSI(body).RSI)
                                if (users.cooltime == "true") {
                                    users.cooltime = "false"
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
                                        let objtra = new pushtransaction("매수", selectcoin, coinquantity, coinvalue)
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
                                                res.send('<script>alert('개수가 너무 많습니다.');location.href='qwe';</script>');
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
            }, 1000);
        }, 3000);
        
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
        `)

        console.log(pay)
        let req = await fetchAge(nickname)
        const getjs = require(`./${nickname}.js`)
        setInterval(function () {
            setapi(pay)
            request(options, function (error, response, body) {
                getjs.func123(body, pay)
                return 0
            })
        }, 1000);
    }
    funfs(name, pay)
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
})



function RSIFunc() {
    let aaaa = 0
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        aaaa = getcurrentRSI(body)
        console.log(aaaa)
        mongo.Usermacrocooltime.find(function (err, data) {
            if (aaaa < 60 && data[0].status == "true") { //ì긽í깭媛 true硫´ 援щℓì떎í뻾 ì씠í썑 ì긽í깭 false濡 蹂í솚
                mongo.Usermacrocooltime.findOneAndUpdate({}, { $set: { 'status': "false" } }, (err, data) => {
                    if (err) console.log(err)
                    else console.log("ì ì옣ì셿猷")
                })
                console.log("í듅ì젙 ì씠í븯")
                buyFnc() //醫낅ぉ 留ㅼ닔
            }
        })

    });
}

//setInterval(RSIFunc, 500); //0.5珥덈쭏ë떎 ì떆ì꽭 諛쏅뒗 í븿ì닔 ì떎í뻾
function buyFnc() { //醫낅ぉ 留ㅼ닔 í븿ì닔 + 荑⑦ì엫 ë꽔湲°
    setTimeout(cooltime, 43200000) //12ì떆媛 í썑ì뿉 ë떎ì떆 援щℓ 媛ë뒫
}
function cooltime() {
    //ë뜲ì씠í꽣踰좎씠ì뒪ì뿉ì꽌 false 瑜¼ true濡 諛붽씀ë뒗 臾몄옣
}
function getcurrentRSI(body) { //RSI援ы븯ë뒗 í븿ì닔
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
 * 嫄곕옒ë궡ì뿭 psuhí븿ì닔
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
//values : 22媛, 湲곌컙 14ì씪
var expectedResult = [
    86.41, 86.43, 89.65, 86.50, 84.96, 80.54, 77.56, 58.06
];//ì삁ì긽寃곌낵

//console.log(rsi.RSI.calculate(inputRSI)) //rsi 怨꾩궛

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
    mongo.Usertransaction.findOne({ Username: "aaa" }, (err, users) => {
        res.render('transaction', { layout: null, tra: users.transaction })
    })
})
app.post('/select', function (req, res) {
    console.log(req.body.id)
})
let macrocontrol
app.post('/startcoin', function (req, res) {
    let bcoin = req.body.buycoin
    macrocontrol = setInterval(RSIFunc, 500); //0.5珥덈쭏ë떎 ì떆ì꽭 諛쏅뒗 í븿ì닔 ì떎í뻾
})
app.post('/stopmacro', function (req, res) {
    clearInterval(macrocontrol)
    res.render('qwe', { layout: null })
    console.log("留ㅽ겕濡쒖젙吏")
})

app.post('/buycoin', function (req, res) {
    let selectcoin = req.body.krname
    const coinquantity = Number(req.body.coinquantity)
    if (!selectcoin || !coinquantity) {
        res.send(`<script>alert('鍮 怨듦컙ì씠 ì엳ì뒿ë땲ë떎.');location.href='qwe';</script>`);
        return
    }
    selectcoin = selectcoin.replace("KRW", "-KRW").split('-').reverse().join('-')
    setapi(selectcoin)
    let state = true
    request(options, function (error, response, body) {
        alloption = body
        let coinvalue = alloption.toString().split(',')[6].split(':')[1] //í쁽ì옱 ì떆ì꽭 諛쏆븘ì삤ë뒗 怨³
        mongo.Userwallet.findOne({ Username: "aaa" }, (err, users) => { //留ㅼ닔 í썑ì뿉 媛寃© 怨꾩궛
            mongo.Usertransaction.findOne({ Useranme: "aaa" }, (err, nick) => {
                if (users != null || nick != null) {
                    if (users.Money > coinvalue * coinquantity) {
                        for (let i = 0; i < users.Holdcoin.length; i++) {
                            if (users.Holdcoin[i].coinname == selectcoin) {//援щℓí븳 肄붿씤ì씠 吏媛묒뿉 ì엳ë떎硫´
                                /*
                                í룊洹  ë떒媛 = 
                                (湲곗¤ 留ㅼ닔 ì닔ë웾 * 湲곗〈 ë떒媛) + (異붽° 留ㅼ닔 ì닔ë웾 * 留ㅼ닔 媛寃©)
                                / (湲곗〈 留ㅼ닔 ì닔ë웾 + 異붽° 留ㅼ닔 ì닔ë웾)
                                */
                                //users.Holdcoin[i].coinquantity += 5
                                users.Holdcoin[i].coinbuyprice =
                                    (users.Holdcoin[i].coinquantity * users.Holdcoin[i].coinbuyprice
                                        + coinquantity * coinvalue) / (users.Holdcoin[i].coinquantity + coinquantity)
                                console.log(users.Holdcoin[i].coinbuyprice)
                                users.Holdcoin[i].coinquantity += coinquantity //ì닔ì젙í빐ì빞í븿
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
                        let objtra = new pushtransaction("留ㅼ닔", selectcoin, coinquantity, coinvalue)
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

                        res.send(`<script>alert('ì셿猷');location.href='qwe/${req.body.krname}';</script>`);
                    }
                    else {
                        res.send(`<script>alert('湲덉븸ì씠 遺議깊빀ë땲ë떎');location.href='qwe/${req.body.krname}';</script>`);
                    }
                }
                else {
                    console.log('í쉶ì썝 ì젙蹂닿° 留욎§ ì븡ì뒿ë땲ë떎.')
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
    let selectcoin = req.body.krname
    const coinquantity = Number(req.body.coinquantity)
    if (!selectcoin || !coinquantity) {
        res.send(`<script>alert('鍮 怨듦컙ì씠 ì엳ì뒿ë땲ë떎.');location.href='qwe';</script>`);
        return
    }
    selectcoin = selectcoin.replace("KRW", "-KRW").split('-').reverse().join('-')
    setapi(selectcoin)
    request(options, function (error, response, body) {
        alloption = body
        let coinvalue = alloption.toString().split(',')[6].split(':')[1] //í쁽ì옱 ì떆ì꽭 諛쏆븘ì삤ë뒗 怨³
        mongo.Userwallet.findOne({ Username: "aaa" }, (err, users) => { //留ㅼ닔 í썑ì뿉 媛寃© 怨꾩궛
            mongo.Usertransaction.findOne({ Useranme: "aaa" }, (err, nick) => {
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
                                res.send(`<script>alert('媛쒖닔媛 ë꼫臾´ 留롮뒿ë땲ë떎.');location.href='qwe/${req.body.krname}';</script>`);
                            }
                        }
                    }
                    let objtra = new pushtransaction("aaa", "留ㅻ룄", selectcoin, coinquantity, coinvalue)
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
                    res.send(`<script>alert('ì셿猷');location.href='qwe/${req.body.krname}';</script>`);
                }
                else {
                    console.log('í쉶ì썝 ì젙蹂닿° 留욎§ ì븡ì뒿ë땲ë떎.')
                }
            })
        })
        /*
        mongo.Userwallet.findOneAndUpdate({ "Username": "aaa", "Holdcoin.coinname": "bit" }, { //肄붿씤吏媛묒뿉 媛쒖닔 ì ì옣
            $set: {
                "Holdcoin.$.coinquantity": 7
            }
        }, function (err, data) {
            if (err) console.log(err)
            console.log("異붽°ì셿猷")
        })
        */
    })
})
//request ì븞ì뿉ì꽌 援щℓ湲곕뒫 ë꽔ì뼱ì빞 í븷ë벏?
app.post('/selectkrw', function (req, res) {
    let asd = req.body.krname.replace("KRW", "-KRW").split('-').reverse().join('-')
    //.market.split('-').reverse().join(',').replace(',','')
    console.log(asd)
    setapi(asd)
    request(options, function (error, response, body) {
        alloption = body
        let value = alloption.toString().split(',')[6].split(':')[1] //í쁽ì옱 ì떆ì꽭 諛쏆븘ì삤ë뒗 怨³
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
                let value = alloption.toString().split(',')[6].split(':')[1] //í쁽ì옱 ì떆ì꽭 諛쏆븘ì삤ë뒗 怨³
                console.log(value)
                socket.emit('setcoin', value)
                return value
            });
        }

    })
});



app.post('/main', (req, res) => {
    //User 而щ젆ì뀡ì뿉ì꽌 ì엯ë젰í븳 ì븘ì씠ë뵒ì í뙣ì뒪ì썙ë뱶瑜¼ 李얠븘ì꽌 ì엳ì쑝硫´ 濡쒓렇ì씤í븯怨  ì뾾ì쑝硫´ ì뿉ë윭瑜¼ í몴ì떆í븳ë떎.
    mongo.User.findOne({ name: req.body.name, password: req.body.password }, (err, user) => {
        if (err) return res.status(500).send({ message: 'ì뿉ë윭!' });
        else if (user) {
            //ì꽭ì뀡ì쓣 ì깮ì꽦í븳ë떎.
            req.session.logindata =
            {
                id: req.body.name,
                password: req.body.password,
                name: 'username',
                authorized: true
            }
            //ì꽭ì뀡ì쓣 ì ì옣í븳ë떎.
            req.session.save(err => {
                if (err) console.log(err)
                else console.log(req.session)
            })
            console.log("愿由ъ옄 濡쒓렇ì씤 ì꽦怨µ")
            res.redirect('main')
        }
        else return res.status(404).send({ message: 'ì쑀ì  ì뾾ì쓬!' })
    });
});


app.get('/signin', function (req, res) { //濡쒓렇ì씤 李½
    res.render('SignIn')
})

app.get('/signup', function (req, res) { //í쉶ì썝媛ì엯李½
    res.render('SignUp')
})

app.get('/AutomaticTrading', function (req, res) { //ì옄ë룞留ㅻℓ
    res.render('AutomaticTrading')
})
app.get('/Introduce', function (req, res) { //ì냼媛쒓¸
    res.render('Introduce')
})
app.get('/mainpage', function (req, res) { //硫붿씤í럹ì씠吏
    res.render('mainpage')
})
app.get('/MockInvestment/:coin', function (req, res) { //紐⑥쓽í닾ì옄
    let coin = req.params.coin
    if (coin == null) { coin = "BTC" }
    console.log(coin)
    res.render('MockInvestment', { krname: krname, market: market , coin : coin})
})
app.get('/ServiceCenter', function (req, res) { //怨좉컼ì꽱í꽣 (í븘x)
    res.render('ServiceCenter')
})
app.get('/Rsi', function (req, res) { //rsi愿í븳 ì꽕紐
    res.render('Rsi')
})

app.get('/News', function (req, res) { //ë돱ì뒪
    res.render('News')
})
app.get('/zxc', function (req, res) { //ë돱ì뒪
    res.render('zxc',{layout:null})
})


app.get('/InvestmentDetails', function (req, res) { //í닾ì옄ë궡ì뿭
    mongo.Usertransaction.findOne({Username : "aaa"},(err,users)=>{
        res.render('InvestmentDetails' ,{transaction : users.transaction})
    })
    
})


app.post('/signupb', function (req, res) {
    console.log(req.body)
    console.log("aaaa")
})

app.post('/signinb', (req, res) => {
    //User 而щ젆ì뀡ì뿉ì꽌 ì엯ë젰í븳 ì븘ì씠ë뵒ì í뙣ì뒪ì썙ë뱶瑜¼ 李얠븘ì꽌 ì엳ì쑝硫´ 濡쒓렇ì씤í븯怨  ì뾾ì쑝硫´ ì뿉ë윭瑜¼ í몴ì떆í븳ë떎.
    mongo.User.findOne({ name: req.body.id, password: req.body.pw }, (err, user) => {
        if (err) return res.status(500).send({ message: 'ì뿉ë윭!' });
        else if (user) {
                        //ì꽭ì뀡ì쓣 ì깮ì꽦í븳ë떎.
                        req.session.logindata =
                        {
                            id: req.body.id,
                            password: req.body.pw,
                            name: 'username',
                            authorized: true
                        }
                        //ì꽭ì뀡ì쓣 ì ì옣í븳ë떎.
                        req.session.save(err => {
                            if (err) console.log(err)
                            else console.log(req.session)
                        })
                        console.log("愿由ъ옄 濡쒓렇ì씤 ì꽦怨µ")
                        res.redirect('signup')
        }
        else return res.status(404).send({ message: 'ì쑀ì  ì뾾ì쓬!' })
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
Userwallet.findOneAndUpdate({ Username: "aaa" }, { //肄붿씤吏媛묒뿉 媛쒖닔 ì ì옣  
$addToSet: {
Holdcoin: {
  coinname: "qqqq",
  coinquantity: 5,
  coinbuyprice: coinvalue
}
},
}, function (err, data) {
if (err) console.log(err)
console.log("異붽°ì셿猷")
})
*/
