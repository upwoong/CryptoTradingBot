let getjs = require('../script/getRSI')
const request = require('request')
const mongo = require("../script/mongo")
const Setapi = require("../script/Setapi")
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
let istrue = false
module.exports.func123 = function (coinname, name, buypoint, sellpoint) {
    setInterval(function () {
        if (!istrue) {
            Setapi.setapi(coinname)
            request(options, function (error, response, body) {
                alloption = body
                coinvalue = alloption.toString().split(',')[6].split(':')[1] //현재 시세 받아오는 곳
                mongo.Userwallet.findOne({ Username: name }, (err, users) => {
                    mongo.Usertransaction.findOne({ Username: name }, (err, acc) => {
                        console.log(getjs.getRSI(body).RSI)
                        if (getjs.getRSI(body).RSI < buypoint) {
                            console.log(getjs.getRSI(body).RSI)
                            if (users.cooltime == "true") {
                                users.cooltime = "false"
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
                                console.log("종류 : " + coinname)
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
                                            users.Holdcoin[i].coinbuyprice =
                                                (users.Holdcoin[i].coinquantity * users.Holdcoin[i].coinbuyprice
                                                    + coinvalue * (coinquantity * -1)) / (users.Holdcoin[i].coinquantity + (coinquantity * -1))
                                            users.Holdcoin[i].coinquantity -= coinquantity
                                            if (users.Holdcoin[i].coinquantity <= 0) {
                                                users.Holdcoin.splice(i, 1)
                                            }
                                        }
                                        else {
                                            res.send(`<script>alert('개수가 너무 많습니다.');location.href='qwe';</script>`);
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
            clearInterval(func123)
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



module.exports.func123 = function (coinname, name, buypoint, sellpoint) {
    setInterval(function () {
        if (!istrue) {
            Setapi.setapi(coinname)
            request(options, function (error, response, body) {
           
                        console.log(getjs.getRSI(body).RSI)
                        if (getjs.getRSI(body).RSI < buypoint) {
                            console.log(getjs.getRSI(body).RSI)
                            if (users.cooltime == "true") {
                                users.cooltime = "false"
                                setTimeout(() => changef(name), 10000);
                                console.log("종류 : " + coinname)
                                console.log("매수 가격 : " + coinvalue)
                                console.log("매수 갯수 : " + coinquantity)
                                console.log("매수 완료")
                            }
                        } else if (getjs.getRSI(body).RSI > sellpoint) {
                            if (users.buycooltime == "true") {
                                users.buycooltime = "false"
                                setTimeout(() => changef(name), 10000);
                            }
                        }
                    })
        } else {
            clearInterval(func123)
        }
    }, 1000);
}