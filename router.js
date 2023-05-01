const router = require('express').Router()
const fs = require('fs')
const { verifyToken, getUserNameFromCookie, krName, rsiList } = require('./server');
const jwt = require("jsonwebtoken");

const mongo = require("./script/mongo")
const UserModel = require("./script/User")
const getRSI = require('./script/RsiFunc')
const CoinFunc = require('./script/CoinFunc')
const bcrypt = require('bcrypt');
router.post('/SignIn', async (req, res) => {
    const { id, pw } = req.body
    const user = (await UserModel.findUser(id,pw)).User
    if (!user) {
        return res.status(404).send('User not found');
    }
   
    const isMatch = await bcrypt.compare(pw, user.Password);
    if (!isMatch) {
        return res.send(`<script>alert('유저 없음');location.href='SignIn';</script>`);
    }

    const token = jwt.sign({ username: user.userName }, 'secret_key');
    res.cookie('token', token, { httpOnly: true })
    res.redirect("MockInvestment/BTCKRW")
})
router.post('/stopm', verifyToken, async (req, res) => {
  try {
    let stopmacro = await require(`./macrofolder/${getUserNameFromCookie(req)}.js`)
    stopmacro.stopclock()
    await fs.unlinkSync(`cpt/macrofolder/${getUserNameFromCookie(req)}.js`, (err) => {
      console.log("delete")
    })
    await mongo.closeDB()
    res.redirect('MockInvestment/BTCKRW')
  } catch (err) {
    console.log(err)
  }
});

router.post('/startmacro', verifyToken, async function (req, res) {
    const coinName = req.body.kind
    const Name = getUserNameFromCookie(req)  //닉네임
    const buypoint = req.body.buypoint //매수지점
    const sellpoint = req.body.sellpoint //매도지점
    mongo.connectDB()
    console.log("실행중")
    await fs.writeFile(`cpt/macrofolder/${Name}.js`, `const getjs = require('../script/RsiFunc')
    const CoinFunc = require('../script/CoinFunc')
    const User = require('../script/User')
    let colltime = true
    module.exports.boolean = false

      let coinQuantity = 0
      let startmacro = async function (Name, coinName, buypoint, sellpoint) {
        const response = await fetch(\`https://api.upbit.com/v1/candles/minutes/60?market=KRW-BTC&count=28\`)
    
        const body = await response.json()
        const coinvalue = body[body.length - 1].trade_price
    
        let CurrentPriceArray = new Array()
        for (let i = 0; i < body.length; i++) {
          CurrentPriceArray.push(body[i].trade_price)
        }
        if (colltime) {
          colltime = false
          const UserWallet = (await UserModel.findUser(Name)).Userwallet
          //const coinQuantity = UserWallet.Money / coinvalue 
          if (getjs.getRSI(CurrentPriceArray).RSI < buypoint) {
            let totalAssets = (await UserModel.findUser("123we")).Userwallet.holdCoin.find(item => item.coinName === Name).coinbuyprice * 0.1
            coinQuantity = totalAssets / coinvalue
            await CoinFunc.BuyFunc(Name, coinName, coinQuantity, coinvalue)
          } else if (getjs.getRSI(CurrentPriceArray).RSI > sellpoint) {
            let totalAssets = (await UserModel.findUser("123we")).Userwallet.holdCoin.find(item => item.coinName === Name).coinQuantity
            coinQuantity = 2 / totalAssets
            await CoinFunc.SellFunc(Name, coinName, coinQuantity, coinvalue)
          }
          setTimeout(() => changef(), 10000);
        }
      }
      let timeId= null
      function start(Name, coinName, buypoint, sellpoint){
        startmacro(Name, coinName, buypoint, sellpoint)
        timeId = setTimeout(() => {
          start(Name, coinName, buypoint, sellpoint)
        }, 1000);
      }
      function stopclock(){
        if(timeId != null) clearTimeout(timeId)
        console.log("stop")
      }
      module.exports = {
        start,
        stopclock
      }
    function changef() {
      colltime = true
    }
        `, async err => {
        if (err) {
            console.error(err);
            res.status(500).send('Error creating file');
        } else {
            getjs = await require(`./macrofolder/${Name}.js`)
            setTimeout(() => {
                getjs.start(Name, coinName, buypoint, sellpoint)
            }, 1000);
        }
    });
    res.redirect('MockInvestment/BTCKRW')
})

router.post('/buycoinFunc', verifyToken, async function (req, res) {
    const selectcoin = req.body.coin.replace("KRW", "-KRW").split('-').reverse().join('-');
    const coinQuantity = Number(Number(req.body.coinQuantity).toFixed(4))
    const pay = Number(Number(req.body.pay).toFixed(4))
    console.log(selectcoin)
    console.log(coinQuantity)
    if (!selectcoin || !coinQuantity) {
        return res.send(`<script>alert('빈 공간이 있습니다.');location.href='MockInvestment/${req.body.coin}';</script>`);
    }
    try {
        const asyncvalue = await CoinFunc.BuyFunc(getUserNameFromCookie(req), selectcoin, coinQuantity, pay);
        switch (asyncvalue) {
            case 1:
                console.log("정상적인 완료");
                return res.send(`<script>alert('완료');location.href='MockInvestment/${req.body.coin}';</script>`);
            case 2:
                console.log("개수가 많음");
                return res.send(`<script>alert('개수가 너무 많습니다.');location.href='MockInvestment/${req.body.coin}';</script>`);
            default:
                console.log("회원정보 틀림");
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send(`<script>alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');location.href='MockInvestment/${req.body.coin}';</script>`);
    }
})


router.post('/sellcoinFunc', verifyToken, async function (req, res) {
    const selectcoin = req.body.coin.replace("KRW", "-KRW").split('-').reverse().join('-');
    const coinQuantity = Number(Number(req.body.coinQuantity).toFixed(4))
    const pay = Number(Number(req.body.pay).toFixed(4))
    if (!selectcoin || !coinQuantity) {
        return res.send(`<script>alert('빈 공간이 있습니다.');location.href='MockInvestment/${req.body.coin}';</script>`);
    }
    try {
        const asyncvalue = await CoinFunc.SellFunc(getUserNameFromCookie(req), selectcoin, coinQuantity, pay);
        switch (asyncvalue) {
            case 1:
                console.log("정상적인 완료");
                return res.send(`<script>alert('완료');location.href='MockInvestment/${req.body.coin}';</script>`);
            case 2:
                console.log("개수가 많음");
                return res.send(`<script>alert('개수가 너무 많습니다.');location.href='MockInvestment/${req.body.coin}';</script>`);
            default:
                console.log("회원정보 틀림");
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send(`<script>alert('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');location.href='MockInvestment/${req.body.coin}';</script>`);
    }
});
router.post('/AddMoney', verifyToken, async (req, res) => {
    CoinFunc.AddMoney(getUserNameFromCookie(req), req.body.Money)
    res.redirect("CoinWallet")
})

router.post('/SignUp', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.pw, 10);
    await UserModel.createUser(req.body.id, hashedPassword, req.body.name, req.body.startday)
    try {
        res.send('User created');
    } catch (err) {
        console.log(err);
        res.status(400).send('Username already exists');
    }
});

router.get('/signin', function (req, res) {
    res.render('SignIn')
})

router.get('/signup', function (req, res) {
    res.render('SignUp')
})

router.get('/MockInvestment/:coin', function (req, res) {
    let coin = req.params.coin
    if (coin == null) { coin = "BTC" }
    res.render('MockInvestment', { krname: krName, market: rsiList, coin: coin })

})

router.get('/InvestmentDetails', verifyToken, async function (req, res) {
    try {
        const transaction = await UserModel.getInvestmentDetails(getUserNameFromCookie(req))
        console.log(transaction)
        res.render('InvestmentDetails', { transaction })

    } catch (err) {
        console.error(err)
        res.status(500).send('Error getting investment details')
    }
})

router.get('/api/data', async (req, res) => {
    const RsiList = await getRSI.showListBelow30Percent(rsiList)
    res.json(RsiList)
});

router.get('/CoinWallet', verifyToken, async function (req, res) {
    let returnvalue = await CoinFunc.GetHoldCoin(getUserNameFromCookie(req));
    res.render('CoinWallet', {
        coinWallet: returnvalue.coinArray,
        totalMoney: returnvalue.totalMoney,
        holdMoney: returnvalue.holdMoney,
        startMoney: returnvalue.startMoney,
    });
});

module.exports ={
    router : router
}