const getjs = require('../script/RsiFunc')
const CoinFunc = require('../script/CoinFunc')
const User = require('../script/User')
const { startmacro } = require('./123as')
let colltime = true
module.exports.boolean = false
module.exports.func123 = function (Name, CoinName, buypoint, sellpoint) {
    let startmacro = setInterval(async function () {
        let coinquantity
        if (!module.exports.boolean) { //stop and macro
            const response = await fetch(`https://api.upbit.com/v1/candles/minutes/60?market=KRW-BTC&count=28`)

            const body = await response.json()
            const coinvalue = body[body.length - 1].trade_price

            let CurrentPriceArray = new Array()
            for (let i = 0; i < body.length; i++) {
                CurrentPriceArray.push(body[i].trade_price)
            }
            if (colltime) {
                colltime = false
                //살때
                if (getjs.getRSIA(CurrentPriceArray).RSI < buypoint) {
                    let totalAssets = (await UserModel.findUser("123we")).Userwallet.Holdcoin.find(item => item.coinname === Name).coinbuyprice * 0.1
                    coinquantity = totalAssets / coinvalue
                    await CoinFunc.BuyFunc(Name, CoinName, coinquantity, coinvalue)
                } else if (getjs.getRSIA(CurrentPriceArray).RSI > sellpoint) {
                    let totalAssets = (await UserModel.findUser("123we")).Userwallet.Holdcoin.find(item => item.coinname === Name).coinquantity
                    coinquantity = 2 / totalAssets
                    await CoinFunc.SellFunc(Name, CoinName, coinquantity, coinvalue)
                }
                setTimeout(() => changef(), 10000)
            }
        } else {
            clearInterval(startmacro)
        }
    }, 1000);
}
function changef() {
    colltime = true
}
