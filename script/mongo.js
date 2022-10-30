const mongoose = require('mongoose');
const { drawdown } = require('ta.js');
mongoose.connect('mongodb+srv://upwoong:ehdrhd12@cluster0.ahlcp.mongodb.net/cpt?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
//mongoose.set('useCreateIndex', true) 지금 버전에선 필요없다함 삭제
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("mongo db connection OK.");
})

const useraccount = new mongoose.Schema({
    Birthday : String,
    Username: String,
    Id : String,
    password: String
})

const userwallet = new mongoose.Schema({
    Username: String,
    Money: Number,
    buycooltime : String,
    Holdcoin: [{
        coinname: String, //코인이름
        coinquantity: Number, //보유수량
        coinbuyprice: Number, //구매가격
        //coincurrentprice : String //현재가격 //일단 아직 필요없을듯
    }]
})
const usermacrocooltime = new mongoose.Schema({
    coinname: String,
    status: String,
    buycooltime: String,
    sellcooltime: String
})
const usertransaction = new mongoose.Schema({
    Username: String,
    transaction: [{
        Date: String,
        kind: String,
        coinname: String,
        coinquantity: Number,
        coinbuyprice: Number,
    }]
})

module.exports.User = mongoose.model('users', useraccount)
module.exports.Userwallet = mongoose.model('userwallet', userwallet)
module.exports.Usermacrocooltime = mongoose.model('usermacrocooltime', usermacrocooltime)
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
    constructor(kind, coinname, coinquantity, coinbuyprice) {
        this.Date = new Date();
        this.kind = kind;
        this.coinname = coinname;
        this.coinquantity = coinquantity;
        this.coinbuyprice = coinbuyprice;
    }
}
