// eg. let d = new Date("2018-8-1").getDay()
const fs = require('fs')

var data = fs.readFileSync('./cal.txt');
var str1 = data.toString();
var arr = str1.split("\r\n");
console.log(arr);
arr.forEach(date => {
    var dateStr = new Date(date.toString()).getDay()
    console.log(dateStr)
    var chr = "";
    if(dateStr == 0 || dateStr == 6) {
        chr = "PH";
    }else {
        chr = "W"
    }
    fs.writeFile('./output.txt', chr + ',', {flag:'a',encoding:'utf-8',mode:'0666'}, function(err) {
        if (err) {
            return console.error(err);
        }
    })
})
