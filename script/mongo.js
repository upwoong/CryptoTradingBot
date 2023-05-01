const mongoose = require('mongoose');
const  bcrypt = require('bcrypt')
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://upwoong:ehdrhd12@cluster0.ahlcp.mongodb.net/cpt?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("mongo db connection OK.");
    return mongoose.connection;
  } catch (error) {
    console.error(error);
  }
};

const closeDB = async () => {
    try {
        await mongoose.connection.close(function () {
            console.log('Mongoose connection disconnected');
          });
    } catch (error) {
      console.error(error);
    }
  };


/**
 * 1.회원가입 진행시 useraccount에 저장, 그리고 userwallet, usertransaction에도 Username이 담긴 데이터 저장
 * 2.로그인시 useraccount Id,password의 정보가 맞는지 확인 후, 로그인
 * 3.매수 및 매도 진행시 userwallet에 현재 금액(Money)에 반영하고 Holdcoin(지갑)에 내용 반영
 * 3-1) 또한 동시에 usertransaction에 현재 정보를 추가하여 투자내역을 보여줌
 * Holdcoin 역할 : 매수 및 매도 진행시 본인 지갑에 동일한 이름의 코인이 있을시 그 코인의 보유 수량과 구매가격을 조정하고 지갑에 없다면 새로운 코인 추가
 * ex) 지갑에 krw-btc,krw-etc 가 있는데 krw-btc를 매수했다면 현재 지갑에 krw-btc가 있으니 그 데이터의 보유수량과 구매가격을 조정
 * 하지만 krw-doge를 매수했다면 현재 지갑에 krw-doge가 없으니 coinname이 krw-doge인 새로운 데이터 생성
 */
//유저 계정
const userAccountSchema = new mongoose.Schema({
    birthDay: String,
    userName: String,
    Id: String,
    Password: String
})
//코인 지갑
const userWalletSchema = new mongoose.Schema({
    userName: String,
    startMoney : Number,
    Money: Number,
    buyCooltime: String,
    holdCoin: [{
        coinName: String, //코인이름
        coinQuantity: Number, //보유수량
        coinBuyPrice: Number, //구매가격
    }]
})
//투자내역
const userTransactionSchema = new mongoose.Schema({
    userName: String,
    transaction: [{
        Date: String,
        Kind: String,
        coinName: String,
        coinQuantity: Number,
        coinBuyPrice: Number,
        priceReturn: String
    }]
})
userWalletSchema.index({Username : 1})
const User = mongoose.model('users', userAccountSchema)
const userWallet = mongoose.model('userwallet', userWalletSchema)
const userTransaction = mongoose.model('usertransaction', userTransactionSchema)

module.exports = {
  User, userWallet, userTransaction, connectDB,closeDB,userAccountSchema
}

/**
 * 거래내역 psuh함수
 * @param {String} username 
 * @param {String} Kind 
 * @param {String} coinname 
 * @param {String} coinquantity 
 * @param {String} coinbuyprice 
 */

module.exports.pushtransaction = class pushtransaction {
    constructor(Kind, coinName, coinQuantity, coinBuyPrice, pricereturn) {
        this.Date = new Date();
        this.Kind = Kind;
        this.coinName = coinName;
        this.coinQuantity = coinQuantity;
        this.coinBuyPrice = coinBuyPrice;
        this.pricereturn = pricereturn
    }
}
