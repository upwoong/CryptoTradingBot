const express = require('express')
    , path = require('path')
const expressHandlebars = require('express-handlebars')
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const crypto = require('crypto')
require('moment-timezone');
const cheerio = require('cheerio');
const moment = require('moment');
const request = require('request');
const schedule = require('node-schedule')
let multer = require('multer');
const fs = require('fs');
const xlsx = require("xlsx")
let server = require('http').createServer(app);
let io = require('socket.io')(server)
const cors = require('cors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
app.use(cors({
    origin: true,
    credentials: true
}))
process.setMaxListeners(15);
let Graphql = require('graphql')
const jwt = require('jsonwebtoken')
let GraphqlHttp = require('express-graphql').graphqlHTTP
//데이터베이스 초기설정
const mongoose = require('mongoose')
const { WSATYPE_NOT_FOUND } = require('constants')
const { response } = require('express')
const { next, first } = require('cheerio/lib/api/traversing')
const { constants } = require('http2');
const { domainToASCII } = require('url');

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


mongoose.connect('mongodb+srv://upwoong:ehdrhd12@cluster0.ahlcp.mongodb.net/workschedule?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.set('useCreateIndex', true)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("mongo db connection OK.");
})
mongoose.set('useFindAndModify', false); //fineOneandupdate 사용하기 위한 구문
//스키마생성
const adminuser = mongoose.Schema({
    name: String,
    password: String,
    department: String,
    position: String,
    overtime: String
})
const usingwater = new mongoose.Schema({
    Useage: Number,
    Year: String,
    Month: String,
    Day: String,
    Percent: String
})
const packchanjong = new mongoose.Schema({
    Date: String,
    workinghours: [{
        Date: String,
        hours: String
    }]
})
const 개발2팀 = new mongoose.Schema({
    name: String,
    Date: String,
    nfc: String,
    position: String,
    workinghours: [{
        Date: String,
        hours: String,
        Start: String,
        End: String
    }]
})
const 개발1팀 = new mongoose.Schema({
    name: String,
    Date: String,
    nfc: String,
    position: String,
    workinghours: [{
        Date: String,
        hours: String,
        Start: String,
        End: String
    }]
})
const 회계팀 = new mongoose.Schema({
    name: String,
    Date: String,
    nfc: String,
    position: String,
    workinghours: [{
        Date: String,
        hours: String,
        Start: String,
        End: String
    }]
})
const 행정팀 = new mongoose.Schema({
    name: String,
    Date: String,
    nfc: String,
    position: String,
    workinghours: [{
        Date: String,
        hours: String,
        Start: String,
        End: String
    }]
})
const 메이커스페이스팀 = new mongoose.Schema({
    name: String,
    Date: String,
    nfc: String,
    position: String,
    workinghours: [{
        Date: String,
        hours: String,
        Start: String,
        End: String
    }]
})
const 컨텐츠팀 = new mongoose.Schema({
    name: String,
    Date: String,
    nfc: String,
    position: String,
    workinghours: [{
        Date: String,
        hours: String,
        Start: String,
        End: String
    }]
})
const nfc = new mongoose.Schema({
    name: String,
    nfc: String,
    state: String,
    Date: String,
    Start: String,
    End: String,
    Department: String
})

const User = mongoose.model('users', adminuser)
const Water = mongoose.model('water', usingwater)
const Packchanjong = mongoose.model('packchanjong', packchanjong)
const 개발2팀1 = mongoose.model('개발2팀', 개발2팀)
const 개발1팀1 = mongoose.model('개발1팀', 개발1팀)
const 회계팀1 = mongoose.model('회계팀', 회계팀)
const 행정팀1 = mongoose.model('행정팀', 행정팀)
const 메이커스페이스팀1 = mongoose.model('메이커스페이스팀', 메이커스페이스팀)
const 컨텐츠팀1 = mongoose.model('컨텐츠팀', 컨텐츠팀)
const NFC = mongoose.model('nfc', nfc)

let videoProjection = {
    __v: false,
    _id: false,
    locations: false
};

let imgProjection = {
    __v: false,
    _id: false,
    comment: {
        __v: false,
        _id: false
    }
};
const port = process.env.PORT || 8003
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
}))
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))
app.set('views', __dirname + '/views')
// 라우터 사용하여 라우팅 함수 등록
let router = express.Router()
app.use('/', router)


let getnfc = ""
/*
true면 출근 한 상태
false면 퇴근
false - true 하면 근무시간

*/

/*
app.get('/dkatk', function (req, res) {
    let roqkf2commentarray = new Array()
    Client.find(function (err, data) {
        for (let index = 0; index < data.length; index++) {
            if (data[index].name == "박찬종") {
                for (let i = 0; i < data[index].comment.length; i++) {
                    let object = new Object()
                    object.name = data[index].comment[i].username
                    object.text = data[index].comment[i].text
                    object.Date = data[index].comment[i].Date
                    roqkf2commentarray.push(object)
                }
                console.log(roqkf2commentarray)
                res.render('dkatk', { layout: null, roqkf2commentarray: roqkf2commentarray })
            }
        }
    })
})
*/

/*
app.post('/addcomment', (req, res) => {
    const todayDay = moment().format("DD")
    const todayMonth = moment().format("MM")
    Client.updateOne({ 'name': '박찬종' }, { $push: { comment: { 'text': req.body.commentText, 'username': "관리자", "Date": todayMonth + todayDay } } }, function (err) {
        if (err) {
            console.log(err)
            return;
        }

        console.log('댓글 추가 완료 ');
        res.redirect('dkatk')
    });
});


*/
//매일 오전6시에 실행
let j = schedule.scheduleJob("0 0 6 * * *", function () {
    luncharray = new Array()
    dinnerarray = new Array()
    NFC.find({}, function (err, data) {
        for (let index = 0; index < data.length; index++) {
            data[index].state = "true"
        }
    })
    const array = [개발1팀1, 개발2팀1, 회계팀1, 메이커스페이스팀1, 컨텐츠팀1]
    for (let index = 0; index < array.length; index++) {
        let select = array[index]
        select.find({}, function (err, data) {
            const todaya = moment().format('YYYY-MM')
            const todayb = moment().subtract(1, 'd').format('DD') //오전 6시 기준 어제
            for (let index = 0; index < data.length; index++) {
                if (data[index].Date == todaya) {
                    for (let i = 0; i < data[index].workinghours.length; i++) {
                        if (data[index].workinghours[i].Date == todayb) {
                            if (data[index].workinghours[i].Start == "" && data[index].workinghours[i].End == "") {
                                data[index].workinghours[i].End = "None"
                            }
                            if (data[index].workinghours[i].Start != "" && data[index].workinghours[i].End == "") {
                                data[index].workinghours[i].End = "19:00"
                                data[index].workinghours[i].hours = "8"
                            }
                        }
                    }
                }
                data[index].save(function (err) {
                    if (err) {
                        console.error(err)
                        return
                    }
                })
            }
        })
    }
})
//매달 1일
let k = schedule.scheduleJob("0 0 0 1 * *", function () {
    const array = [개발1팀1, 개발2팀1, 회계팀1, 메이커스페이스팀1, 컨텐츠팀1]
    for (let arrayindex = 0; arrayindex < array.length; arrayindex++) {
        let select = array[arrayindex]


        let lastMonth = moment().subtract(1, 'M').format('YYYY-MM')
        let today = moment().format('YYYY-MM')
        select.find({ 'Date': lastMonth }, function (err, data) {
            let plustime = 0.0
            for (let index = 0; index < data.length; index++) {
                plustime = 0.0
                for (let i = 0; i < data[index].workinghours.length; i++) {
                    plustime += parseFloat(data[index].workinghours[i].hours)
                }
                plustime = plustime - roqkf2totaltime
                NFC.findOneAndUpdate({ 'name': data[index].name }, { $set: { 'overtime': plustime } }, (err, data) => {
                    if (err) console.log(err)
                    else console.log("수정완료")
                })
            }
        })

        select.find({}, function (err, data) {
            for (let index = 0; index < data.length; index++) {
                const plusMonth = new select({ 'name': data[index].name, 'nfc': data[index].nfc, 'Date': today, 'position': data[index].position })
                plusMonth.save(function (err, slience) {
                    if (err) {
                        console.log(err)
                        res.status(500).send('update error')
                        return
                    }
                    return console.log("complete")
                })
            }
        })
        //6달전것들은 모두 삭제
        select.deleteMany({ 'Date': moment().subtract(6, 'M').format('YYYY-MM') }, function (err, data) {
            if (err) console.log(err)
            else console.log("삭제완료")
        })
    }
})

// console.log(moment().subtract(3, 'M').format('YYYY-MM'))
let dlatladay = moment().format('DD')
let today = moment()
let nextday = today.add(1, 'days')
app.get('/nfc_recieve', function (req, res) {
    getnfc = req.query.id
    currenthours = ""

    let currentYear = moment().format('YYYY-MM')
    let currentDay = moment().format('DD')
    let workinghours
    let writeuser

    if (moment().format('mm') <= 15) {
        currenthours = (moment().format('YYYY-MM-DD:HH:') + "00")
    }
    else if (moment().format('mm') > 15 && moment().format('mm') < 45) {
        currenthours = (moment().format('YYYY-MM-DD:HH:') + "30")
    }
    else if (moment().format('mm') >= 45) {
        currenthours = (moment().add(1, 'hours').format('YYYY-MM-DD:HH:') + "00")
    }


    NFC.find({ 'nfc': getnfc }, function (err, data) {
        if (data != "") {
            if (data[0].state == "true") {
                NFC.findOneAndUpdate({ 'nfc': getnfc }, { $set: { 'state': "false", 'Start': currenthours } }, (err, data) => {
                    if (err) console.log(err)
                    else console.log("출근 완료")
                })
            }
            else if (data[0].state == "false") {
                NFC.findOneAndUpdate({ 'nfc': getnfc }, { $set: { 'state': "End", 'End': currenthours } }, (err, data) => {
                    if (err) console.log(err)
                    else {
                        if (data.Department == "개발2팀") {
                            writeuser = 개발2팀1
                        }
                        if (data.Department == "개발1팀") {
                            writeuser = 개발1팀1
                        }
                        if (data.Department == "회계팀") {
                            writeuser = 회계팀1
                        }
                        if (data.Department == "행정팀") {
                            writeuser = 행정팀1
                        }
                        if (data.Department == "메이커스페이스팀") {
                            writeuser = 메이커스페이스팀1
                        }
                        if (data.Department == "컨텐츠팀") {
                            writeuser = 컨텐츠팀1
                        }
                        console.log("퇴근 완료")
                        let Start1arr = (data.Start).split("-")
                        let Start2arr = (Start1arr[2]).split(":")
                        let Starttime = new Date(Start1arr[0], Start1arr[1], Start1arr[0], Start2arr[1], Start2arr[2])

                        let End1arr = currenthours.split("-")
                        let End2arr = (End1arr[2]).split(":")
                        let Endtime = new Date(End1arr[0], End1arr[1], End1arr[0], End2arr[1], End2arr[2])


                        let workinghours = (Endtime.getTime() - Starttime.getTime()) / 1000 / 60 / 60
                        /*
                        let workinghours1 = workinghours.split(":")
                        if(workinghours1[1] == "30") {
                            workinghours1[1] = "50"
                        }
                        let workinghours2 = workinghours1[0]+":"+workinghours1[1]
                        */
                        console.log("현재시간" + currenthours)
                        console.log("종료 : " + Endtime)
                        console.log("시작 : " + Starttime)
                        console.log("계산 : " + workinghours)
                        //휴게시간 빼기

                        if (Start2arr[1] < 12 && End2arr[1] >= 21) {
                            workinghours = workinghours - 2
                        }
                        if (Start2arr[1] < 12 && End2arr[1] >= 20) {
                            workinghours = workinghours - 1
                        }
                        writeuser.updateOne({ 'nfc': getnfc, 'Date': currentYear }, {
                            $push: {
                                workinghours: {
                                    'Date': currentDay, 'hours': workinghours, 'Start': Start2arr[1] + ":" + Start2arr[2],
                                    'End': End2arr[1] + ":" + End2arr[2]
                                }
                            }
                        }, function (err, data) {
                            if (err) console.log(err)
                            console.log("추가완료")
                        })
                    }
                })
            }
            else if (data[0].state == "End") {
                console.log("이미 오늘 출퇴근을 완료하였습니다.")
            }
        } else {
            console.log(getnfc)
            console.log("등록되어있지 않는 nfc카드입니다.")
        }
    })
    io.emit('getnfc', getnfc)
    res.render('sub', { layout: null })
})


app.get('/login', function (req, res) {
    res.render('login', { layout: null })
})
//페이지 입장시 보이는 로그인페이지
app.get('/', function (req, res) {
    res.render('login', { layout: null })
})
/*
변경 필요
render부분을 department의 값에 따라 다르게 다른 페이지 표시
*/
app.post('/main', (req, res) => {
    //User 컬렉션에서 입력한 아이디와 패스워드를 찾아서 있으면 로그인하고 없으면 에러를 표시한다.
    User.findOne({ name: req.body.name, password: req.body.password }, (err, user) => {
        if (err) return res.status(500).send({ message: '에러!' });
        else if (user) {
            //세션을 생성한다.
            req.session.logindata =
            {
                id: req.body.name,
                password: req.body.password,
                position: user.position,
                department: user.department,
                authorized: true
            }
            //세션을 저장한다.
            req.session.save(err => {
                if (err) console.log(err)
            })
            console.log(req.session)
            if (user.department == "개발2팀") {
                res.redirect('develop2')
            }
            if (user.department == "개발1팀") {
                res.redirect('develop1')
            }
            if (user.department == "회계팀") {
                res.redirect('account')
            }
            if (user.department == "행정팀") {
                res.redirect('administr')
            }
            if (user.department == "메이커스페이스팀") {
                res.redirect('making')
            }
            if (user.department == "컨텐츠팀") {
                res.redirect('contents')
            }
        }
        else return res.status(404).send({ message: '유저 없음!' });
    });
});


//관리자 아이디 수정 페이지
app.get('/modifyid', function (req, res) {
    res.render('modifyid', { layout: null })
})

//관리자 아이디 수정 post
app.post('/modifyid', function (req, res) {
    const name = req.body.name
    const password = req.body.password
    const repassword = req.body.repassword

    //User컬렉션에서 입력한 아이디와 패스워드를 찾는다.
    User.findOne({ name: name, password: password }, (err, users) => {
        //아이디가 있다면 패스워드를 새로 바꿀 패스워드로 변경한다.
        if (users != null) {
            users.password = repassword
            users.save(function (err) {
                if (err) {
                    console.error(err);
                    res.json({ result: 0 });
                    return;
                }
            })
        }
        else {
            console.log('회원 정보가 맞지 않습니다.')
        }
    })
    res.render('develop2')
})

app.get('/shownfccode', function (req, res) {
    let department = ["개발1팀", "개발2팀", "컨텐츠팀", "메이커스페이스팀", "행정회계팀"]
    let position = ["부소장", "팀장", "팀원"]
    res.render('shownfccode', { layout: null, department: department, position: position })
})

app.post('/plusnfccard', function (req, res) {
    const name = req.body.name
    const department = req.body.department
    const position = req.body.position
    const nfccode = req.body.nfccode
    let selectdepartment = ""
    const today = moment().format('YYYY-MM')


    switch (department) {
        case '개발2팀': selectdepartment = 개발2팀1
            break;
        case '개발1팀': selectdepartment = 개발1팀1
            break;
        case '행정팀': selectdepartment = 행정팀1
            break;
        case '회계팀': selectdepartment = 회계팀1
            break;
        case '컨텐츠팀': selectdepartment = 컨텐츠팀1
            break;
        case '메이커스페이스팀': selectdepartment = 메이커스페이스팀1
            break;

    }
    const nfcs = new NFC({ 'nfc': nfccode, 'state': "true", 'name': name, 'Start': "", 'End': "", 'Department': department })
    nfcs.save(function (err, slience) {
        if (err) {
            console.log(err)
            res.status(500).send('update error')
            return
        }
        return console.log("complete")
    })
    const plusdepartment = new selectdepartment({ 'name': name, 'nfc': nfccode, 'Date': today, 'position': position })
    plusdepartment.save(function (err, slience) {
        if (err) {
            console.log(err)
            res.status(500).send('update error')
            return
        }
        return console.log("complete")
    })
    const user = new User({ 'name': name, 'password': '1234', 'department': department, 'position': position, 'overtime': "0" })
    user.save(function (err, slience) {
        if (err) {
            console.log(err)
            res.status(500).send('update error')
            return
        }
        return console.log("complete")
    })

})

const luncharray = new Array()
const dinnerarray = new Array()
app.post('/lunch', function (req, res) {
    const lunch = req.body.lunch
    const dinner = req.body.dinner
    let state = true
    if (lunch) {
        for (let index = 0; index < luncharray.length; index++) {
            if (luncharray[index] == req.session.logindata.id) {
                state = false
            }
        }
        if (state) {
            luncharray.push(req.session.logindata.id)
        }
        else {
            console.log("이미 추가하였습니다")
        }
    }
    if (dinner) {
        for (let index = 0; index < dinnerarray.length; index++) {
            if (dinnerarray[index] == req.session.logindata.id) {
                state = false
            }
        }
        if (state) {
            dinnerarray.push(req.session.logindata.id)
        }
        else {
            console.log("이미 추가하였습니다")
        }
    }
    if (req.session.logindata.department == "개발2팀") {
        res.redirect('develop2')
    }
    if (req.session.logindata.department == "개발1팀") {
        res.redirect('develop1')
    }
    if (req.session.logindata.department == "회계팀") {
        res.redirect('account')
    }
    if (req.session.logindata.department == "메이커스페이스팀") {
        res.redirect('makerspace')
    }
    if (req.session.logindata.department == "컨텐츠팀") {
        res.redirect('contents')
    }
})



let roqkf2commentarray = new Array()
let roqkf2chdrmsan = ""
let roqkf2useworkhour = 0
let roqkf2user = ""
let roqkf2totaltime = 177
let roqkf2list = new Array()
let roqkf2changearray = new Array()
let roqkf2userviewmonth = new Array()
let roqkf2nameviewmonth = new Array()
let roqkf2overtime = new Array()
let roqkf2usertoday = moment().format('YYYY-MM')
let roqkf2nametoday = moment().format('YYYY-MM')
let roqkf2userovertime = 0
let roqkf2state = true
app.get('/develop2', function (req, res) {
    roqkf2list = new Array()
    roqkf2commentarray = new Array()
    roqkf2userviewmonth = new Array()
    roqkf2useworkhour = 0
    roqkf2needuseworkhour = 0
    roqkf2chdrmsan = 0
    roqkf2needchdrmsan = 0
    roqkf2overtime = new Array()
    개발2팀1.find(function (err, data) {

        for (let index = 0; index < data.length; index++) {

            if (!req.session.logindata) {
                return res.render('login', { layout: null })

            }
            else {
                //달 선택
                if (data[index].name == req.session.logindata.id) {
                    roqkf2userviewmonth.push(data[index].Date)
                }

                if (data[index].name == req.session.logindata.id && data[index].Date == roqkf2usertoday) {
                    roqkf2state = false


                    //팀장은 모든 팀원의 근무시간표를 볼 수 있음.
                    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
                        for (let index = 0; index < data.length; index++) {
                            let state = true
                            for (let i = 0; i < roqkf2list.length; i++) {
                                if (roqkf2list[i] == data[index].name) {
                                    state = false
                                    break
                                }
                            }
                            if (state) {
                                roqkf2list.push(data[index].name)
                            }

                        }
                    }

                    //근무표 생성

                    for (let i = 0; i < data[index].workinghours.length; i++) {

                        let object = new Object()
                        object.hours = data[index].workinghours[i].hours
                        object.Date = data[index].workinghours[i].Date
                        object.End = data[index].workinghours[i].End
                        object.Start = data[index].workinghours[i].Start
                        roqkf2useworkhour += parseFloat(data[index].workinghours[i].hours)
                        roqkf2commentarray.push(object)
                    }
                    //비어있으면 임시 값 저장
                    if (roqkf2commentarray == "") {
                        let object = new Object()
                        object.hours = "정보 없음"
                        object.Date = "정보 없음"
                        object.End = "정보 없음"
                        object.Start = "정보 없음"
                        roqkf2commentarray.push(object)
                        roqkf2useworkhour = 1
                    }
                    User.find({ 'department': req.session.logindata.department }, function (err, data) {
                        if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
                            for (let index = 0; index < data.length; index++) {
                                let object = new Object()
                                object.name = data[index].name
                                object.overtime = data[index].overtime
                                roqkf2overtime.push(object)
                            }
                        }
                    })
                    User.findOne({ 'name': req.session.logindata.id }, function (err, data) {
                        roqkf2userovertime = data.overtime
                    })

                    개발2팀1.find({}, function (err, data) {
                        for (let index = 0; index < data.length; index++) {
                            if (roqkf2user != "") {
                                if (data[index].name == roqkf2user) {
                                    let state = true
                                    for (let i = 0; i < roqkf2nameviewmonth.length; i++) {
                                        if (roqkf2nameviewmonth[i] == data[index].Date) {
                                            state = false
                                            break
                                        }
                                    }
                                    if (state) {
                                        roqkf2nameviewmonth.push(data[index].Date)
                                    }
                                    if (data[index].Date == roqkf2nametoday) {
                                        roqkf2changearray = new Array()
                                        for (let i = 0; i < data[index].workinghours.length; i++) {
                                            let object = new Object()
                                            object.hours = data[index].workinghours[i].hours
                                            object.Date = data[index].workinghours[i].Date
                                            object.End = data[index].workinghours[i].End
                                            object.Start = data[index].workinghours[i].Start
                                            roqkf2chdrmsan += parseFloat(data[index].workinghours[i].hours)
                                            roqkf2changearray.push(object)
                                        }
                                    }

                                }
                            }
                        }
                        roqkf2needuseworkhour = roqkf2useworkhour - roqkf2totaltime
                        roqkf2needchdrmsan = roqkf2chdrmsan - roqkf2totaltime

                        res.render('develop2', {
                             roqkf2commentarray: roqkf2commentarray, name: req.session.logindata.id, roqkf2chdrmsan: roqkf2chdrmsan, roqkf2list: roqkf2list,
                            roqkf2user: roqkf2user, roqkf2changearray: roqkf2changearray, roqkf2useworkhour: roqkf2useworkhour, roqkf2userviewmonth: roqkf2userviewmonth,
                            roqkf2needchdrmsan: roqkf2needchdrmsan, roqkf2needuseworkhour: roqkf2needuseworkhour, roqkf2overtime: roqkf2overtime, roqkf2userovertime: roqkf2userovertime,
                            roqkf2nameviewmonth: roqkf2nameviewmonth, luncharray: luncharray, dinnerarray: dinnerarray
                        })
                    })
                }
                //새로운 '월'로 넘어가서 1일이 되면 if문안에 있는 render가 작동안하기 때문에 넣은 검사코드


            }
        }
        if (roqkf2state) {
            res.render('develop2')
            roqkf2state = false
        }
    })

})

app.post('/roqkf2changerecord', function (req, res) {
    const name = req.body.name
    const today = moment().format('YYYY-MM')
    roqkf2usertoday = today
    roqkf2list = new Array()
    roqkf2changearray = new Array()
    개발2팀1.find(function (err, data) {
        for (let index = 0; index < data.length; index++) {
            if (data[index].name == name && data[index].Date == today) {
                roqkf2user = name
                if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
                    for (let index = 0; index < data.length; index++) {
                        roqkf2list.push(data[index].name)
                    }
                }
                for (let i = 0; i < data[index].workinghours.length; i++) {
                    let object = new Object()
                    object.hours = data[index].workinghours[i].hours
                    object.Date = data[index].workinghours[i].Date
                    object.End = data[index].workinghours[i].End
                    object.Start = data[index].workinghours[i].Start
                    roqkf2chdrmsan += parseFloat(data[index].workinghours[i].hours)
                    roqkf2changearray.push(object)
                }
                res.redirect('develop2')
            }
        }
    })
})

app.post('/roqkf2changermsan', function (req, res) {
    const name = req.body.name
    const commentText = req.body.commentText
    const Starttext = req.body.StartText
    let roqkf2arr = name.split("-")
    let textarr = commentText.split(":")
    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
        개발2팀1.findOne({ name: roqkf2user, 'Date': roqkf2arr[0] + "-" + roqkf2arr[1] }, (err, users) => {
            for (let index = 0; index < users.workinghours.length; index++) {
                if (users.workinghours[index].Date == roqkf2arr[2] && name != "" && commentText != "") {
                    users.workinghours[index].End = commentText
                }
                if (users.workinghours[index].Date == roqkf2arr[2] && name != "" && Starttext != "") {
                    users.workinghours[index].Start = Starttext
                }
                let start = users.workinghours[index].Start
                let end = users.workinghours[index].End

                let start1 = start.split(":")
                let end1 = end.split(":")

                let start2 = new Date(roqkf2arr[0], roqkf2arr[1], roqkf2arr[2], start1[0], start1[1])
                let end2 = new Date(roqkf2arr[0], roqkf2arr[1], roqkf2arr[2], end1[0], end1[1])

                users.workinghours[index].hours = (end2.getTime() - start2.getTime()) / 1000 / 60 / 60
            }
            users.save(function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
            })
            res.redirect('develop2')
        })
    }
    else {
        res.send("<script>alert('권한이 없습니다.');location.href='develop2';</script>")
    }

})

app.post('/roqkf2monthuserlist', function (req, res) {
    const name = req.body.name
    roqkf2usertoday = name
    res.redirect('develop2')
})

app.post('/roqkf2nameviewmonth', function (req, res) {
    const name = req.body.name
    roqkf2nametoday = name
    res.redirect('develop2')
})

app.post('/roqkf2timechange', function (req, res) {
    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
        const time = req.body.timechange
        roqkf2totaltime = time
        res.redirect('develop2')
    }
    else {
        res.send("<script>alert('권한이 없습니다.');location.href='develop2';</script>");
    }
})

app.post('/roqkf2vacation', function (req, res) {
    const name = req.body.name
    let roqkf2arr = name.split("-")
    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
        개발2팀1.findOne({ 'name': roqkf2user, 'Date': roqkf2arr[0] + "-" + roqkf2arr[1] }, function (err, data) {
            for (let index = 0; index < data.workinghours.length; index++) {
                if (data.workinghours[index].Date == roqkf2arr[2]) {
                    data.workinghours[index].hours = "8"
                    data.workinghours[index].End = "휴가"
                    data.workinghours[index].Start = "휴가"

                }
            }
            data.save(function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
                else {
                    res.redirect('develop2')
                }
            })
        })
    }
    else {
        res.send("<script>alert('권한이 없습니다.');location.href='develop2';</script>");
    }
})

let accountcommentarray = new Array()
let accountchdrmsan = ""
let accountuseworkhour = 0
let accountuser = ""
let accounttotaltime = 177
let accountlist = new Array()
let accountchangearray = new Array()
let accountuserviewmonth = new Array()
let accountnameviewmonth = new Array()
let accountovertime = new Array()
let accountusertoday = moment().format('YYYY-MM')
let accountnametoday = moment().format('YYYY-MM')
let accountuserovertime = 0
let accountstate = true
app.get('/account', function (req, res) {
    accountlist = new Array()
    accountcommentarray = new Array()
    accountuserviewmonth = new Array()
    accountuseworkhour = 0
    accountneeduseworkhour = 0
    accountchdrmsan = 0
    accountneedchdrmsan = 0
    accountovertime = new Array()
    회계팀1.find(function (err, data) {

        for (let index = 0; index < data.length; index++) {

            if (!req.session.logindata) {
                return res.render('login', { layout: null })

            }
            else {
                //달 선택
                if (data[index].name == req.session.logindata.id) {
                    accountuserviewmonth.push(data[index].Date)
                }

                if (data[index].name == req.session.logindata.id && data[index].Date == accountusertoday) {
                    accountstate = false


                    //팀장은 모든 팀원의 근무시간표를 볼 수 있음.
                    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
                        for (let index = 0; index < data.length; index++) {
                            let state = true
                            for (let i = 0; i < accountlist.length; i++) {
                                if (accountlist[i] == data[index].name) {
                                    state = false
                                    break
                                }
                            }
                            if (state) {
                                accountlist.push(data[index].name)
                            }

                        }
                    }

                    //근무표 생성

                    for (let i = 0; i < data[index].workinghours.length; i++) {

                        let object = new Object()
                        object.hours = data[index].workinghours[i].hours
                        object.Date = data[index].workinghours[i].Date
                        object.End = data[index].workinghours[i].End
                        object.Start = data[index].workinghours[i].Start
                        accountuseworkhour += parseFloat(data[index].workinghours[i].hours)
                        accountcommentarray.push(object)
                    }
                    //비어있으면 임시 값 저장
                    if (accountcommentarray == "") {
                        let object = new Object()
                        object.hours = "정보 없음"
                        object.Date = "정보 없음"
                        object.End = "정보 없음"
                        object.Start = "정보 없음"
                        accountcommentarray.push(object)
                        accountuseworkhour = 1
                    }
                    User.find({ 'department': req.session.logindata.department }, function (err, data) {
                        if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
                            for (let index = 0; index < data.length; index++) {
                                let object = new Object()
                                object.name = data[index].name
                                object.overtime = data[index].overtime
                                accountovertime.push(object)
                            }
                        }
                    })
                    User.findOne({ 'name': req.session.logindata.id }, function (err, data) {
                        accountuserovertime = data.overtime
                    })

                    회계팀1.find({}, function (err, data) {
                        for (let index = 0; index < data.length; index++) {
                            if (accountuser != "") {
                                if (data[index].name == accountuser) {
                                    let state = true
                                    for (let i = 0; i < accountnameviewmonth.length; i++) {
                                        if (accountnameviewmonth[i] == data[index].Date) {
                                            state = false
                                            break
                                        }
                                    }
                                    if (state) {
                                        accountnameviewmonth.push(data[index].Date)
                                    }
                                    if (data[index].Date == accountnametoday) {
                                        accountchangearray = new Array()
                                        for (let i = 0; i < data[index].workinghours.length; i++) {
                                            let object = new Object()
                                            object.hours = data[index].workinghours[i].hours
                                            object.Date = data[index].workinghours[i].Date
                                            object.End = data[index].workinghours[i].End
                                            object.Start = data[index].workinghours[i].Start
                                            accountchdrmsan += parseFloat(data[index].workinghours[i].hours)
                                            accountchangearray.push(object)
                                        }
                                    }

                                }
                            }
                        }
                        accountneeduseworkhour = accountuseworkhour - accounttotaltime
                        accountneedchdrmsan = accountchdrmsan - accounttotaltime

                        res.render('account', {
                             accountcommentarray: accountcommentarray, name: req.session.logindata.id, accountchdrmsan: accountchdrmsan, accountlist: accountlist,
                            accountuser: accountuser, accountchangearray: accountchangearray, accountuseworkhour: accountuseworkhour, accountuserviewmonth: accountuserviewmonth,
                            accountneedchdrmsan: accountneedchdrmsan, accountneeduseworkhour: accountneeduseworkhour, accountovertime: accountovertime, accountuserovertime: accountuserovertime,
                            accountnameviewmonth: accountnameviewmonth, luncharray: luncharray, dinnerarray: dinnerarray
                        })
                    })
                }
                //새로운 '월'로 넘어가서 1일이 되면 if문안에 있는 render가 작동안하기 때문에 넣은 검사코드


            }
        }
        if (accountstate) {
            res.render('account')
            accountstate = false
        }
    })

})

app.post('/accountchangerecord', function (req, res) {
    const name = req.body.name
    const today = moment().format('YYYY-MM')
    accountusertoday = today
    accountlist = new Array()
    accountchangearray = new Array()
    회계팀1.find(function (err, data) {
        for (let index = 0; index < data.length; index++) {
            if (data[index].name == name && data[index].Date == today) {
                accountuser = name
                if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
                    for (let index = 0; index < data.length; index++) {
                        accountlist.push(data[index].name)
                    }
                }
                for (let i = 0; i < data[index].workinghours.length; i++) {
                    let object = new Object()
                    object.hours = data[index].workinghours[i].hours
                    object.Date = data[index].workinghours[i].Date
                    object.End = data[index].workinghours[i].End
                    object.Start = data[index].workinghours[i].Start
                    accountchdrmsan += parseFloat(data[index].workinghours[i].hours)
                    accountchangearray.push(object)
                }
                res.redirect('account')
            }
        }
    })
})

app.post('/accountchangermsan', function (req, res) {
    const name = req.body.name
    const commentText = req.body.commentText
    const Starttext = req.body.StartText
    let accountarr = name.split("-")
    let textarr = commentText.split(":")
    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
        회계팀1.findOne({ name: accountuser, 'Date': accountarr[0] + "-" + accountarr[1] }, (err, users) => {
            for (let index = 0; index < users.workinghours.length; index++) {
                if (users.workinghours[index].Date == accountarr[2] && name != "" && commentText != "") {
                    users.workinghours[index].End = commentText
                }
                if (users.workinghours[index].Date == accountarr[2] && name != "" && Starttext != "") {
                    users.workinghours[index].Start = Starttext
                }
                let start = users.workinghours[index].Start
                let end = users.workinghours[index].End

                let start1 = start.split(":")
                let end1 = end.split(":")

                let start2 = new Date(accountarr[0], accountarr[1], accountarr[2], start1[0], start1[1])
                let end2 = new Date(accountarr[0], accountarr[1], accountarr[2], end1[0], end1[1])

                users.workinghours[index].hours = (end2.getTime() - start2.getTime()) / 1000 / 60 / 60
            }
            users.save(function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
            })
            res.redirect('account')
        })
    }
    else {
        res.send("<script>alert('권한이 없습니다.');location.href='account';</script>")
    }

})

app.post('/accountmonthuserlist', function (req, res) {
    const name = req.body.name
    accountusertoday = name
    res.redirect('account')
})

app.post('/accountnameviewmonth', function (req, res) {
    const name = req.body.name
    accountnametoday = name
    res.redirect('account')
})

app.post('/accounttimechange', function (req, res) {
    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
        const time = req.body.timechange
        accounttotaltime = time
        res.redirect('account')
    }
    else {
        res.send("<script>alert('권한이 없습니다.');location.href='account';</script>");
    }
})

app.post('/accountvacation', function (req, res) {
    const name = req.body.name
    let accountarr = name.split("-")
    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
        회계팀1.findOne({ 'name': accountuser, 'Date': accountarr[0] + "-" + accountarr[1] }, function (err, data) {
            for (let index = 0; index < data.workinghours.length; index++) {
                if (data.workinghours[index].Date == accountarr[2]) {
                    data.workinghours[index].hours = "8"
                    data.workinghours[index].End = "휴가"
                    data.workinghours[index].Start = "휴가"

                }
            }
            data.save(function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
                else {
                    res.redirect('account')
                }
            })
        })
    }
    else {
        res.send("<script>alert('권한이 없습니다.');location.href='account';</script>");
    }
})

let contentscommentarray = new Array()
let contentschdrmsan = ""
let contentsuseworkhour = 0
let contentsuser = ""
let contentstotaltime = 177
let contentslist = new Array()
let contentschangearray = new Array()
let contentsuserviewmonth = new Array()
let contentsnameviewmonth = new Array()
let contentsovertime = new Array()
let contentsusertoday = moment().format('YYYY-MM')
let contentsnametoday = moment().format('YYYY-MM')
let contentsuserovertime = 0
let contentsstate = true
app.get('/contents', function (req, res) {
    contentslist = new Array()
    contentscommentarray = new Array()
    contentsuserviewmonth = new Array()
    contentsuseworkhour = 0
    contentsneeduseworkhour = 0
    contentschdrmsan = 0
    contentsneedchdrmsan = 0
    contentsovertime = new Array()
    컨텐츠팀1.find(function (err, data) {

        for (let index = 0; index < data.length; index++) {

            if (!req.session.logindata) {
                return res.render('login', { layout: null })

            }
            else {
                //달 선택
                if (data[index].name == req.session.logindata.id) {
                    contentsuserviewmonth.push(data[index].Date)
                }

                if (data[index].name == req.session.logindata.id && data[index].Date == contentsusertoday) {
                    contentsstate = false


                    //팀장은 모든 팀원의 근무시간표를 볼 수 있음.
                    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
                        for (let index = 0; index < data.length; index++) {
                            let state = true
                            for (let i = 0; i < contentslist.length; i++) {
                                if (contentslist[i] == data[index].name) {
                                    state = false
                                    break
                                }
                            }
                            if (state) {
                                contentslist.push(data[index].name)
                            }

                        }
                    }

                    //근무표 생성

                    for (let i = 0; i < data[index].workinghours.length; i++) {

                        let object = new Object()
                        object.hours = data[index].workinghours[i].hours
                        object.Date = data[index].workinghours[i].Date
                        object.End = data[index].workinghours[i].End
                        object.Start = data[index].workinghours[i].Start
                        contentsuseworkhour += parseFloat(data[index].workinghours[i].hours)
                        contentscommentarray.push(object)
                    }
                    //비어있으면 임시 값 저장
                    if (contentscommentarray == "") {
                        let object = new Object()
                        object.hours = "정보 없음"
                        object.Date = "정보 없음"
                        object.End = "정보 없음"
                        object.Start = "정보 없음"
                        contentscommentarray.push(object)
                        contentsuseworkhour = 1
                    }
                    User.find({ 'department': req.session.logindata.department }, function (err, data) {
                        if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
                            for (let index = 0; index < data.length; index++) {
                                let object = new Object()
                                object.name = data[index].name
                                object.overtime = data[index].overtime
                                contentsovertime.push(object)
                            }
                        }
                    })
                    User.findOne({ 'name': req.session.logindata.id }, function (err, data) {
                        contentsuserovertime = data.overtime
                    })

                    컨텐츠팀1.find({}, function (err, data) {
                        for (let index = 0; index < data.length; index++) {
                            if (contentsuser != "") {
                                if (data[index].name == contentsuser) {
                                    let state = true
                                    for (let i = 0; i < contentsnameviewmonth.length; i++) {
                                        if (contentsnameviewmonth[i] == data[index].Date) {
                                            state = false
                                            break
                                        }
                                    }
                                    if (state) {
                                        contentsnameviewmonth.push(data[index].Date)
                                    }
                                    if (data[index].Date == contentsnametoday) {
                                        contentschangearray = new Array()
                                        for (let i = 0; i < data[index].workinghours.length; i++) {
                                            let object = new Object()
                                            object.hours = data[index].workinghours[i].hours
                                            object.Date = data[index].workinghours[i].Date
                                            object.End = data[index].workinghours[i].End
                                            object.Start = data[index].workinghours[i].Start
                                            contentschdrmsan += parseFloat(data[index].workinghours[i].hours)
                                            contentschangearray.push(object)
                                        }
                                    }

                                }
                            }
                        }
                        contentsneeduseworkhour = contentsuseworkhour - contentstotaltime
                        contentsneedchdrmsan = contentschdrmsan - contentstotaltime

                        res.render('contents', {
                             contentscommentarray: contentscommentarray, name: req.session.logindata.id, contentschdrmsan: contentschdrmsan, contentslist: contentslist,
                            contentsuser: contentsuser, contentschangearray: contentschangearray, contentsuseworkhour: contentsuseworkhour, contentsuserviewmonth: contentsuserviewmonth,
                            contentsneedchdrmsan: contentsneedchdrmsan, contentsneeduseworkhour: contentsneeduseworkhour, contentsovertime: contentsovertime, contentsuserovertime: contentsuserovertime,
                            contentsnameviewmonth: contentsnameviewmonth, luncharray: luncharray, dinnerarray: dinnerarray
                        })
                    })
                }
                //새로운 '월'로 넘어가서 1일이 되면 if문안에 있는 render가 작동안하기 때문에 넣은 검사코드


            }
        }
        if (contentsstate) {
            res.render('contents')
            contentsstate = false
        }
    })

})

app.post('/contentschangerecord', function (req, res) {
    const name = req.body.name
    const today = moment().format('YYYY-MM')
    contentsusertoday = today
    contentslist = new Array()
    contentschangearray = new Array()
    컨텐츠팀1.find(function (err, data) {
        for (let index = 0; index < data.length; index++) {
            if (data[index].name == name && data[index].Date == today) {
                contentsuser = name
                if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
                    for (let index = 0; index < data.length; index++) {
                        contentslist.push(data[index].name)
                    }
                }
                for (let i = 0; i < data[index].workinghours.length; i++) {
                    let object = new Object()
                    object.hours = data[index].workinghours[i].hours
                    object.Date = data[index].workinghours[i].Date
                    object.End = data[index].workinghours[i].End
                    object.Start = data[index].workinghours[i].Start
                    contentschdrmsan += parseFloat(data[index].workinghours[i].hours)
                    contentschangearray.push(object)
                }
                res.redirect('contents')
            }
        }
    })
})

app.post('/contentschangermsan', function (req, res) {
    const name = req.body.name
    const commentText = req.body.commentText
    const Starttext = req.body.StartText
    let contentsarr = name.split("-")
    let textarr = commentText.split(":")
    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
        컨텐츠팀1.findOne({ name: contentsuser, 'Date': contentsarr[0] + "-" + contentsarr[1] }, (err, users) => {
            for (let index = 0; index < users.workinghours.length; index++) {
                if (users.workinghours[index].Date == contentsarr[2] && name != "" && commentText != "") {
                    users.workinghours[index].End = commentText
                }
                if (users.workinghours[index].Date == contentsarr[2] && name != "" && Starttext != "") {
                    users.workinghours[index].Start = Starttext
                }
                let start = users.workinghours[index].Start
                let end = users.workinghours[index].End

                let start1 = start.split(":")
                let end1 = end.split(":")

                let start2 = new Date(contentsarr[0], contentsarr[1], contentsarr[2], start1[0], start1[1])
                let end2 = new Date(contentsarr[0], contentsarr[1], contentsarr[2], end1[0], end1[1])

                users.workinghours[index].hours = (end2.getTime() - start2.getTime()) / 1000 / 60 / 60
            }
            users.save(function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
            })
            res.redirect('contents')
        })
    }
    else {
        res.send("<script>alert('권한이 없습니다.');location.href='contents';</script>")
    }

})

app.post('/contentsmonthuserlist', function (req, res) {
    const name = req.body.name
    contentsusertoday = name
    res.redirect('contents')
})

app.post('/contentsnameviewmonth', function (req, res) {
    const name = req.body.name
    contentsnametoday = name
    res.redirect('contents')
})

app.post('/contentstimechange', function (req, res) {
    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
        const time = req.body.timechange
        contentstotaltime = time
        res.redirect('contents')
    }
    else {
        res.send("<script>alert('권한이 없습니다.');location.href='contents';</script>");
    }
})

app.post('/contentsvacation', function (req, res) {
    const name = req.body.name
    let contentsarr = name.split("-")
    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
        컨텐츠팀1.findOne({ 'name': contentsuser, 'Date': contentsarr[0] + "-" + contentsarr[1] }, function (err, data) {
            for (let index = 0; index < data.workinghours.length; index++) {
                if (data.workinghours[index].Date == contentsarr[2]) {
                    data.workinghours[index].hours = "8"
                    data.workinghours[index].End = "휴가"
                    data.workinghours[index].Start = "휴가"

                }
            }
            data.save(function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
                else {
                    res.redirect('contents')
                }
            })
        })
    }
    else {
        res.send("<script>alert('권한이 없습니다.');location.href='contents';</script>");
    }
})

let makingcommentarray = new Array()
let makingchdrmsan = ""
let makinguseworkhour = 0
let makinguser = ""
let makingtotaltime = 177
let makinglist = new Array()
let makingchangearray = new Array()
let makinguserviewmonth = new Array()
let makingnameviewmonth = new Array()
let makingovertime = new Array()
let makingusertoday = moment().format('YYYY-MM')
let makingnametoday = moment().format('YYYY-MM')
let makinguserovertime = 0
let makingstate = true
app.get('/making', function (req, res) {
    makinglist = new Array()
    makingcommentarray = new Array()
    makinguserviewmonth = new Array()
    makinguseworkhour = 0
    makingneeduseworkhour = 0
    makingchdrmsan = 0
    makingneedchdrmsan = 0
    makingovertime = new Array()
    메이커스페이스팀1.find(function (err, data) {

        for (let index = 0; index < data.length; index++) {

            if (!req.session.logindata) {
                return res.render('login', { layout: null })

            }
            else {
                //달 선택
                if (data[index].name == req.session.logindata.id) {
                    makinguserviewmonth.push(data[index].Date)
                }

                if (data[index].name == req.session.logindata.id && data[index].Date == makingusertoday) {
                    makingstate = false


                    //팀장은 모든 팀원의 근무시간표를 볼 수 있음.
                    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
                        for (let index = 0; index < data.length; index++) {
                            let state = true
                            for (let i = 0; i < makinglist.length; i++) {
                                if (makinglist[i] == data[index].name) {
                                    state = false
                                    break
                                }
                            }
                            if (state) {
                                makinglist.push(data[index].name)
                            }

                        }
                    }

                    //근무표 생성

                    for (let i = 0; i < data[index].workinghours.length; i++) {

                        let object = new Object()
                        object.hours = data[index].workinghours[i].hours
                        object.Date = data[index].workinghours[i].Date
                        object.End = data[index].workinghours[i].End
                        object.Start = data[index].workinghours[i].Start
                        makinguseworkhour += parseFloat(data[index].workinghours[i].hours)
                        makingcommentarray.push(object)
                    }
                    //비어있으면 임시 값 저장
                    if (makingcommentarray == "") {
                        let object = new Object()
                        object.hours = "정보 없음"
                        object.Date = "정보 없음"
                        object.End = "정보 없음"
                        object.Start = "정보 없음"
                        makingcommentarray.push(object)
                        makinguseworkhour = 1
                    }
                    User.find({ 'department': req.session.logindata.department }, function (err, data) {
                        if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
                            for (let index = 0; index < data.length; index++) {
                                let object = new Object()
                                object.name = data[index].name
                                object.overtime = data[index].overtime
                                makingovertime.push(object)
                            }
                        }
                    })
                    User.findOne({ 'name': req.session.logindata.id }, function (err, data) {
                        makinguserovertime = data.overtime
                    })

                    메이커스페이스팀1.find({}, function (err, data) {
                        for (let index = 0; index < data.length; index++) {
                            if (makinguser != "") {
                                if (data[index].name == makinguser) {
                                    let state = true
                                    for (let i = 0; i < makingnameviewmonth.length; i++) {
                                        if (makingnameviewmonth[i] == data[index].Date) {
                                            state = false
                                            break
                                        }
                                    }
                                    if (state) {
                                        makingnameviewmonth.push(data[index].Date)
                                    }
                                    if (data[index].Date == makingnametoday) {
                                        makingchangearray = new Array()
                                        for (let i = 0; i < data[index].workinghours.length; i++) {
                                            let object = new Object()
                                            object.hours = data[index].workinghours[i].hours
                                            object.Date = data[index].workinghours[i].Date
                                            object.End = data[index].workinghours[i].End
                                            object.Start = data[index].workinghours[i].Start
                                            makingchdrmsan += parseFloat(data[index].workinghours[i].hours)
                                            makingchangearray.push(object)
                                        }
                                    }

                                }
                            }
                        }
                        makingneeduseworkhour = makinguseworkhour - makingtotaltime
                        makingneedchdrmsan = makingchdrmsan - makingtotaltime

                        res.render('making', {
                             makingcommentarray: makingcommentarray, name: req.session.logindata.id, makingchdrmsan: makingchdrmsan, makinglist: makinglist,
                            makinguser: makinguser, makingchangearray: makingchangearray, makinguseworkhour: makinguseworkhour, makinguserviewmonth: makinguserviewmonth,
                            makingneedchdrmsan: makingneedchdrmsan, makingneeduseworkhour: makingneeduseworkhour, makingovertime: makingovertime, makinguserovertime: makinguserovertime,
                            makingnameviewmonth: makingnameviewmonth, luncharray: luncharray, dinnerarray: dinnerarray
                        })
                    })
                }
                //새로운 '월'로 넘어가서 1일이 되면 if문안에 있는 render가 작동안하기 때문에 넣은 검사코드


            }
        }
        if (makingstate) {
            res.render('making')
            makingstate = false
        }
    })

})

app.post('/makingchangerecord', function (req, res) {
    const name = req.body.name
    const today = moment().format('YYYY-MM')
    makingusertoday = today
    makinglist = new Array()
    makingchangearray = new Array()
    메이커스페이스팀1.find(function (err, data) {
        for (let index = 0; index < data.length; index++) {
            if (data[index].name == name && data[index].Date == today) {
                makinguser = name
                if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
                    for (let index = 0; index < data.length; index++) {
                        makinglist.push(data[index].name)
                    }
                }
                for (let i = 0; i < data[index].workinghours.length; i++) {
                    let object = new Object()
                    object.hours = data[index].workinghours[i].hours
                    object.Date = data[index].workinghours[i].Date
                    object.End = data[index].workinghours[i].End
                    object.Start = data[index].workinghours[i].Start
                    makingchdrmsan += parseFloat(data[index].workinghours[i].hours)
                    makingchangearray.push(object)
                }
                res.redirect('making')
            }
        }
    })
})

app.post('/makingchangermsan', function (req, res) {
    const name = req.body.name
    const commentText = req.body.commentText
    const Starttext = req.body.StartText
    let makingarr = name.split("-")
    let textarr = commentText.split(":")
    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
        메이커스페이스팀1.findOne({ name: makinguser, 'Date': makingarr[0] + "-" + makingarr[1] }, (err, users) => {
            for (let index = 0; index < users.workinghours.length; index++) {
                if (users.workinghours[index].Date == makingarr[2] && name != "" && commentText != "") {
                    users.workinghours[index].End = commentText
                }
                if (users.workinghours[index].Date == makingarr[2] && name != "" && Starttext != "") {
                    users.workinghours[index].Start = Starttext
                }
                let start = users.workinghours[index].Start
                let end = users.workinghours[index].End

                let start1 = start.split(":")
                let end1 = end.split(":")

                let start2 = new Date(makingarr[0], makingarr[1], makingarr[2], start1[0], start1[1])
                let end2 = new Date(makingarr[0], makingarr[1], makingarr[2], end1[0], end1[1])

                users.workinghours[index].hours = (end2.getTime() - start2.getTime()) / 1000 / 60 / 60
            }
            users.save(function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
            })
            res.redirect('making')
        })
    }
    else {
        res.send("<script>alert('권한이 없습니다.');location.href='making';</script>")
    }

})

app.post('/makingmonthuserlist', function (req, res) {
    const name = req.body.name
    makingusertoday = name
    res.redirect('making')
})

app.post('/makingnameviewmonth', function (req, res) {
    const name = req.body.name
    makingnametoday = name
    res.redirect('making')
})

app.post('/makingtimechange', function (req, res) {
    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
        const time = req.body.timechange
        makingtotaltime = time
        res.redirect('making')
    }
    else {
        res.send("<script>alert('권한이 없습니다.');location.href='making';</script>");
    }
})

app.post('/makingvacation', function (req, res) {
    const name = req.body.name
    let makingarr = name.split("-")
    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
        메이커스페이스팀1.findOne({ 'name': makinguser, 'Date': makingarr[0] + "-" + makingarr[1] }, function (err, data) {
            for (let index = 0; index < data.workinghours.length; index++) {
                if (data.workinghours[index].Date == makingarr[2]) {
                    data.workinghours[index].hours = "8"
                    data.workinghours[index].End = "휴가"
                    data.workinghours[index].Start = "휴가"

                }
            }
            data.save(function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
                else {
                    res.redirect('making')
                }
            })
        })
    }
    else {
        res.send("<script>alert('권한이 없습니다.');location.href='making';</script>");
    }
})

let roqkf1commentarray = new Array()
let roqkf1chdrmsan = ""
let roqkf1useworkhour = 0
let roqkf1user = ""
let roqkf1totaltime = 177
let roqkf1list = new Array()
let roqkf1changearray = new Array()
let roqkf1userviewmonth = new Array()
let roqkf1nameviewmonth = new Array()
let roqkf1overtime = new Array()
let roqkf1usertoday = moment().format('YYYY-MM')
let roqkf1nametoday = moment().format('YYYY-MM')
let roqkf1userovertime = 0
let roqkf1state = true
app.get('/develop1', function (req, res) {
    roqkf1list = new Array()
    roqkf1commentarray = new Array()
    roqkf1userviewmonth = new Array()
    roqkf1useworkhour = 0
    roqkf1needuseworkhour = 0
    roqkf1chdrmsan = 0
    roqkf1needchdrmsan = 0
    roqkf1overtime = new Array()
    개발1팀1.find(function (err, data) {

        for (let index = 0; index < data.length; index++) {

            if (!req.session.logindata) {
                return res.render('login', { layout: null })

            }
            else {
                //달 선택
                if (data[index].name == req.session.logindata.id) {
                    roqkf1userviewmonth.push(data[index].Date)
                }

                if (data[index].name == req.session.logindata.id && data[index].Date == roqkf1usertoday) {
                    roqkf1state = false


                    //팀장은 모든 팀원의 근무시간표를 볼 수 있음.
                    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
                        for (let index = 0; index < data.length; index++) {
                            let state = true
                            for (let i = 0; i < roqkf1list.length; i++) {
                                if (roqkf1list[i] == data[index].name) {
                                    state = false
                                    break
                                }
                            }
                            if (state) {
                                roqkf1list.push(data[index].name)
                            }

                        }
                    }

                    //근무표 생성

                    for (let i = 0; i < data[index].workinghours.length; i++) {

                        let object = new Object()
                        object.hours = data[index].workinghours[i].hours
                        object.Date = data[index].workinghours[i].Date
                        object.End = data[index].workinghours[i].End
                        object.Start = data[index].workinghours[i].Start
                        roqkf1useworkhour += parseFloat(data[index].workinghours[i].hours)
                        roqkf1commentarray.push(object)
                    }
                    //비어있으면 임시 값 저장
                    if (roqkf1commentarray == "") {
                        let object = new Object()
                        object.hours = "정보 없음"
                        object.Date = "정보 없음"
                        object.End = "정보 없음"
                        object.Start = "정보 없음"
                        roqkf1commentarray.push(object)
                        roqkf1useworkhour = 1
                    }
                    User.find({ 'department': req.session.logindata.department }, function (err, data) {
                        if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
                            for (let index = 0; index < data.length; index++) {
                                let object = new Object()
                                object.name = data[index].name
                                object.overtime = data[index].overtime
                                roqkf1overtime.push(object)
                            }
                        }
                    })
                    User.findOne({ 'name': req.session.logindata.id }, function (err, data) {
                        roqkf1userovertime = data.overtime
                    })

                    개발1팀1.find({}, function (err, data) {
                        for (let index = 0; index < data.length; index++) {
                            if (roqkf1user != "") {
                                if (data[index].name == roqkf1user) {
                                    let state = true
                                    for (let i = 0; i < roqkf1nameviewmonth.length; i++) {
                                        if (roqkf1nameviewmonth[i] == data[index].Date) {
                                            state = false
                                            break
                                        }
                                    }
                                    if (state) {
                                        roqkf1nameviewmonth.push(data[index].Date)
                                    }
                                    if (data[index].Date == roqkf1nametoday) {
                                        roqkf1changearray = new Array()
                                        for (let i = 0; i < data[index].workinghours.length; i++) {
                                            let object = new Object()
                                            object.hours = data[index].workinghours[i].hours
                                            object.Date = data[index].workinghours[i].Date
                                            object.End = data[index].workinghours[i].End
                                            object.Start = data[index].workinghours[i].Start
                                            roqkf1chdrmsan += parseFloat(data[index].workinghours[i].hours)
                                            roqkf1changearray.push(object)
                                        }
                                    }

                                }
                            }
                        }
                        roqkf1needuseworkhour = roqkf1useworkhour - roqkf1totaltime
                        roqkf1needchdrmsan = roqkf1chdrmsan - roqkf1totaltime

                        res.render('develop1', {
                             roqkf1commentarray: roqkf1commentarray, name: req.session.logindata.id, roqkf1chdrmsan: roqkf1chdrmsan, roqkf1list: roqkf1list,
                            roqkf1user: roqkf1user, roqkf1changearray: roqkf1changearray, roqkf1useworkhour: roqkf1useworkhour, roqkf1userviewmonth: roqkf1userviewmonth,
                            roqkf1needchdrmsan: roqkf1needchdrmsan, roqkf1needuseworkhour: roqkf1needuseworkhour, roqkf1overtime: roqkf1overtime, roqkf1userovertime: roqkf1userovertime,
                            roqkf1nameviewmonth: roqkf1nameviewmonth, luncharray: luncharray, dinnerarray: dinnerarray
                        })
                    })
                }
                //새로운 '월'로 넘어가서 1일이 되면 if문안에 있는 render가 작동안하기 때문에 넣은 검사코드


            }
        }
        if (roqkf1state) {
            res.render('develop1')
            roqkf1state = false
        }
    })

})

app.post('/roqkf1changerecord', function (req, res) {
    const name = req.body.name
    const today = moment().format('YYYY-MM')
    roqkf1usertoday = today
    roqkf1list = new Array()
    roqkf1changearray = new Array()
    개발1팀1.find(function (err, data) {
        for (let index = 0; index < data.length; index++) {
            if (data[index].name == name && data[index].Date == today) {
                roqkf1user = name
                if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
                    for (let index = 0; index < data.length; index++) {
                        roqkf1list.push(data[index].name)
                    }
                }
                for (let i = 0; i < data[index].workinghours.length; i++) {
                    let object = new Object()
                    object.hours = data[index].workinghours[i].hours
                    object.Date = data[index].workinghours[i].Date
                    object.End = data[index].workinghours[i].End
                    object.Start = data[index].workinghours[i].Start
                    roqkf1chdrmsan += parseFloat(data[index].workinghours[i].hours)
                    roqkf1changearray.push(object)
                }
                res.redirect('develop1')
            }
        }
    })
})

app.post('/roqkf1changermsan', function (req, res) {
    const name = req.body.name
    const commentText = req.body.commentText
    const Starttext = req.body.StartText
    let roqkf1arr = name.split("-")
    let textarr = commentText.split(":")
    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
        개발1팀1.findOne({ name: roqkf1user, 'Date': roqkf1arr[0] + "-" + roqkf1arr[1] }, (err, users) => {
            for (let index = 0; index < users.workinghours.length; index++) {
                if (users.workinghours[index].Date == roqkf1arr[2] && name != "" && commentText != "") {
                    users.workinghours[index].End = commentText
                }
                if (users.workinghours[index].Date == roqkf1arr[2] && name != "" && Starttext != "") {
                    users.workinghours[index].Start = Starttext
                }
                let start = users.workinghours[index].Start
                let end = users.workinghours[index].End

                let start1 = start.split(":")
                let end1 = end.split(":")

                let start2 = new Date(roqkf1arr[0], roqkf1arr[1], roqkf1arr[2], start1[0], start1[1])
                let end2 = new Date(roqkf1arr[0], roqkf1arr[1], roqkf1arr[2], end1[0], end1[1])

                users.workinghours[index].hours = (end2.getTime() - start2.getTime()) / 1000 / 60 / 60
            }
            users.save(function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
            })
            res.redirect('develop1')
        })
    }
    else {
        res.send("<script>alert('권한이 없습니다.');location.href='develop1';</script>")
    }

})

app.post('/roqkf1monthuserlist', function (req, res) {
    const name = req.body.name
    roqkf1usertoday = name
    res.redirect('develop1')
})

app.post('/roqkf1nameviewmonth', function (req, res) {
    const name = req.body.name
    roqkf1nametoday = name
    res.redirect('develop1')
})

app.post('/roqkf1timechange', function (req, res) {
    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
        const time = req.body.timechange
        roqkf1totaltime = time
        res.redirect('develop1')
    }
    else {
        res.send("<script>alert('권한이 없습니다.');location.href='develop1';</script>");
    }
})

app.post('/roqkf1vacation', function (req, res) {
    const name = req.body.name
    let roqkf1arr = name.split("-")
    if (req.session.logindata.position == "팀장" || req.session.logindata.position == "부소장") {
        개발1팀1.findOne({ 'name': roqkf1user, 'Date': roqkf1arr[0] + "-" + roqkf1arr[1] }, function (err, data) {
            for (let index = 0; index < data.workinghours.length; index++) {
                if (data.workinghours[index].Date == roqkf1arr[2]) {
                    data.workinghours[index].hours = "8"
                    data.workinghours[index].End = "휴가"
                    data.workinghours[index].Start = "휴가"

                }
            }
            data.save(function (err) {
                if (err) {
                    console.error(err);
                    return;
                }
                else {
                    res.redirect('develop1')
                }
            })
        })
    }
    else {
        res.send("<script>alert('권한이 없습니다.');location.href='develop1';</script>");
    }
})
/*
개발2팀1.find({}, (err, users) => {
    for(let i =0;i<users.length;i++)
    {
        if(users[i].name=="고동환") {
            for (let index = 0; index < users[i].workinghours.length; index++) {
                if(users[i].workinghours[index].Date == "20") {
                    users[i].workinghours[index].hours = "3"
                }
            }
        }
        users[i].save(function (err) {
            if (err) {
                console.error(err);
                return;
            }
            else {
                console.log("ㅁㄴㅇ")
            }
        })
    }
    
    
})
*/
/*
개발2팀1.updateOne({ 'nfc': getnfc, 'Date': currentYear }, {
    $set: {
        workinghours: {
            'Date': currentDay, 'hours': workinghours, 'Start': Start2arr[1] + ":" + Start2arr[2],
            'End': End2arr[1] + ":" + End2arr[2]
        }
    }
}, function (err, data) {
    if (err) console.log(err)
    console.log("추가완료")
})

개발2팀1.findOne({ "name": "박찬종", "workinghours": { "$elemMatch": { "Date": 19 } } }, function (err, data) {
    console.log(data.workinghours[1].Date)
})
*/
// custom 404 page
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
