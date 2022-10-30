
/*
mongo.Userwallet.findOne({ Username: "aaa" }, (err, users) => { //매수 후에 가격 계산
    mongo.Usertransaction.findOne({ Useranme: "aaa" }, (err, nick) => {
        if (users != null || nick != null) {
            if (users.Money > coinvalue * coinquantity) {
                for (let i = 0; i < users.Holdcoin.length; i++) {
                    if (users.Holdcoin[i].coinname == selectcoin) {//구매한 코인이 지갑에 있다면
                        /*
                        평균 단가 = 
                        (기준 매수 수량 * 기존 단가) + (추가 매수 수량 * 매수 가격)
                        / (기존 매수 수량 + 추가 매수 수량)
                        
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
                let objtra = new pushtransaction("aaa", "매수", selectcoin, coinquantity, coinvalue)
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

                res.send(`<script>alert('완료');location.href='qwe';</script>`);
            }
            else {
                res.send(`<script>alert('금액이 부족합니다');location.href='qwe';</script>`);
            }
        }
        else {
            console.log('회원 정보가 맞지 않습니다.')
        }

    })
})
*/



/* 매도
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
                    res.send(`<script>alert('개수가 너무 많습니다.');location.href='qwe';</script>`);
                }
            }
        }
        let objtra = new pushtransaction("aaa", "매도", selectcoin, coinquantity, coinvalue)
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
        res.send(`<script>alert('완료');location.href='qwe';</script>`);
    }
    else {
        console.log('회원 정보가 맞지 않습니다.')
    }
})
})
*/