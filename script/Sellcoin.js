const mongo = require("./mongo")
let returnvalue = 1111
module.exports.Sellcoina = function (selectcoin, coinquantity,coinvalue) {
     mongo.Userwallet.findOne({ Username: "aaa" }, (err, users) => { //매수 후에 가격 계산
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
module.exports.asd = function(){
    mongo.Usertransaction.find({}).then(function (err, data) {
        console.log("adwdad")
            return zzz
        })
}

