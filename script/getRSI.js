exports.getRSI = function getcurrentRSI(body) { //RSI구하는 함수
    let arraybody = ""
    let arraycp = new Array()
    let arraydp = new Array()
    let plusarray = new Array()
    let minusarray = new Array()
    let firstplusav = 0.0
    let firstminusav = 0.0
    let AU = new Array()
    let AD = new Array()
    let RS = new Array()
    let RSI = new Array()
    let value = 0
    let aaa = body
    value = aaa.toString().split(',')[3].split(':')[1]
    arraybody = aaa.toString().split('},{')
    for (let i = 0; i < arraybody.length; i++) {
        arraycp.push(arraybody[i].split(',')[6].split(':')[1])
    }
    for (let i = 1; i <= arraycp.length; i++) {
        arraydp.push(arraycp[arraycp.length - i])

    }
    for (let i = 0; i < arraydp.length; i++) {
        if (arraydp[i] < arraydp[i + 1]) {
            plusarray.push((arraydp[i + 1] - arraydp[i]))
            minusarray.push(null)
        } else if (arraydp[i] > arraydp[i + 1]) {
            minusarray.push(Math.abs((arraydp[i + 1] - arraydp[i])))
            plusarray.push(null)
        } else if (arraydp[i] == arraydp[i + 1]) {
            plusarray.push(null)
            minusarray.push(null)
        }
    }
    for (let i = 0; i <= plusarray.length - 14; i++) {
        firstplusav += plusarray[i]
    }
    for (let i = 0; i <= minusarray.length - 14; i++) {
        firstminusav += minusarray[i]
    }
    AU.push(firstplusav / 14)
    AD.push(firstminusav / 14)
    for (let i = 15; i <= plusarray.length; i++) {
        AU.push((AU[i - 15] * 13 + plusarray[i - 1]) / 14)
    }
    for (let i = 15; i <= minusarray.length; i++) {
        AD.push((AD[i - 15] * 13 + minusarray[i - 1]) / 14)
    }
    for (let i = 0; i < AU.length; i++) {
        RS.push(AU[i] / AD[i])
    }
    for (let i = 0; i < RS.length; i++) {
        RSI.push(100 - 100 / (1 + RS[i]))
    }
    return {
        RSI : RSI[13],
        value : value
    }
}