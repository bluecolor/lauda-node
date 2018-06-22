let connector = require('./connector')
let fs = require('fs')
let em = require('./events')
let Transform = require('stream').Transform

let self = module.exports = {
  extract: (table, params = {}) => {
    let o = params.connection || table.connection
    return new Promise((resolve, reject) => {
      connector.connect(o).then(connection => {
        let filter = (params.filters && params.filters.length > 0) ? `where ${params.filters.join(' and ')}` : ''
        let q = `
          select
            ${table.columns.map(c => c.name).join(', ')}
          from
            ${table.longName}
            ${filter}
        `
        console.log(`SQL:\n${q}`)
        let out = fs.createWriteStream(params.file)
        let total = 0
        let buffer = []
        out.on('finish', () => {
          console.log('finis')
          out.close() //!
          em.global.emit('child-write-done', total)
          resolve(total)
        })
        // out.on('end',   () =>  {
        //   if (buffer.length > 0) {
        //     out.write(buffer.join(params.recordDelimiter))
        //     total += buffer.length
        //     buffer = []
        //   }
        // })
        out.on('error', (err) => {
          console.log(err)
          reject()
        })
        // out.on('data', data => {
        //   console.log(data)
        //   return
        //   buffer.push(data.join(params.fieldDelimiter))
        //   if (buffer.length === 10000) {
        //     out.write(buffer.join(params.recordDelimiter))
        //     total += buffer.length
        //     buffer = []
        //   }
        // })
        let stringify = new Transform({objectMode: true});
        stringify._transform = function(data, encoding, done) {
          console.log(data)
          // stringify.push(data.join(params.fieldDelimiter)+params.fieldDelimiter);
          done();
        };
        connection.queryStream(q).pipe(stringify) //.pipe(out)
      })
      .catch(err => reject(err))
    })

  }
}