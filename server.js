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
  const uploadDict = ['january', 'february', 'march', 'april', 'may',
    'june', 'july', 'august', 'september', 'october', 'november', 'december']
  var p = ctx.params
  var b = ctx.request.body
  const currentMonth = await Month.findOne({ year: p.year, month: p.month, pod: p.pod })
  const src = await fs.createReadStream('./uploads/' + uploadDict[p.month - 1] + '.txt')
  const people = await json(src)
  // replace person's default info
  // by data from request body
  people[0].alias = b.alias
  people[0].name = b.name
  people[0].role = b.role
  people[0].principle = b.principle
  if (findRecord(currentMonth, b.alias)) { ctx.body = 'Record exist'; return }
  var payload = incrementMonth(currentMonth, people)
  try {
    await payload.save()
    ctx.body = 'success'
  } catch (e) {
    console.log('System Error: crash at insert record' + e)
    ctx.status = 400
    ctx.body = 'error'
  }
})

/* API to delete
 * records from a given month
 * with given alias
 */
router.post('/:pod/:year/:month/delete', bodyParser(), async (ctx) => {
  var p = ctx.params
  var b = ctx.request.body
  const currentMonth = await Month.findOne({ year: p.year, month: p.month, pod: p.pod })
  const payload = decrementMonth(currentMonth, b.alias)
  if (payload === -1) { ctx.body = 'Record not exist'; return }
  try {
    await payload.save()
    ctx.body = 'success'
  } catch (e) {
    ctx.status = 400
    ctx.body = 'error'
    console.log('System Error: crash at delete record' + e)
  }
})

/* Function to restore
 * calendar data, back to empty,
 * for calendar initiate
 */
function cleanCalendar (filePth) {
  const data = fs.readFileSync(filePth)
  const strData = data.toString()
  const arrData = strData.split('\r\n')
  fs.writeFile(filePth, arrData[0] + '\r\n' + arrData[1], { flag: 'w', encoding: 'utf-8', mode: '0666' }, function (err) {
    if (err) {
      return console.error('System Error: crash at clean calendar' + err)
    }
  })
}

/* API to initiate
 * records for a given month,
 * (1/2) build the default template
 */
router.post('/:pod/:year/:month/init', upload.any('csv'), async (ctx) => {
  const monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  // compare current month and target month
  // if target month == current month + 1
  // the initiate process goes on, else it stop
  var p = ctx.params
  var lastMon = (p.month - 1) % 12 ? (p.month - 1) % 12 : 12
  var lastYear = lastMon === 12 ? p.year - 1 : p.year
  var thisMon = new Date().getMonth() + 1
  var flag = false
  var str2 = (p.year).toString() + '-' + (p.month).toString() + '-'
  console.log('initiate ' + str2 + ' Calendar')
  console.log('last calendar:' + lastYear + '-' + lastMon)
  if (thisMon === lastMon) { flag = true }
  // eslint-disable-next-line no-array-constructor
  const arrMonth = new Array()
  const lastMonth = await Month.findOne({ year: lastYear, month: lastMon, pod: p.pod })
  const filePath = './uploads/months/' + monthArr[p.month - 1] + '.txt'
  const dayNum = new Date(p.year, p.month, 0).getDate()
  var cnt = 0
  cleanCalendar(filePath)
  if (flag) {
    setTimeout(function () {
      while (cnt < dayNum) {
        var tmp = str2 + (cnt + 1).toString()
        var dayPtr = new Date(tmp).getDay().toString()
        if (dayPtr === '0' || dayPtr === '6') {
          // "0" stands Sundays & "6" stands Saturdays
          arrMonth[cnt] = 'PH'
        } else {
          arrMonth[cnt] = 'W'
        }
        cnt++
      }
      var str3 = arrMonth.join(',')
      str3 = '\r\n%DefaultName% (DefaultAlias-DefaultRole-DefaultPrinciple),' + str3
      lastMonth.people.forEach(person => {
        fs.writeFile(filePath, str3, { flag: 'a', encoding: 'utf-8', mode: '0666' },
          function (err) {
            if (err) { return console.error(err) }
          })
      })
    }, 50)
  }
})

/* API to initiate
 * records for a given month,
 * (2/2) filling with the given data
 */
router.post('/:pod/:year/:month/reload', upload.any('csv'), async (ctx) => {
  const monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  // compare current month and target month
  // if target month == current month + 1
  // the initiate process goes on, else it stop
  var p = ctx.params
  var lastMon = (p.month - 1) % 12 ? (p.month - 1) % 12 : 12
  var lastYear = lastMon === 12 ? p.year - 1 : p.year
  var thisMon = new Date().getMonth() + 1
  var flag = false
  if (thisMon === lastMon) { flag = true }
  const filePath = './uploads/months/' + monthArr[p.month - 1] + '.txt'
  // if target month == current month + 1
  // replace the default data (alias, name, role, principle)
  // with data from last month
  if (flag) {
    const src = await fs.createReadStream(filePath)
    const people = await json(src)
    const lastMonth = await Month.findOne({ year: lastYear, month: lastMon, pod: p.pod })
    var countNum = 0
    people.forEach(person => {
      person.name = lastMonth.people[countNum].name
      countNum++
    })
    const currentMonth = await Month.findOne({ year: p.year, month: p.month, pod: p.pod })
    if (currentMonth == null) {
      // eslint-disable-next-line no-array-constructor
      var daylock = new Array()
      var payload = newMonth(p.year, p.month, p.pod, daylock, people)
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
    // restore calendar generator data
    // help it back to empty
    setTimeout(function () {
      cleanCalendar(filePath)
    }, 2000)
  }
})

/* Very First Calendar Generator
 * for a new team to join the tool
 * initiate their data about members
 */
router.post('/:pod/newupload/:year/:month', upload.any('csv'), async (ctx) => {
  var p = ctx.params
  const tmpPath = ctx.req.files[0].path
  console.log(tmpPath)
  const src = fs.createReadStream(tmpPath)
  const people = await json(src)
  // eslint-disable-next-line no-array-constructor
  const daylock = new Array()
  var payload = newMonth(p.year, p.month, p.pod, daylock, people)
  try {
    await payload.save()
    ctx.body = 'success'
  } catch (e) {
    ctx.status = 400
    ctx.body = 'error'
    console.log(e)
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

/* update the new calendar by upload a csv
 * which is no longer used in the project
 * only for back up
 */
router.post('/:pod/upload/:year/:month', upload.any('csv'), async (ctx) => {
  var p = ctx.params
  const tmpPath = ctx.req.files[0].path
  console.log(tmpPath)
  const src = fs.createReadStream(tmpPath)
  const people = await json(src)
  const currentMonth = await Month.findOne({ year: p.year, month: p.month, section: p.pod })
  var payload
  // eslint-disable-next-line no-array-constructor
  var daylock = new Array()
  if (currentMonth == null) { payload = newMonth(p.year, p.month, p.pod, daylock, people) } else { payload = incrementMonth(currentMonth, people) }
  try {
    await payload.save()
    ctx.body = 'success'
  } catch (e) {
    ctx.status = 400
    ctx.body = 'error'
    console.log(e)
  }
})
