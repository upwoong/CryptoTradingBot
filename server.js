require('dotenv').config({ path: './config.env' });

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
const jwt = require("jsonwebtoken");
//app.disable('x-powered-by'); 혹시 모르니깐 납둠

const mongo = require("./script/mongo")

let krName = new Array()
let rsiList = new Array()
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

module.exports = {
    verifyToken : verifyToken,
    getUserNameFromCookie : getUserNameFromCookie,
    krName : krName,
    rsiList : rsiList
}
let routes = require('./router')
app.use('/',routes.router)
startServer();
