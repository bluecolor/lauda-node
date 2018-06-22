let connector = require('./connector')
let fs = require('fs')

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
        connection.queryStream(q).on('data', data => {
          fs.writeFile(params.file, data.join(';') + '\n', err => {
            if(err) { console.log(err) }
          })
        })
        .on('end', () => resolve())
        .on('error', () => reject())
      })
      .catch(err => reject(err))
    })

  }
}