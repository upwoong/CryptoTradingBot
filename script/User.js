const mongo = require("./mongo")
/**
 * 
 * @param {String} id 
 * @param {String} password 
 * @param {true,false} state
 * @returns 
 */
const findUser = async (id, password,state) =>{
    try{
        await mongo.connectDB()
        let query = { "userName" : id}
        if(password) query.password = password
        return {
             User : await mongo.User.findOne(query),
             UserTransaction : await mongo.userTransaction.findOne(query),
             Userwallet : await mongo.userWallet.findOne(query)
        }
    } finally {
        if(state) await mongo.closeDB()
    }
}

/**
 * 
 * @param {String} id 
 * @param {String} pw 
 * @param {String} name 
 * @param {*} startday 
 * @returns 
 */
const createUser = async (id, pw, name, startday) => {
    try {
        await mongo.connectDB()

        const user = await mongo.User.create({
            Id: id,
            Password: pw,
            userName: name,
            birthDay: startday,
        })

        await mongo.userTransaction.create({
            userName: id,
            transaction: [],
        })

        await mongo.userWallet.create({
            userName: id,
            buyCooltime: "true",
            Money: 3000000,
            startMoney : 1000000,
            holdCoin: [],
        })

        return user
    } finally {
        await mongo.closeDB()
    }
}


const getInvestmentDetails = async (userId) => {
    try {
        await mongo.connectDB()

        const userTransaction = await mongo.userTransaction.findOne({
            userName: userId,
        })
        console.log(userTransaction)
        return userTransaction.transaction
    } finally {
        await mongo.closeDB()
    }
}

module.exports = {
    findUser,
    createUser,
    getInvestmentDetails
}