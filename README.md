# CryptoTradingBot

## 프로젝트 목적
모의투자 시스템을 이용하여 실제 투자를 시작하기 전 경험해보기 위한 프로젝트입니다.
rsi(상대강도지수)를 이용한 자동매매 시스템으로 rsi지표 매매법이 얼만큼의 수익과 손해가 발생하는지도 측정할 수 있습니다.

* * *
## 사용된 기술 스택   
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=green"><img src="https://img.shields.io/badge/handlebars.js-000000?style=for-the-badge&logo=handlebars.js&logoColor=white"><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=Express&logoColor=white"><img src="https://img.shields.io/badge/mongoDB-47A248?style=for-the-badge&logo=mongoDB&logoColor=white"><img src="https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=HTML5&logoColor=white"><img src="https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=CSS3&logoColor=white"><img src="https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white">

* * *
## 설치 방법
**Node** [https://nodejs.org/ko/download](https://nodejs.org/ko/download)   
**mongoDB** [https://www.mongodb.com/)   

* * *
## 시작 방법
* git   
```git
git clone https://github.com/upwoong/CryptoTradingBot.git
```

* .env파일 생성
```env
DB_REPO='DB_REPOSITORY'
DB_USER='DB_USER'
DB_PASS='DB_PASSWORD'
```

* Node
```Node
node server.js
```

* * *
## 프로젝트 기여도
* 프론트 엔드
  * http 통신 (20%)
* 백엔드
  * API 설계 및 개발 (100%)

* * *
# 주요 API 문서

## /startmacro

### 매크로를 시작하는 API입니다.

### 'POST'
### **Request Body**
```json
{
  "kind": "[코인 종류]",
  "Nmae" : "[사용자]",
  "buypoint": "[매수 지점]",
  "sellpoint": "[매도 지점]"
}
```

## /buycoinFunc || /sellcoinFunc

### 코인(매매 or 매수) API입니다.

### 'POST'
### **Request Body**
```json
{
  "selectcoin": "[코인 종류]",
  "coinQuantity" : "[수량]",
  "pay": "[가격]"
}
```

## /showListBelow30Percent

### RSI가 30%이하인 코인의 목록들을 가져옵니다.

### 'Get'
### **RESPONSE Body**
```json
{
  "coinList": "코인 리스트",
}
```

## /InvestmentDetails

### 사용자의 투자 내역을 보여줍니다.

### 'Get'
### **RESPONSE Body**
```json
{
  "Date": "매수/매매 날짜",
  "Kind" : "매수/매매"
  "coinName" : "코인종류",
  "coinQuantity" : "코인수량"
  "coinBuyPrice" : "가격"
  "priceReturn" : "수익"
}
```

## /CoinWallet

### 보유 코인목록과 현재 투자정보를 확인 가능합니다.

### 'Get'
### **RESPONSE Body**
```json
{
  "coinWallet" : "보유 코인의 [종류, 수량, 가격]",
  "totalMoney" : "총 수익",
  "holdMoney" : "보유 금액",
  "startMoney" : "시작 금액"
}
```
* * *

## 구현 기능
### 매수
- 코인의 매수를 진행할수 있습니다.
```javascript
    const selectcoin = req.body.coin.replace("KRW", "-KRW").split('-').reverse().join('-');
    const coinQuantity = Number(Number(req.body.coinQuantity).toFixed(4))
    const pay = Number(Number(req.body.pay).toFixed(4))
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
```

- 결과 화면
<p align="center"><img src="https://github.com/upwoong/CryptoTradingBot/blob/main/screenshots/buyCoin.png?raw=true" width="400"></p>

### 자동매매
- 매수 및 매도 구간을 설정하여 시작할수 있습니다.
```javascript
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
})
```   

- 결과 화면   
![tradingbot](https://github.com/upwoong/CryptoTradingBot/blob/main/screenshots/tradingbot.png)

### RSI 목록 출력
- RSI가 30%이하인 목록을 보여줍니다.
```javascript
    let rsiList = []
    let newList = []

    await waitAndDo(list.length)

    for (let i = 0; i < rsiList.length; i++) {
        if (rsiList[i].Rsi <= 30) {
            newList.push(rsiList[i].coinname)        
        }
    }
    if(!newList) newList.push("현재 30% 이하의 목록이 없습니다.")

    return newList

    async function waitAndDo(times) {
        if (times < 1) {
            return;
        }

        const coinName = list[times - 1]
        const response = await fetch(`https://api.upbit.com/v1/candles/minutes/60?market=${coinName}&count=28`)    
        const body = await response.json()
        let currentPriceArray = new Array()
        for(let i =0;i<body.length;i++){
            currentPriceArray.push(body[i].trade_price)
        }
        const object = {
            coinname: coinName,
            Rsi: getRSIA(currentPriceArray).RSI
        }

        rsiList.push(object)
        await wait(100)
        await waitAndDo(times - 1)
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
```

- 결과 화면   
![showListBelow30Percent](https://github.com/upwoong/CryptoTradingBot/blob/main/screenshots/showListBelow30Percent.png)

* * *

## 기여자
KKK : 프론트 엔드 구성 (80%)   

* * *
