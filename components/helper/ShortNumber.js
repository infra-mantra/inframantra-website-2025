const ShortNumber = (val) => {
    let num = val.toString()
    let output
    if(num.length == 6 || num.length == 7){
        num = num / 100000
        output = num.toFixed(0)+' L'
    }
    if(num.length >= 8){
        num = num / 10000000
        output = num.toFixed(0)+' Cr'
    }
    return output
}
export default ShortNumber