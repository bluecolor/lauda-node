let db = require('oracledb')
let Q = require('./query')

db.extendedMetaData = true


let self = module.exports = {
  connect: (params) => {
    return new Promise((resolve, reject) => {
      db.getConnection({
        user          : params.username,
        password      : params.password,
        connectString : params.url
      }, (err, connection) => {
        if(err) {
          reject(err)
        }
        else {
          resolve(connection)
        }
      })
    })
  },
  close: (connection) => {
    return new Promise((resolve, reject) => {
      connection.close(err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },
  findColumns: (table, params = {}) => {
    let o = params.connection || table.connection
    return new Promise((resolve, reject) => {
      self.connect(o).then(connection => {
        const q = `select * from ${table.longName} where 1=2`
        console.log(`Finding columns for ${table.longName}`)
        console.log(`SQL:\n${q}`)
        connection.execute(q, (err, result) => {
          self.close(connection)
          if (err) {
            reject(err)
          } else {
            resolve(result.metaData)
          }
        })
      }).catch(err => reject(err))
    })
  },
  findRanges: (table, parallel = 16, params = {}) => {
    let o = params.connection || table.connection
    return new Promise((resolve, reject) => {
      self.connect(o).then(connection => {
        let q = Q.getSplitQuery(table.owner, table.name, parallel)
        connection.execute(q, (err, result) => {
          self.close(connection)
          if (err) { reject(err) }
          else {resolve(result.rows)}
        })
      }).catch(err => { reject(err) })
    })
  },
  drop: (table, params = {}) => {
    let o = params.connection || table.connection
    return new Promise((resolve, reject) => {
      self.connect(o).then(connection => {
        const q = table.getDropQuery()
        connection.execute(q, (err, result) => {
          self.close(connection)
          if(err && err.errorNum !== 942) { // Table not exists
            reject(err)
          } else {
            resolve(table)
          }
        })
      }).catch(err => reject(err))
    })
  },
  create: (table, params = {}) => {
    let o = params.connection || table.connection
    return new Promise((resolve, reject) => {
      self.connect(o).then(connection => {
        const q = table.getCreateQuery()
        console.log(`SQL:\n${q}`)
        connection.execute(q, (err, result) => {
          self.close(connection)
          if(err) {reject(err)} else { resolve (table) }
        })
      }).catch(err => {reject(err)})
    })
  },
  dropCreate: (table, params = {}) => {
    return self
      .drop(table, params)
      .then(_ => { return self.create(table, params) })
  }
}