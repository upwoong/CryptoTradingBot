const express = require('express')
    , path = require('path')
const expressHandlebars = require('express-handlebars')
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const fs = require('fs');
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(
    async function (username, password, done) {
        const User = (await UserModel.findUser(req.body.id, req.body.pw, true)).User

        if (!User) {
            return done(null, false)
        }
        if (!User) {

        }
    }
))
app.use(cors({
    origin: true,
    credentials: true
}))
const process = require('process')
process.setMaxListeners(15);
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

const port = process.env.PORT || 8006
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
let router = express.Router()
app.use('/', router)
const jwt = require("jsonwebtoken");
const uuidv4 = require("uuid/v4");

const payload = {
    access_key: "Foj5SxotcvxxVVEvHOAaxZ8NJya2pJmFd4sWLO4ky",
    nonce: uuidv4(),
};
const jwtToken = jwt.sign(payload, "wDSyn3uhGxbqSUK3neR5hzLnX8TrI7dcUKW6pJaL");
const authorizationToken = `Bearer ${jwtToken}`;
//app.disable('x-powered-by'); 혹시 모르니깐 납둠

const mongo = require("./script/mongo")

let krName = new Array()
let rsiList = new Array()
const getRSI = require('./script/RsiFunc')
const CoinFunc = require('./script/CoinFunc')
const UserModel = require("./script/User")

init() //초기설정
async function init() {
    const CallFetch = await fetch(`https://api.upbit.com/v1/market/all?isDetails=false`)
    const body = await CallFetch.json()
    for (let i = 0; i < body.length; i++) {
        rsiList.push(body[i].market)
        krName.push(body[i].korean_name)
    }

}

function getUserNameFromCookie(req) {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, 'secret_key');
    const userName = decoded.username;
    console.log(userName)
    return userName;
  }

const bcrypt = require('bcrypt');



app.post('/SignIn', async (req, res) => {
    const { id, pw } = req.body;
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
});

function verifyToken(req, res, next) {
    // 쿠키에서 토큰 추출
    const token = req.cookies.token;

    // 토큰이 없으면 인증 실패 처리
    if (!token) {
        return res.redirect('SignIn')
    }
    console.log("123123")
    console.log(token)
    try {
        // 토큰 검증
        const verified = jwt.verify(token, 'secret_key');
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}

app.post('/stopm', verifyToken, async function (req, res) {
    let stopmacro = await require(`./macrofolder/${getUserNameFromCookie(req)}.js`)
    stopmacro.stopclock()
    await fs.unlinkSync(`cpt/macrofolder/${getUserNameFromCookie(req)}.js`, (err) => {
        console.log("delete")
    })
    await mongo.closeDB()
    res.redirect('MockInvestment/BTCKRW')
})


app.post('/startmacro', verifyToken, async function (req, res) {
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

app.post('/buycoinFunc', verifyToken, async function (req, res) {
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


app.post('/sellcoinFunc', verifyToken, async function (req, res) {
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
app.post('/AddMoney', verifyToken, async (req, res) => {
    CoinFunc.AddMoney(getUserNameFromCookie(req), req.body.Money)
    res.redirect("CoinWallet")
})

app.post('/SignUp', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.pw, 10);
    await UserModel.createUser(req.body.id, hashedPassword, req.body.name, req.body.startday)
    try {
        res.send('User created');
    } catch (err) {
        console.log(err);
        res.status(400).send('Username already exists');
    }
});

app.get('/signin', function (req, res) {
    res.render('SignIn')
})

app.get('/signup', function (req, res) {
    res.render('SignUp')
})

app.get('/MockInvestment/:coin', function (req, res) {
    let coin = req.params.coin
    if (coin == null) { coin = "BTC" }
    res.render('MockInvestment', { krname: krName, market: rsiList, coin: coin })

})

app.get('/InvestmentDetails', verifyToken, async function (req, res) {
    try {
        const transaction = await UserModel.getInvestmentDetails(getUserNameFromCookie(req))
        console.log(transaction)
        res.render('InvestmentDetails', { transaction })

    } catch (err) {
        console.error(err)
        res.status(500).send('Error getting investment details')
    }
})

app.get('/api/data', async (req, res) => {
    const RsiList = await getRSI.showListBelow30Percent(rsiList)
    res.json(RsiList)
});

app.get('/CoinWallet', verifyToken, async function (req, res) {
    let returnvalue = await CoinFunc.GetHoldCoin(getUserNameFromCookie(req));
    res.render('CoinWallet', {
        CoinWallet: returnvalue.CoinArray,
        TotalMoney: returnvalue.TotalMoney,
        HoldMoney: returnvalue.HoldMoney,
        StartMoney: returnvalue.StartMoney,
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

async function startServer() {
    try {
        await mongo.connectDB();
        app.listen(port, () => {
            console.log(`서버 시작: http://localhost:${port}`);

        });
        /*
            axios.post('http://localhost:8006/SignIn', {
                username: '123as',
                password: 'testpassword',
              }).then((res) => {
                console.log(res.data);
              }).catch((err) => {
                console.log("err");
              });
              */
    } catch (err) {
        console.error('서버 시작 중 오류 발생:', err);
    }
}

startServer();

