const mongoose = require('mongoose');
const { drawdown } = require('ta.js');
mongoose.connect('mongodb+srv://upwoong:ehdrhd12@cluster0.ahlcp.mongodb.net/cpt?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
//mongoose.set('useCreateIndex', true) 지금 버전에선 필요없다함 삭제
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("mongo db connection OK.");
})

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
const useraccount = new mongoose.Schema({
    Birthday: String,
    Username: String,
    Id: String,
    password: String
})
//코인 지갑
const userwallet = new mongoose.Schema({
    Username: String,
    Money: Number,
    buycooltime: String,
    Holdcoin: [{
        coinname: String, //코인이름
        coinquantity: Number, //보유수량
        coinbuyprice: Number, //구매가격
    }]
})
//투자내역
const usertransaction = new mongoose.Schema({
    Username: String,
    transaction: [{
        Date: String,
        kind: String,
        coinname: String,
        coinquantity: Number,
        coinbuyprice: String,
        pricereturn: String
    }]
})

module.exports.User = mongoose.model('users', useraccount)
module.exports.Userwallet = mongoose.model('userwallet', userwallet)
module.exports.Usertransaction = mongoose.model('usertransaction', usertransaction)


/**
 * 거래내역 psuh함수
 * @param {String} username 
 * @param {String} kind 
 * @param {String} coinname 
 * @param {String} coinquantity 
 * @param {String} coinbuyprice 
 */

module.exports.pushtransaction = class pushtransaction {
    constructor(kind, coinname, coinquantity, coinbuyprice, pricereturn) {
        this.Date = new Date();
        this.kind = kind;
        this.coinname = coinname;
        this.coinquantity = coinquantity;
        this.coinbuyprice = coinbuyprice;
        this.pricereturn = pricereturn
    }
}
