
module.exports.newList = new Array()

const showListBelow30Percent = async function (list) {
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
            return
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
            Rsi: getRSI(currentPriceArray).RSI
        }

        rsiList.push(object)
        await wait(100)
        await waitAndDo(times - 1)
    }

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}

const getRSI = (priceArray) => { //RSI구하는 함수
    let arrayCp = new Array()
    let arrayDp = new Array()
    let plusArray = new Array()
    let minusArray = new Array()
    let firstPlusaValue = 0.0
    let firstMinusaValue = 0.0
    let AU = new Array()
    let AD = new Array()
    let RS = new Array()
    let RSI = new Array()
    for (let i = 0; i < priceArray.length; i++) {
        arrayCp.push(priceArray[i])
    }
    for (let i = 1; i <= arrayCp.length; i++) {
        arrayDp.push(arrayCp[arrayCp.length - i])

    }
    for (let i = 0; i < arrayDp.length; i++) {
        if (arrayDp[i] < arrayDp[i + 1]) {
            plusArray.push((arrayDp[i + 1] - arrayDp[i]))
            minusArray.push(null)
        } else if (arrayDp[i] > arrayDp[i + 1]) {
            minusArray.push(Math.abs((arrayDp[i + 1] - arrayDp[i])))
            plusArray.push(null)
        } else if (arrayDp[i] == arrayDp[i + 1]) {
            plusArray.push(null)
            minusArray.push(null)
        }
    }
    for (let i = 0; i <= plusArray.length - 14; i++) {
        firstPlusaValue += plusArray[i]
    }
    for (let i = 0; i <= minusArray.length - 14; i++) {
        firstMinusaValue += minusArray[i]
    }
    AU.push(firstPlusaValue / 14)
    AD.push(firstMinusaValue / 14)
    for (let i = 15; i <= plusArray.length; i++) {
        AU.push((AU[i - 15] * 13 + plusArray[i - 1]) / 14)
    }
    for (let i = 15; i <= minusArray.length; i++) {
        AD.push((AD[i - 15] * 13 + minusArray[i - 1]) / 14)
    }
    for (let i = 0; i < AU.length; i++) {
        RS.push(AU[i] / AD[i])
    }
    for (let i = 0; i < RS.length; i++) {
        RSI.push(100 - 100 / (1 + RS[i]))
    }
    return {
        RSI: RSI[13],
        value: "value"
    }
}

module.exports = {
    getRSI,
    showListBelow30Percent,
}