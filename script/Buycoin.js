const mongo = require("./mongo")


function resolveAfter2Seconds(returnvalue) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(returnvalue);
        }, 2000);
    });
}

module.exports.asyncCall = async function(selectcoin, coinquantity, coinvalue,returnvalue) {
    //1
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
                    let objtra = new mongo.pushtransaction("매수", selectcoin, coinquantity, coinvalue)
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
                    returnvalue = 1
                }
                else {
                    returnvalue = 2
                }
            }
            else {
                returnvalue = 3
            }

        })
    })
    const result = await resolveAfter2Seconds(returnvalue);
    return returnvalue
    
}