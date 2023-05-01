const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ahlcp.mongodb.net/${process.env.DB_REPO}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
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
