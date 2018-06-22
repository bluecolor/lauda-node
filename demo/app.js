/* Copyright (c) 2015, 2018, Oracle and/or its affiliates. All rights reserved. */
let oracledb = require('oracledb');

oracledb.extendedMetaData = true


// Get a non-pooled connection
oracledb.getConnection(
  {
    user          : "lauda",
    password      : "lauda",
    connectString : "localhost:49161/xe"
  },
  function(err, connection) {
    if (err) {
      console.error(err);
      return;
    }
    console.log("connected")
    connection.execute(
      // The statement to execute
      `SELECT owner, table_name FROM all_tables`,

      // The "bind value" 180 for the bind variable ":id"
      [],

      // execute() options argument.  Since the query only returns one
      // row, we can optimize memory usage by reducing the default
      // maxRows value.  For the complete list of other options see
      // the documentation.
      { maxRows: 1
        //, outFormat: oracledb.OBJECT  // query result format
        //, extendedMetaData: true      // get extra metadata
        //, fetchArraySize: 100         // internal buffer allocation size for tuning
      },

      // The callback function handles the SQL execution results
      function(err, result) {
        if (err) {
          console.error(err);
          doRelease(connection);
          return;
        }
        console.log(result.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
        // console.log(result.rows);     // [ [ 180, 'Construction' ] ]
        doRelease(connection);
      });
  });

// Note: connections should always be released when not needed
function doRelease(connection) {
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}