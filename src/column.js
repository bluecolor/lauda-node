let constants = require('./constants')

class Column {
  constructor (params = {}) {
    this.name = params.name
    this.dbType = params.dbType
    this.typeName = constants.getColumnTypeName(params.dbType)
    this.size = params.size
    this.precision = params.precision
  }

  getSqlLoaderTypeName () {
    switch(this.columnTypeName) {
      case 'DATE': return 'TIMESTAMP'
    }
    return this.columnTypeName
  }

  getScript () {
    let script = `${this.name} ${this.typeName}`

    if (this.size && this.precision && this.precision != 0) {
      script = `${script} (${this.size}, ${this.precision})`
    } else if (this.size) {
      script = `${script} (${this.size})`
    }
    return script
  }

}

module.exports = Column