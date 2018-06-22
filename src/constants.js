let db = require('oracledb')

module.exports = {

  getColumnTypeName (dbType) {
    switch (dbType) {
      case db.DB_TYPE_BINARY_DOUBLE :	return 'BINARY_DOUBLE'
      case db.DB_TYPE_BINARY_FLOAT	:	return 'BINARY_FLOAT'
      case db.DB_TYPE_BLOB	        : return 'BLOB'
      case db.DB_TYPE_CHAR          : return 'CHAR'
      case db.DB_TYPE_CLOB	        : return 'CLOB'
      case db.DB_TYPE_DATE          : return 'DATE'
      case db.DB_TYPE_LONG	      	: return 'LONG'
      case db.DB_TYPE_LONG_RAW		  : return 'LONG RAW'
      case db.DB_TYPE_NCHAR	        : return 'NCHAR'
      case db.DB_TYPE_NCLOB	        : return 'NCLOB'
      case db.DB_TYPE_NUMBER	      : return 'NUMBER'
      case db.DB_TYPE_NVARCHAR	    : return 'NVARCHAR'
      case db.DB_TYPE_RAW	          : return 'RAW'
      case db.DB_TYPE_ROWID	        : return 'ROWID'
      case db.DB_TYPE_TIMESTAMP	    : return 'TIMESTAMP'
      case db.DB_TYPE_TIMESTAMP_LTZ	: return 'TIMESTAMP WITH LOCAL TIME ZONE'
      case db.DB_TYPE_TIMESTAMP_TZ	: return 'TIMESTAMP WITH TIME ZONE'
      case db.DB_TYPE_VARCHAR		    : return 'VARCHAR2'
    }
  }
}