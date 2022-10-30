const express = require('express')
    , path = require('path')
const expressHandlebars = require('express-handlebars')
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let server = require('http').createServer(app);
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
app.use(cors({
    origin: true,
    credentials: true
}))
process.setMaxListeners(15);

const port = process.env.PORT || 8001
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
let bbb = ""
const jwtToken = jwt.sign(payload, "wDSyn3uhGxbqSUK3neR5hzLnX8TrI7dcUKW6pJaL");
const authorizationToken = `Bearer ${jwtToken}`;

const ta = require('ta.js');

const mongo = require("./script/mongo")
const Sellcoin = require("./script/Sellcoin")
//mongoose.set('useFindAndModify', false); //fineOneandupdate 사용하기 위한 구문 지금버전에선 필요없다함 삭제
let options = {
    method: 'GET',
    url: 'https://api.upbit.com/v1/candles/minutes/1?market=KRW-BTC&count=28',
    headers: { Accept: 'application/json' }
};

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

server.listen(port, () => console.log(
    `Express started on http://localhost:${port}; ` +
    `press Ctrl-C to terminate.`)
)
  /*
Userwallet.findOneAndUpdate({ Username: "aaa" }, { //코인지갑에 개수 저장  
$addToSet: {
Holdcoin: {
  coinname: "qqqq",
  coinquantity: 5,
  coinbuyprice: coinvalue
}
},
}, function (err, data) {
if (err) console.log(err)
console.log("추가완료")
})
*/