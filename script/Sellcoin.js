const mongo = require("./mongo")

module.exports.Sellcoina = function (selectcoin, coinquantity, coinvalue) {
    mongo.Userwallet.findOne({ Username: "aaa" }, (err, users) => { //매수 후에 가격 계산
        mongo.Usertransaction.findOne({ Useranme: "aaa" }, (err, nick) => {
            if (users != null) {
                let returnvalue = 0
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
                            console.log("!23123")
                            returnvalue = 2 //개수가 많음
                            return 2
                        }
                    }
                }
                let objtra = new mongo.pushtransaction("매도", selectcoin, coinquantity, coinvalue)
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
                returnvalue = 1 //완료
            }
            else {
                console.log("bbb")
                returnvalue = 3 // 회원정보 틀림
            }
        })
    })
    return returnvalue
}
let zzz = 555
module.exports.asd = function () {
    mongo.Usertransaction.find({}).then(function (err, data) {
        console.log("adwdad")
        return zzz
    })
}

function resolveAfter2Seconds(returnvalue) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(returnvalue);
        }, 2000);
    });
}

module.exports.asyncCall = async function(selectcoin, coinquantity, coinvalue,returnvalue) {
    //1
    mongo.Userwallet.findOne({ Username: "aaa" }, (err, users) => { //매수 후에 가격 계산
        mongo.Usertransaction.findOne({ Useranme: "aaa" }, (err, nick) => {
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
                            returnvalue = 2 //개수가 많음
                            return 2
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
                returnvalue = 1 //완료
            }
            else {
                returnvalue = 3 // 회원정보 틀림
            }
        })
    })
    const result = await resolveAfter2Seconds(returnvalue);
    return returnvalue
    
}

