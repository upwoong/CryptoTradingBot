const getRSI = require("./script/getRSI")
const mongo = require("./script/mongo")
module.exports.func123 = function (say, name) {
    mongo.Usertransaction.findOne({ Username: name }, (err, users) => {
        mongo.Userwallet.findOne({ Username: name }, (err, users) => {
            if (getRSI.getRSI(say) < 35) {
                if(users.time = true) {

                }
                //구매함수
            } else if (getRSI.getRSI(say) > 70) {
                if(users.time = false){
                    
                }
                //판매함수
            }
            users.save(function (err) {
                if (err) console.log(err)
            })
        })
    })

};
//module.export 로 다 바꾸기

