// Database
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const models = require('./models/Month')
const Month = models.Month;

const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static')
const path = require('path')
const send = require('koa-send');
const app = new Koa();
const router = new Router({ prefix: "/api"});
const multer = require('koa-multer');
const upload = multer({ dest: 'uploads/' });

const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)

const fs = require('fs')
const json = require('./convertCsv.js')

const runMode = "dev"
// const runMode = "production"


if (runMode == "dev") {   // if (process.env.NODE_ENV == "production" || process.env.NODE_ENV === undefined) {
    /* Develop Database */
    // var staticPath = "/dist/"
    var staticPath = "/client/dist/"
    var connString = "mongodb://apaccalendardatabase-dev:qySE4ELD21G4duwC2WdHM0mHVsk0z4VW9jSxWkpIDHAiUCclBAZkuKnNI48lmsxAD7BKzkuOAiqWy9KDNI4vCQ%3D%3D@apaccalendardatabase-dev.documents.azure.com:10255/?ssl=true&replicaSet=globaldb"
}
else {

    // var connString = "mongodb://mayocalendarv2-dev:CiXxW30UqowaAs8CiAVyNiLgJ2UkRmpN6KXBGcJWamGmN2sNYkwcfhRhXQqGfi6jOFH6imOniww5Wn6tX2dIIA%3D%3D@mayocalendarv2-dev.documents.azure.com:10255/?ssl=true&replicaSet=globaldb"

    /* Production Database */
    var staticPath = "/dist/"
    var connString = "mongodb://apaccalendardatabase:6ANCUJX2zdRjm7sKXDBvqy6X93dTao2XabNBmvEBFSLM7pqHoqkwAPStsLeIXMYKr4DJxAcDyiCont6LXjKjpw%3D%3D@apaccalendardatabase.documents.azure.com:10255/?ssl=true&replicaSet=globaldb"

}

router.use(bodyParser());
mongoose.connect(connString)
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connected to DB");
});

/* koa interface demo */
// router.get('/', ctx => {
//     ctx.body = "Hello"
// })

router.get('/AppService/:year/:month', async (ctx) => {
    var p = ctx.params
    try {
        var result = await Month.findOne({ 'year': p.year, 'month': p.month,'section': 'AppService'})
        if (result == null)
            throw "Record not found"

        else ctx.body = result
    }
    catch (e) {
        ctx.status = 404
        ctx.body = e
    }
})

router.get('/DEV/:year/:month', async (ctx) => {
    var p = ctx.params
    try {
        var result = await Month.findOne({ 'year': p.year, 'month': p.month,'section': 'DEV'})
        if (result == null)
            throw "Record not found"

        else ctx.body = result
    }
    catch (e) {
        ctx.status = 404
        ctx.body = e
    }
})

router.get('/AppService/:year', async (ctx) => {
    try {
        var results = await Month.find({'year': ctx.params.year-0}, 'year month')
        ctx.body = results
    }
    catch (e) {
         ctx.status = 404
         ctx.body = e
    }
})

router.get('/DEV/:year', async (ctx) => {
    try {
        var results = await Month.find({'year': ctx.params.year-0}, 'year month')
        ctx.body = results
    }
    catch (e) {
         ctx.status = 404
         ctx.body = e
    }
})

router.post('/AppService/:year/:month/:person/:day', bodyParser(), async (ctx) => {
    //expect {workDay: true|false, workType: WE|W|PH|V};
    var p = ctx.params
    var b = ctx.request.body
    try {
        var currentMonth = await Month.findOne({ 'year': p.year, 'month': p.month,'section': 'AppService' })
        if (currentMonth == null)
            throw 'Record not found'
        var day = currentMonth.people.id(p.person).days.id(p.day)
        day.workType = b.workType
        day.workDay = b.workDay
        var result = await currentMonth.save()
        //if indexes are set, emit update
        if (b.indexes !== undefined)
            io.to("/" + p.year + "/" + p.month).emit('update', b)
        ctx.body = result
    }
    catch (e) {
        console.log(e)
        ctx.status = 400
        ctx.body = e
    }
})

router.post('/DEV/:year/:month/:person/:day', bodyParser(), async (ctx) => {
    //expect {workDay: true|false, workType: WE|W|PH|V};
    var p = ctx.params
    var b = ctx.request.body
    try {
        var currentMonth = await Month.findOne({ 'year': p.year, 'month': p.month,'section': 'DEV' })
        if (currentMonth == null)
            throw 'Record not found'
        var day = currentMonth.people.id(p.person).days.id(p.day)
        day.workType = b.workType
        day.workDay = b.workDay
        var result = await currentMonth.save()
        //if indexes are set, emit update
        if (b.indexes !== undefined)
            io.to("/" + p.year + "/" + p.month).emit('update', b)
        ctx.body = result
    }
    catch (e) {
        console.log(e)
        ctx.status = 400
        ctx.body = e
    }
})

router.post("/AppService/upload/:year/:month/?mode=incremental", upload.any('csv'), async (ctx) => {
    let tmp_path = ctx.req.files[0].path;
    let src = fs.createReadStream(tmp_path);
    let people = await json(src)
    var currentMonth = await Month.findOne({ 'year': ctx.params.year, 'month': ctx.params.month ,'section': 'AppService'})
    if (currentMonth == null) {

    }
})

router.post("/DEV/upload/:year/:month/?mode=incremental", upload.any('csv'), async (ctx) => {
    let tmp_path = ctx.req.files[0].path;
    let src = fs.createReadStream(tmp_path);
    let people = await json(src)
    var currentMonth = await Month.findOne({ 'year': ctx.params.year, 'month': ctx.params.month,'section': 'DEV' })
    if (currentMonth == null) {

    }
})

function insertMonth(year, month, people,section) {
    console.log('Inserting Full Month')
    return new Month({
        year: year,
        month: month,
        people: people,
        section: section
    })
}

function incrementMonth(month, people) {
    console.log('Incremental push')
    people.forEach(person => {
        month.people.push(person)
    })
    return month
}

function decrementMonth(month, name) {
    console.log('decrementMonth')
    let count = 0
    month.people.forEach(person => {
       if(person.name == name){
           position = count
       }
       count++
    })
    month.people.splice(position,1)
    return month
}

/**************************************
 * Feature 7 Add a new member to the calendar
**************************************/
//core code for Addind new guy into the TEAM
//firstly copy from the exsiting default file
//replace the defult name with a name from the parametre
//use incrementMonth function to update the database

router.post("/AppService/:year/:month/person", upload.any('csv'), bodyParser(),async (ctx) => {
    const uploadDict = ["january","february","march","april","may","june","july","auguest","september","october","november","december"]
    var testLock = false;
    var b = ctx.request.body
    console.log(b)//get the request body DONE
    var month = ctx.params.month
    let src = fs.createReadStream('./uploads/'+uploadDict[month-1]+'.txt');
    console.log(src);//check the replacement application DONE

    let people = await json(src)
    people[0].name = b.name
    testLock = true;
    console.log(people);//check the replacement application

    let currentMonth = await Month.findOne({ 'year': ctx.params.year, 'month': ctx.params.month,'section': 'AppService' })
    if(testLock)
    {
        console.log("hahaha")
        var payload = incrementMonth(currentMonth, people)
        try {
            await payload.save()
            ctx.body = "all good"
        }
        catch(e) {
            ctx.status = 400
            ctx.body = "something went wrong"
            console.log(e)
        }
    }
})

/**************************************
 * Feature 7 Add a new member to the calendar
**************************************/
router.post("/DEV/:year/:month/person", upload.any('csv'), bodyParser(),async (ctx) => {
    const uploadDict = ["january","february","march","april","may","june","july","auguest","september","october","november","december"]
    var testLock = false;
    var b = ctx.request.body
    var month = ctx.params.month
    console.log(b)//get the request body DONE

    let src = fs.createReadStream('./uploads/'+uploadDict[month-1]+'.txt');
    console.log(src);//check the replacement application DONE

    let people = await json(src)
    people[0].name = b.name
    testLock = true;
    console.log(people);//check the replacement application

    let currentMonth = await Month.findOne({ 'year': ctx.params.year, 'month': ctx.params.month,'section': 'DEV' })
    if(testLock)
    {
        console.log("hahaha")
        var payload = incrementMonth(currentMonth, people)
        try {
            await payload.save()
            ctx.body = "all good"
        }
        catch(e) {
            ctx.status = 400
            ctx.body = "something went wrong"
            console.log(e)
        }
    }
})
/**************************************
 * Feature 10 Delete a member from the calendar
**************************************/
 router.post("/AppService/:year/:month/delete", bodyParser(), async (ctx) => {
    var testLock = false;
    var b = ctx.request.body
    console.log(b)//get the request body DONE

    testLock = true;//check the replacement application

    let currentMonth = await Month.findOne({ 'year': ctx.params.year, 'month': ctx.params.month,'section': 'AppService' })

    if(testLock)
    {
        //console.log("hahaha")
        var payload = decrementMonth(currentMonth, b.name)
        try {
            await payload.save()
            ctx.body = "all good"
        }
        catch(e) {
            ctx.status = 400
            ctx.body = "something went wrong"
            console.log(e)
        }
    }
 })

 /**************************************
 * Feature 10 Delete a member from the calendar
**************************************/
router.post("/DEV/:year/:month/delete", bodyParser(), async (ctx) => {
    var testLock = false;
    var b = ctx.request.body
    console.log(b)//get the request body DONE

    testLock = true;//check the replacement application

    let currentMonth = await Month.findOne({ 'year': ctx.params.year, 'month': ctx.params.month,'section': 'DEV' })

    if(testLock)
    {
        //console.log("hahaha")
        var payload = decrementMonth(currentMonth, b.name)
        try {
            await payload.save()
            ctx.body = "all good"
        }
        catch(e) {
            ctx.status = 400
            ctx.body = "something went wrong"
            console.log(e)
        }
    }
 })

/**************************************
 * Feature 9 Init a new Calendar
**************************************/
function pushArray(j, arrinner, dayNuminner) {

    while(j+6 < dayNuminner) {
        for(var k = 0;k<5;k++) {
            arrinner[j] = "W";
            j++;
        }
        for(var k = 0;k<2;k++) {
            arrinner[j] = "PH";
            j++;
        }
    }
    var t = 0
    while(j < dayNuminner) {
        if(t<5) {
            arrinner[j] = "W";
            j++;
            t++;
        }else {
            arrinner[j] = "PH";
            j++;
        }
    }

    return arrinner
}

function writeNewArrA(strinner) {
    fs.writeFile('./uploads/mythA.txt', strinner,  function(err) {
        if (err) {
            return console.error(err);
        }
        fs.readFile('./uploads/mythA.txt', function (err, data) {
           if (err) {
              return console.error(err);
           }
           console.log(data.toString());
        });
     });
}

function writeNewArrD(strinner) {
    fs.writeFile('./uploads/mythD.txt', strinner,  function(err) {
        if (err) {
            return console.error(err);
        }
        fs.readFile('./uploads/mythD.txt', function (err, data) {
           if (err) {
              return console.error(err);
           }
           console.log(data.toString());
        });
     });
}

router.post("/AppService/:year/:month/init", upload.any('csv'), async (ctx) => {
    let section = "AppService"
    let year = ctx.params.year
    let month = ctx.params.month
    let lastMonth = await Month.findOne({ 'year': year, 'month': (month - 1),'section': section })
    var data = fs.readFileSync('./uploads/mythA.txt');
    var str1 = data.toString();
    // console.log(str1)
    var str2, str3
    var arr = str1.split(",");
    console.log(arr)
    var arrNew=new Array();
    var i = 0;
    var monthArr = ["JanuaryA", "FebruaryA", "MarchA", "AprilA", "MayA", "JuneA", "JulyA", "AuguestA", "SeptemberA", "OctoberA", "NovemberA", "DecemberA"]
    var dayNumArr = [31,28,31,30,31,30,31,31,30,31,30,31]
    var dayNum = dayNumArr[month-1];
    if(year % 4 == 0 && month == 2) { // leap year + Feb => 29 days
        dayNum++;
    }
    // here goes the BUG
    while(arr[i] != "PH") {
        i++;
        if(i > 4) {
            break;
        }
    }
    setTimeout(function() {
        if(i == 0 && arr[i+1] != "PH") {
            arr[0] = "W";
            arr[1] = "PH";
            arr[2] = "PH";
            arr = pushArray(3, arr, dayNum);
            //console.log(arr)
        }else if(i == 0 && arr[i+1] == "PH"){
            arr[0] = "W";
            arr[1] = "W";
            arr[2] = "PH";
            arr[3] = "PH";
            arr = pushArray(4, arr, dayNum);
        }else if(i == 1){
            arr[0] = "W";
            arr[1] = "W";
            arr[2] = "W";
            arr[3] = "PH";
            arr[4] = "PH";
            arr = pushArray(5, arr, dayNum);
        }else if(i == 2){
            arr[0] = "W";
            arr[1] = "W";
            arr[2] = "W";
            arr[3] = "W";
            arr[4] = "PH";
            arr[5] = "PH";
            arr = pushArray(6, arr, dayNum);
        }else if(i == 3){
            arr[0] = "W";
            arr[1] = "W";
            arr[2] = "W";
            arr[3] = "W";
            arr[4] = "W";
            arr[5] = "PH";
            arr[6] = "PH";
            arr = pushArray(7, arr, dayNum);
        }else if(i == 4){
            arr[0] = "PH";
            arr[1] = "W";
            arr[2] = "W";
            arr[3] = "W";
            arr[4] = "W";
            arr[5] = "W";
            arr[6] = "PH";
            arr[7] = "PH";
            arr = pushArray(8, arr, dayNum);
        }else {
            arr[0] = "PH";
            arr[1] = "PH";
            arr = pushArray(2, arr, dayNum);
        }
        setTimeout(function() {
            arrNew[0] = arr[dayNum-5];
            arrNew[1] = arr[dayNum-4];
            arrNew[2] = arr[dayNum-3];
            arrNew[3] = arr[dayNum-2];
            arrNew[4] = arr[dayNum-1];
            str2 = arrNew.join(",");
            console.log(str2)
            writeNewArrA(str2)

            // fs.open('./uploads/months/'+'March'+'.txt', 'r+', function(err, fd) {
            //     if (err) {
            //        return console.error(err);
            //     }
            //     console.log("File opened successfully!");
            // });

            str3 = arr.join(",")
            str3 = "\n%DefaultName% (1107-MICROSOFT CHINA CO LTD)," + str3
            console.log(str3)
            lastMonth.people.forEach(person => {
                fs.writeFile('./uploads/months/'+ monthArr[month - 1] +'.txt', str3, {flag:'a',encoding:'utf-8',mode:'0666'}, function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    fs.readFile('./uploads/months/'+ monthArr[month - 1] +'.txt', function (err, data) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log(data.toString());
                    });
                });
            })
        },500)
    },50)
})

router.post("/AppService/:year/:month/reload", upload.any('csv'), async (ctx) => {
    let year = ctx.params.year - 0
    let month = ctx.params.month - 0
    let section = "AppService"
    var monthArr = ["JanuaryA", "FebruaryA", "MarchA", "AprilA", "MayA", "JuneA", "JulyA", "AuguestA", "SeptemberA", "OctoberA", "NovemberA", "DecemberA"]
    let src = fs.createReadStream('./uploads/months/'+ monthArr[month-1] +'.txt');
    let people = await json(src)
    let countNum = 0
    let lastMonth = await Month.findOne({ 'year': year, 'month': (month - 1),'section': section })
    let currentMonth = await Month.findOne({ 'year': year, 'month': month,'section': section })
    people.forEach(person => {
        person.name = lastMonth.people[countNum].name
        countNum ++
    })
    if (currentMonth == null)
        var payload = insertMonth(year, month, people, section)
    else
        var payload = incrementMonth(currentMonth, people)
    try {
        await payload.save()
        ctx.body = "all good"
    }
    catch(e) {
        ctx.status = 400
        ctx.body = "something went wrong"
        console.log(e)
    }
})

router.post("/DEV/:year/:month/init", upload.any('csv'), async (ctx) => {
    let section = "DEV"
    let year = ctx.params.year
    let month = ctx.params.month
    let lastMonth = await Month.findOne({ 'year': year, 'month': (month - 1),'section': section })
    var data = fs.readFileSync('./uploads/mythD.txt');
    var str1 = data.toString();
    var str2, str3
    var arr = str1.split(",");
    var arrNew=new Array();
    var i = 0;
    var monthArr = ["JanuaryD", "FebruaryD", "MarchD", "AprilD", "MayD", "JuneD", "JulyD", "AuguestD", "SeptemberD", "OctoberD", "NovemberD", "DecemberD"]
    var dayNumArr = [31,28,31,30,31,30,31,31,30,31,30,31]
    var dayNum = dayNumArr[month-1];
    if(year % 4 == 0 && month == 2) { // leap year + Feb => 29 days
        dayNum++;
    }
    while(arr[i] != "PH") {
        i++;
        if(i > 4) {
            break;
        }
    }

    setTimeout(function() {
        if(i == 0 && arr[i+1] != "PH") {
            arr[0] = "W";
            arr[1] = "PH";
            arr[2] = "PH";
            arr = pushArray(3, arr, dayNum);
            //console.log(arr)
        }else if(i == 0 && arr[i+1] == "PH"){
            arr[0] = "W";
            arr[1] = "W";
            arr[2] = "PH";
            arr[3] = "PH";
            arr = pushArray(4, arr, dayNum);
        }else if(i == 1){
            arr[0] = "W";
            arr[1] = "W";
            arr[2] = "W";
            arr[3] = "PH";
            arr[4] = "PH";
            arr = pushArray(5, arr, dayNum);
        }else if(i == 2){
            arr[0] = "W";
            arr[1] = "W";
            arr[2] = "W";
            arr[3] = "W";
            arr[4] = "PH";
            arr[5] = "PH";
            arr = pushArray(6, arr, dayNum);
        }else if(i == 3){
            arr[0] = "W";
            arr[1] = "W";
            arr[2] = "W";
            arr[3] = "W";
            arr[4] = "W";
            arr[5] = "PH";
            arr[6] = "PH";
            arr = pushArray(7, arr, dayNum);
        }else if(i == 4){
            arr[0] = "PH";
            arr[1] = "W";
            arr[2] = "W";
            arr[3] = "W";
            arr[4] = "W";
            arr[5] = "W";
            arr[6] = "PH";
            arr[7] = "PH";
            arr = pushArray(8, arr, dayNum);
        }else {
            arr[0] = "PH";
            arr[1] = "PH";
            arr = pushArray(2, arr, dayNum);
        }
        
        setTimeout(function() {
            arrNew[0] = arr[dayNum-5];
            arrNew[1] = arr[dayNum-4];
            arrNew[2] = arr[dayNum-3];
            arrNew[3] = arr[dayNum-2];
            arrNew[4] = arr[dayNum-1];
            str2 = arrNew.join(",");
            console.log(str2)
            writeNewArrD(str2)

            // fs.open('./uploads/months/'+'March'+'.txt', 'r+', function(err, fd) {
            //     if (err) {
            //        return console.error(err);
            //     }
            //     console.log("File opened successfully!");
            // });

            str3 = arr.join(",")
            str3 = "\n%DefaultName% (1107-MICROSOFT CHINA CO LTD)," + str3
            console.log(str3)
            lastMonth.people.forEach(person => {
                fs.writeFile('./uploads/months/'+ monthArr[month - 1] +'.txt', str3, {flag:'a',encoding:'utf-8',mode:'0666'}, function(err) {
                    if (err) {
                        return console.error(err);
                    }
                    fs.readFile('./uploads/months/'+ monthArr[month - 1] +'.txt', function (err, data) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log(data.toString());
                    });
                });
            })
        },500)
    },50)
})

router.post("/DEV/:year/:month/reload", upload.any('csv'), async (ctx) => {


    let year = ctx.params.year - 0
    let month = ctx.params.month - 0
    let section = "DEV"
    var monthArr = ["JanuaryD", "FebruaryD", "MarchD", "AprilD", "MayD", "JuneD", "JulyD", "AuguestD", "SeptemberD", "OctoberD", "NovemberD", "DecemberD"]
    let src = fs.createReadStream('./uploads/months/'+ monthArr[month-1] +'.txt');
    let people = await json(src)
    let countNum = 0
    let lastMonth = await Month.findOne({ 'year': year, 'month': (month - 1),'section': section })
    let currentMonth = await Month.findOne({ 'year': year, 'month': month,'section': section })
    people.forEach(person => {
        person.name = lastMonth.people[countNum].name
        countNum ++
    })
    if (currentMonth == null)
        var payload = insertMonth(year, month, people, section)
    else
        var payload = incrementMonth(currentMonth, people)
    try {
        await payload.save()
        ctx.body = "all good"
    }
    catch(e) {
        ctx.status = 400
        ctx.body = "something went wrong"
        console.log(e)
    }
})



router.post("/AppService/upload/:year/:month", upload.any('csv'), async (ctx) => {
    let tmp_path = ctx.req.files[0].path;
    console.log(tmp_path)
    let src = fs.createReadStream(tmp_path);
    let people = await json(src)
    let year = ctx.params.year - 0
    let month = ctx.params.month - 0
    let section = "AppService"
    let currentMonth = await Month.findOne({ 'year': ctx.params.year, 'month': ctx.params.month,'section': 'AppService' })
    if (currentMonth == null)
        var payload = insertMonth(year, month, people, section)
    else
        var payload = incrementMonth(currentMonth, people)
    try {
        await payload.save()
        ctx.body = "all good"
    }
    catch(e) {
        ctx.status = 400
        ctx.body = "something went wrong"
        console.log(e)
    }
})

router.post("/DEV/upload/:year/:month", upload.any('csv'), async (ctx) => {
    let tmp_path = ctx.req.files[0].path;
    let src = fs.createReadStream(tmp_path);
    let people = await json(src)
    console.log(src);
    let year = ctx.params.year - 0
    let month = ctx.params.month
    let section = "DEV"
    let currentMonth = await Month.findOne({ 'year': ctx.params.year, 'month': ctx.params.month,'section': 'DEV' })
    if (currentMonth == null)
        var payload = insertMonth(year, month, people, section)
    else
        var payload = incrementMonth(currentMonth, people)
    try {
        await payload.save()
        ctx.body = "all good"
    }
    catch(e) {
        ctx.status = 400
        ctx.body = "something went wrong"
        console.log(e)
    }
})

io.on("connection", socket => {
    socket.join(socket.handshake.query.path)
    socket.on('hello', socket => {
        console.log(socket.rooms)
    })
})

app
    .use(router.routes())
    .use(router.allowedMethods())
    .use(serve(path.resolve(__dirname + staticPath)))
    //catch all for Vue app
    .use(async ctx => { await send(ctx, "index.html", {root: path.resolve(__dirname + staticPath)})})

server.listen(process.env.PORT || 3030, () => {
    console.log("Listening on " + (process.env.PORT || 3030))
});
