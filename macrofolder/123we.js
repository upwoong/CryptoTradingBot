let getjs = require('../script/getRSI')
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
        
        
        