let em = require('./events')
let connector = require('./connector')
let options = require('./options')
let Table = require('./table')
let Column = require('./column')
let constants = require('./constants')
let extractor = require('./extractor')

let name = options.sourceTable
let url = options.sourceUrl
let username = options.sourceUsername
let password = options.sourcePassword
let filter = options.filter

let connection = {url, username, password}
let params = {name, connection, filter}

let source = new Table(params)
let promise= connector
  .findColumns(source)
  .then(columns => {
    console.log(columns)
    source.columns = columns.map(c => new Column(c))
    return Promise.resolve(source)
  })
  .then(source => {
    return connector.findRanges(source, options.parallel).then(ranges => {
      return Promise.resolve({ranges, source})
    })
  })
  .catch(err => console.log(err))



name = options.targetTable ? options.targetTable : source.name
url = options.targetUrl
username = options.targetUsername
password = options.targetPassword
connection = {url, username, password}
params = {name, connection}

let target = new Table(params)

promise = promise.then(({ranges, source}) => {
  if(options.create) {
    target.columns = source.columns
    return connector.dropCreate(target).then(target => {
      return Promise.resolve({source, target, ranges})
    })
  } else {
    return Promise.resolve({source, target, ranges})
  }
}).then(({source, target, ranges}) => {
  console.log(source.name)
  console.log(target.name)
  console.log(ranges)

  let recordDelimiter = options.recordDelimiter || constants.RECORD_DELIMITER
  let fieldDelimiter = options.fieldDelimiter || constants.FIELD_DELIMITER

  let total = 0
  em.global.on('child-write-done', (c) => {
    total += c
    console.log(`child-write-done -> ${c} : ${total}`)
  })

  ranges.forEach( (range, index) => {
    let file = `${options.path}/${index}.txt`
    let filters = [`rowid between '${range[0]}' and '${range[1]}'`]
    extractor.extract(source, {filters, file, recordDelimiter, fieldDelimiter})
  })
})




