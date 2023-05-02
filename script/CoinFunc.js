const mongo = require("./mongo")
const User = require("./User")

module.exports.GetHoldCoin = async function (name) {
    try {
        await mongo.connectDB()
        const userWallet = await mongo.userWallet.findOne({ userName: name })
        let coinArray = userWallet.holdCoin;
        let totalMoney = 0
        let holdMoney = userWallet.Money;
        let startMoney = userWallet.startMoney;
        for(let i =0;i<coinArray.length;i++){
            const response = await fetch(`https://api.upbit.com/v1/candles/minutes/1?market=${coinArray[i].coinName}&count=1`) 
            const body = await response.json()
            totalMoney += coinArray[i].coinQuantity * body[0].trade_price 
        }
        return {
            coinArray: coinArray,
            totalMoney: totalMoney+holdMoney,
            holdMoney: holdMoney,
            startMoney: startMoney,
        };
    } catch (error) {
        console.error(error);
        return {
            coinArray: [],
            totalMoney: 0,
            holdMoney: 0,
            startMoney: 0,
        };
    } finally {
        await mongo.closeDB()
    }
};


module.exports.SellFunc = async function (Name, selectcoin, coinQuantity, coinvalue) {

    const users = (await User.findUser(Name,false)).Userwallet
    const nick = (await User.findUser(Name,false)).UserTransaction
    console.log("Name" + Name)
    console.log("sle" + selectcoin)
    if (users) {
        users.Money += (coinQuantity * coinvalue);
        for (let i = 0; i < users.holdCoin.length; i++) {
            if (users.holdCoin[i].coinName === selectcoin) {
                if (users.holdCoin[i].coinQuantity >= coinQuantity) {
                    const pricereturn = (coinvalue - users.holdCoin[i].coinBuyPrice) * coinQuantity;

                    users.holdCoin[i].coinBuyPrice = (users.holdCoin[i].coinQuantity * users.holdCoin[i].coinBuyPrice + coinvalue * (coinQuantity * -1)) / (users.holdCoin[i].coinQuantity + (coinQuantity * -1));
                    users.holdCoin[i].coinQuantity -= coinQuantity;

                    if (users.holdCoin[i].coinQuantity <= 0) {
                        users.holdCoin.splice(i, 1);
                    }

                    const objtra = new mongo.pushtransaction("매도", selectcoin, coinQuantity, coinvalue, pricereturn);
                    nick.transaction.push(objtra);
                } else {
                    return 2; //개수가 많음
                }
            }
        }
        await users.save();
        await nick.save();

        return 1; //완료
    } else {
        return 3; // 회원정보 틀림
    }
}


module.exports.BuyFunc = async function (Name,selectcoin, coinQuantity, coinvalue) {

    const users = (await User.findUser(Name)).Userwallet
    const nick = (await User.findUser(Name)).UserTransaction
    let state = true
    if (users != null || nick != null) {
        if (users.Money > coinvalue * coinQuantity) {
            for (let i = 0; i < users.holdCoin.length; i++) {
                if (users.holdCoin[i].coinName == selectcoin) {//구매한 코인이 지갑에 있다면
                    /*
                    평균 단가 = 
                    (기준 매수 수량 * 기존 단가) + (추가 매수 수량 * 매수 가격)
                    / (기존 매수 수량 + 추가 매수 수량)
                    */
                    //users.holdCoin[i].coinQuantity += 5
                    users.holdCoin[i].coinBuyPrice =
                        (users.holdCoin[i].coinQuantity * users.holdCoin[i].coinBuyPrice
                            + coinQuantity * coinvalue) / (users.holdCoin[i].coinQuantity + coinQuantity)
                    console.log(users.holdCoin[i].coinBuyPrice)
                    users.holdCoin[i].coinQuantity += coinQuantity //수정해야함
                    state = false
                }
            }
            if (state) {
                let object = new Object
                object.coinName = selectcoin
                object.coinQuantity = coinQuantity
                object.coinBuyPrice = coinvalue
                users.holdCoin.push(object)
            }
            let objtra = new mongo.pushtransaction("매수", selectcoin, coinQuantity, coinvalue)
            console.log(objtra)
            nick.transaction.push(objtra)
            users.Money -= coinvalue * coinQuantity
            await users.save()
            await nick.save()

            return 1 //완료
        }
        else {
            return 2
        }
    }
    else {
        return 3
    }
}

module.exports.GetholdCoinAsync = async (name) => {
    try {
        await mongo.connectDB()
        const userWallet = await mongo.userWallet.findOne({ Username: name })
        let coinArray = userWallet.holdCoin;
        let totalMoney = userWallet.Money;
        let holdMoney = userWallet.Money;
        let startMoney = userWallet.startMoney;
        for (let i = 0; i < userWallet.holdCoin.length; i++) {
            totalMoney += userWallet.holdCoin[i].coinQuantity * userWallet.holdCoin[i].coinBuyPrice;
        }
        return {
            coinArray: coinArray,
            totalMoney: totalMoney,
            holdMoney: holdMoney,
            startMoney: startMoney,
        };
    } catch (error) {
        console.error(error);
        return {
            coinArray: [],
            totalMoney: 0,
            holdMoney: 0,
            startMoney: 0,
        };
    } finally {
        await mongo.closeDB()
    }
  }
  


/**
 * 
 * @param {String} name 
 * @param {Number} Money 
 */
module.exports.AddMoney = async function(name,Money){
    const UserWallet = (await User.findUser(name)).Userwallet
    UserWallet.Money += Money
    await UserWallet.save()
    return "Complete"
}