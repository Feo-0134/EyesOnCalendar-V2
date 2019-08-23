// Database
const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
const models = require('./models/Month')
const Month = models.Month
const fs = require('fs')
const json = require('./convertCsv.js')

const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const serve = require('koa-static')
const path = require('path')
const send = require('koa-send')
const app = new Koa()
const router = new Router({ prefix: '/api' })
const multer = require('koa-multer')
const upload = multer({ dest: 'uploads/' })

const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)

require('dotenv').config()

var staticPath = ''
var connString = ''
const errorMsg = 'Record not found'

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === undefined) {
  staticPath = '/dist/'
  connString = process.env.DB_CONNECTSTRING_PRODUCTION
} else {
  var DB_CONNECTSTRING_DEV = 'mongodb://jerytest:IZ8nYAVROPoQL8kSalbtMwsAhBK8oKft7IdNMm6NFXHrPwinNVmxrGsmURfSD8N5yxFemsMRtIxX5DWG6epJ1A==@jerytest.documents.azure.com:10255/React?ssl=true&replicaSet=globaldb'
  // var connString = "mongodb://mayocalendarv2-dev:CiXxW30UqowaAs8CiAVyNiLgJ2UkRmpN6KXBGcJWamGmN2sNYkwcfhRhXQqGfi6jOFH6imOniww5Wn6tX2dIIA%3D%3D@mayocalendarv2-dev.documents.azure.com:10255/?ssl=true&replicaSet=globaldb"
  staticPath = './client/dist/'
  connString = DB_CONNECTSTRING_DEV
}

mongoose.connect(connString)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {
  console.log('Connected to DB')
})

router.use(bodyParser())
/* koa interface demo */
// router.get('/', ctx => {
//     ctx.body = "Hello"
// })

router.get('/:pod/:year/:month', async (ctx) => {
  var p = ctx.params
  try {
    var result = await Month.findOne({ year: p.year, month: p.month, section: p.pod })
    if (result == null) { throw (errorMsg) } else ctx.body = result
  } catch (e) {
    ctx.status = 404
    ctx.body = e
    console.log(e)
  }
})

router.post('/:pod/:year/:month/:person/:day', bodyParser(), async (ctx) => {
  var p = ctx.params
  var b = ctx.request.body
  console.log(b)
  try {
    var currentMonth = await Month.findOne({ year: p.year, month: p.month, section: p.pod })
    if (currentMonth == null) { throw (errorMsg) }
    var day = currentMonth.people.id(p.person).days.id(p.day)
    day.workType = b.workType
    day.workDay = b.workDay
    var result = await currentMonth.save()
    // if indexes are set, emit update
    if (b.indexes !== undefined) { io.to('/' + p.year + '/' + p.month).emit('update', b) }
    ctx.body = result
  } catch (e) {
    ctx.status = 400
    ctx.body = e
    console.log(e)
  }
})

function insertMonth (year, month, people, section) {
  console.log('Inserting Full Month')
  return new Month({
    year: year,
    month: month,
    people: people,
    section: section
  })
}

function existRecordName (month, name) {
  console.log('eeeeeee')
  let count = 0
  let position = -1
  const name2Match = name.split(' ')
  month.people.forEach(person => {
    const nameArr = person.name.split(' ')
    if (name2Match.length >= 2) {
      if (nameArr[nameArr.length - 1] === name2Match[name2Match.length - 1]) { // use alias to test duplication
        position = count
      }
    }
    count++
  })
  if (position === -1) {
    return true
  }
  return false
}

function incrementMonth (month, people) {
  console.log('Incremental push')
  people.forEach(person => {
    month.people.push(person)
  })
  return month
}

function decrementMonth (month, name) {
  console.log('decrementMonth')
  let count = 0
  let position = -1
  const name2Match = name.split(' ')
  month.people.forEach(person => {
    const nameArr = person.name.split(' ')
    if (nameArr[nameArr.length - 1] === name2Match[name2Match.length - 1] ||
      nameArr[nameArr.length - 1] === ('(' + name2Match[name2Match.length - 1] + ')')) { // use alias to test duplication
      position = count
    }
    if (nameArr[0].toLowerCase() === name2Match[0].toLowerCase() && nameArr[1].toLowerCase() === name2Match[1].toLowerCase()) { // use alias to test duplication
      position = count
    }
    count++
  })
  if (position !== -1) { month.people.splice(position, 1) } else { return -1 }
  return month
}

router.post('/:pod/:year/:month/person', upload.any('csv'), bodyParser(), async (ctx) => {
  const uploadDict = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'auguest', 'september', 'october', 'november', 'december']
  var testLock = false
  var p = ctx.params
  var b = ctx.request.body
  console.log(b) // get the request body
  const src = fs.createReadStream('./uploads/' + uploadDict[p.month - 1] + '.txt')
  console.log(src) // check the replacement application
  const people = await json(src)
  people[0].name = b.name
  testLock = true
  console.log(people) // check the replacement application
  const currentMonth = await Month.findOne({ year: p.year, month: p.month, section: p.pod })
  if (testLock) {
    if (existRecordName(currentMonth, b.name)) {
      console.log('there')
      var payload = incrementMonth(currentMonth, people)
      try {
        console.log('there')
        await payload.save()
        ctx.body = 'all good'
      } catch (e) {
        console.log(e)
        ctx.status = 400
        ctx.body = 'something went wrong'
      }
    } else {
      console.log('here')
      ctx.body = 'Record exist'
    }
  }
})

/** ************************************* Feature 10 Delete a member from the calendar **************************************/
router.post('/:pod/:year/:month/delete', bodyParser(), async (ctx) => {
  var testLock = false
  var p = ctx.params
  var b = ctx.request.body
  console.log(b) // get the request body DONE
  testLock = true // check the replacement application
  const currentMonth = await Month.findOne({ year: p.year, month: p.month, section: p.pod })
  if (testLock) {
    var payload = decrementMonth(currentMonth, b.name)
    if (payload === -1) { ctx.body = 'Record not exist'; return }
    try {
      await payload.save()
      ctx.body = 'all good'
    } catch (e) {
      ctx.status = 400
      ctx.body = 'something went wrong'
      console.log(e)
    }
  }
})

/** ************************************* Feature 9 Init a new Calendar **************************************/
function calendarCleaner (filePth) {
  const data = fs.readFileSync(filePth)
  const strAll = data.toString()
  const arrAll = strAll.split('\r\n')
  fs.writeFile(filePth, arrAll[0] + '\r\n' + arrAll[1], { flag: 'w', encoding: 'utf-8', mode: '0666' }, function (err) {
    if (err) {
      return console.error(err)
    }
    // console.log("File opened successfully!");
  })
}

router.post('/:pod/:year/:month/init', upload.any('csv'), async (ctx) => {
  var p = ctx.params
  var lastMon = (p.month - 1) % 12 ? (p.month - 1) % 12 : 12
  var lastYear = lastMon === 12 ? p.year - 1 : p.year
  var thisMon = new Date().getMonth() + 1
  var flag = false
  if (thisMon === lastMon) {
    flag = true
  }
  const lastMonth = await Month.findOne({ year: lastYear, month: lastMon, section: p.pod })
  const monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Auguest', 'September', 'October', 'November', 'December']
  const str2 = (p.year).toString() + '-' + (p.month).toString() + '-'
  console.log('initiate ' + str2 + ' Calendar')
  console.log('last calendar:' + lastYear + '-' + lastMon)
  const dayNum = new Date(p.year, p.month, 0).getDate()
  // eslint-disable-next-line no-array-constructor
  const arrMonth = new Array()
  let cnt = 0
  const filePath = './uploads/months/' + monthArr[p.month - 1] + '.txt'
  calendarCleaner(filePath)
  if (flag) {
    setTimeout(function () {
      while (cnt < dayNum) {
        var tmp = str2 + (cnt + 1).toString()
        var dayPtr = new Date(tmp).getDay().toString()
        if (dayPtr === '0' || dayPtr === '6') { // "0" stands Sundays & "6" stands Saturdays
          arrMonth[cnt] = 'PH'
        } else {
          arrMonth[cnt] = 'W'
        }
        cnt++
      }
      var str3 = arrMonth.join(',')
      str3 = '\r\n%DefaultName% (1107-MICROSOFT CHINA CO LTD),' + str3
      lastMonth.people.forEach(person => {
        fs.writeFile(filePath, str3, { flag: 'a', encoding: 'utf-8', mode: '0666' }, function (err) {
          if (err) {
            return console.error(err)
          }
        })
      })
    }, 50)
  }
})

router.post('/:pod/:year/:month/reload', upload.any('csv'), async (ctx) => {
  var p = ctx.params
  var lastMon = (p.month - 1) % 12 ? (p.month - 1) % 12 : 12
  var lastYear = lastMon === 12 ? p.year - 1 : p.year
  var thisMon = new Date().getMonth() + 1
  var flag = false
  if (thisMon === lastMon) {
    flag = true
  }
  const monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Auguest', 'September', 'October', 'November', 'December']
  const filePath = './uploads/months/' + monthArr[p.month - 1] + '.txt'
  if (flag) {
    const src = fs.createReadStream(filePath)
    const people = await json(src)
    const lastMonth = await Month.findOne({ year: lastYear, month: lastMon, section: p.pod })
    let countNum = 0
    people.forEach(person => {
      person.name = lastMonth.people[countNum].name
      countNum++
    })
    const currentMonth = await Month.findOne({ year: p.year, month: p.month, section: p.pod })
    if (currentMonth == null) {
      var payload = insertMonth(p.year, p.month, people, p.pod)
    } else {
      console.log('Month Already There.')
    }
    try {
      await payload.save()
      ctx.body = 'Record Saved'
    } catch (e) {
      ctx.status = 400
      ctx.body = e
      console.log(e)
    }
    setTimeout(function () {
      calendarCleaner(filePath)
    }, 2000)
  }
})

io.on('connection', socket => {
  socket.join(socket.handshake.query.path)
  socket.on('hello', socket => {
    console.log(socket.rooms)
  })
})

app
  .use(router.routes())
  .use(router.allowedMethods())
  .use(serve(path.resolve(__dirname, staticPath)))
// catch all for Vue app
  .use(async ctx => { await send(ctx, 'index.html', { root: path.resolve(__dirname, staticPath) }) })

server.listen(process.env.PORT || 3030, () => {
  console.log('Listening on ' + (process.env.PORT || 3030))
})

/** ************************************* update the new calendar by upload a csv **************************************/
router.post('/:pod/upload/:year/:month', upload.any('csv'), async (ctx) => {
  var p = ctx.params
  const tmpPath = ctx.req.files[0].path
  console.log(tmpPath)
  const src = fs.createReadStream(tmpPath)
  const people = await json(src)
  const currentMonth = await Month.findOne({ year: p.year, month: p.month, section: p.pod })
  var payload
  if (currentMonth == null) { payload = insertMonth(p.year, p.month, people, p.pod) } else { payload = incrementMonth(currentMonth, people) }
  try {
    await payload.save()
    ctx.body = 'all good'
  } catch (e) {
    ctx.status = 400
    ctx.body = 'something went wrong'
    console.log(e)
  }
})

/** ************************************* Feature 7 Add a new member to the calendar **************************************/
// router.post("/:pod/:year/:month/person", upload.any('csv'), bodyParser(),async (ctx) => {
//     var p = ctx.params
//     var b = ctx.request.body
//     console.log(b) // get the request body
//     let monthArr = ["January", "February", "March", "April", "May", "June", "July", "Auguest", "September", "October", "November", "December"]
//     let altStr1 = monthArr[p.month] + (p.year).toString();
//     let altStr2 = "Employee Name";
//     let dayNum = new Date(p.year, p.month, 0).getDate();
//     let cnt = 0;
//     let arrMonth = new Array();
//     let str2 = (p.year).toString() + "-" + (p.month).toString() + "-";
//     while(cnt < dayNum) {
//         altStr1 += ",";
//         altStr2 += "," + (cnt+1).toString();
//         var tmp = str2 + (cnt+1).toString();
//         var dayPtr = new Date(tmp).getDay().toString();
//         if(dayPtr == "0" || dayPtr == "6") { // "0" stands Sundays & "6" stands Saturdays
//             arrMonth[cnt] = "PH";
//         }else {
//             arrMonth[cnt] = "W";
//         }
//         cnt++;
//     }
//     let str3 = arrMonth.join(",")
//     str3 = altStr1+"\r\n"+altStr2+"\r\n%DefaultName% (1107-MICROSOFT CHINA CO LTD)," + str3
//     fs.writeFile('./uploads/test.txt', str3, {flag:'w',encoding:'utf-8',mode:'0666'}, function(err) {
//         if (err) {
//             return console.error(err);
//         }
//     });
//     let testLock = false;
//     let src = fs.createReadStream('./uploads/test.txt');
//     let people = await json(src)
//     people[0].name = b.name
//     testLock = true;
//     console.log(people); //check the replacement application
//     let currentMonth = await Month.findOne({ 'year': p.year, 'month': p.month,'section': p.pod })
//     if(testLock)
//     {
//         var payload = incrementMonth(currentMonth, people)
//         try {
//             await payload.save()
//             ctx.body = "all good"
//         }
//         catch(e) {
//             ctx.status = 400
//             ctx.body = "something went wrong"
//             console.log(e)
//         }
//     }
// })
