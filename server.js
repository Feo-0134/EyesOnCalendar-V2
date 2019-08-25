const models = require('./models/NewMonth')
const Month = models.Month
const fs = require('fs')
const json = require('./newConvertCsv.js')

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
const errorMsg = 'Record not found'

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === undefined) {
  staticPath = '/dist/'
} else {
  staticPath = './client/dist/'
}

const db = require('./mongodb')
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
    var result = await Month.findOne({ year: p.year, month: p.month, pod: p.pod })
    if (result == null) { throw (errorMsg) } else ctx.body = result
  } catch (e) {
    ctx.status = 404
    ctx.body = e
    console.log(e)
  }
})

/* API for update employee dayType
 * Once update one dayType of one person
 */
router.post('/:pod/:year/:month/:person/:day', bodyParser(), async (ctx) => {
  var p = ctx.params
  var b = ctx.request.body
  console.log(b)
  try {
    var currentMonth = await Month.findOne({ year: p.year, month: p.month, pod: p.pod })
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

/* Function to generate a new month
 *
 */
function newMonth (year, month, pod, daylock, people) {
  console.log('Inserting Full Month')
  return new Month({
    year: year,
    month: month,
    pod: pod,
    daylock: daylock,
    people: people
  })
}

/* Function to search
 * a record with a given alias
 * in a given month
 */
function findRecord (month, alias) {
  month.people.forEach(person => {
    if (person.alias.toString() === alias.toString()) {
      return true
    }
  })
  return false
}

/* Function to insert
 * records to a given month
 */
function incrementMonth (month, people) {
  console.log('Incremental push')
  people.forEach(person => {
    month.people.push(person)
  })
  return month
}

/* Function to delete
 * records from a given month
 * with a given alias
 */
function decrementMonth (month, alias) {
  console.log('decrementMonth')
  let position = 0
  month.people.forEach(person => {
    // use alias to delete a record
    if (person.alias === alias) {
      month.people.splice(position, 1)
      return month
    }
    position = position + 1
  })
  return -1
}

/* API to insert
 * records to a given month
 * with given alias
 * and a default dayType
 */
router.post('/:pod/:year/:month/person', upload.any('csv'), bodyParser(), async (ctx) => {
  const uploadDict = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']
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
    if (findRecord(currentMonth, b.name)) {
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
  const monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
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
  const monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
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

/* new upload */
router.post('/:pod/newupload/:year/:month', upload.any('csv'), async (ctx) => {
  var p = ctx.params
  const tmpPath = ctx.req.files[0].path
  console.log('NEW UPLOAD')
  console.log(tmpPath)
  const src = fs.createReadStream(tmpPath)
  const people = await json(src)
  // eslint-disable-next-line no-array-constructor
  const daylock = new Array()
  var payload = newMonth(p.year, p.month, p.pod, daylock, people)
  try {
    await payload.save()
    ctx.body = 'all good'
  } catch (e) {
    ctx.status = 400
    ctx.body = 'something went wrong'
    console.log(e)
  }
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
