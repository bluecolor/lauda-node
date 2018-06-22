
class Table {
  constructor (params = {}) {
    this.owner= undefined
    this.name = undefined
    this.longName = params.name
    this.connection = params.connection
    this.options = params.options || ''
    this.columns = []

    if(params.name.indexOf(".") !== -1) {
      this.owner = params.name.split('.')[0].toUpperCase()
      this.name = params.name.split('.')[1]
    } else {
      this.name = longName
    }
    if(this.name.indexOf('"') !== -1) {
      this.name = this.name.toUpperCase()
    }
  }

  getCreateQuery () {
    return `
      create table ${this.longName} (
        ${this.columns.map(c => c.getScript()).join(',')}
      ) ${this.options}
    `
  }

  getDropQuery () {
    return `drop table ${this.longName}`
  }

}

module.exports = Table