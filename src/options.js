var options = require('yargs')
  .options({
    'quiet': {
      alias: 'q',
      describe: 'Silent logs'
    },
    'source-url': {
      alias: 's',
      describe: 'Source url',
      demandOption: true
    },
    'source-username': {
      alias: 'su',
      describe: 'Source connection username',
      demandOption: true
    },
    'source-password': {
      alias: 'sp',
      describe: 'Source connection password',
      demandOption: true
    },
    'target-url': {
      alias: 't',
      describe: 'Target url',
      demandOption: true
    },
    'target-username': {
      alias: 'tu',
      describe: 'Target connection username',
      demandOption: true
    },
    'target-password': {
      alias: 'tp',
      describe: 'Target connection password',
      demandOption: true
    },
    'source-table': {
      alias: 'st',
      describe: 'Source table eg: TABLE_NAME or SCHEMA.TABLE_NAME',
      demandOption: true
    },
    'filter': {
      alias: 'f',
      describe: 'Source filter'
    },
    'target-table': {
      alias: 'tt',
      describe: 'Target table eg: TABLE_NAME or SCHEMA.TABLE_NAME'
    },
    'create': {
      alias: 'c',
      describe: 'Create target table'
    },
    'truncate': {
      alias: 'x',
      describe: 'Truncate target table'
    },
    'parallel': {
      alias: 'p',
      describe: '# of parallel queries',
      demandOption: true
    }
  }).help().argv

module.exports =  options