// eg. let d = new Date("2018-8-1").getDay()
const fs = require('fs')

// var data = fs.readFileSync('./cal.txt');
// var strAll = data.toString();
// var arrAll = strAll.split("\r\n");
// var currentMonth = '8';

// arrAll.forEach(date => {
//     var strOne = date.toString();
//     var arrOne = strOne.split("-");
//     if(arrOne[1] != currentMonth) {
//         currentMonth = arrOne[1];
//         fs.writeFile('./output.txt', 'E'+'\n', {flag:'a',encoding:'utf-8',mode:'0666'}, function(err) {
//             if (err) {
//                 return console.error(err);
//             }
//             // console.log("File opened successfully!");
//         })
//     }
//     var dateStr = new Date(date.toString()).getDay().toString()
//     var chr = "";
//     console.log(dateStr)
//     if(dateStr == "0" || dateStr == "6") {
//         chr = "PH";
//     }else {
//         chr = "W"
//     }
//     fs.writeFile('./output.txt', chr+",", {flag:'a',encoding:'utf-8',mode:'0666'}, function(err) {
//         if (err) {
//             return console.error(err);
//         }
//         // console.log("File opened successfully!");
//     })
// })

var data = fs.readFileSync('../uploads/months/MayA.txt');
var strAll = data.toString();
var arrAll = strAll.split("\n");
fs.writeFile('../uploads/months/MayA.txt', arrAll[0] + arrAll[1], {flag:'w',encoding:'utf-8',mode:'0666'}, function(err) {
    if (err) {
        return console.error(err);
    }
    // console.log("File opened successfully!");
})