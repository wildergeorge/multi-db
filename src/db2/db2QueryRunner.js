var db2 = require('ibm_db');
var Pool = require("ibm_db").Pool
   ,pool = new Pool();
//db2.debug(true)

function db2ExecuteQuery(db2ConnectionString, db2Query, db2Variables){

  var db2ReturnObject = {};

  return new Promise((resolve, reject) => {

    pool.open(db2ConnectionString, function (errOpen, conn) {

      if(errOpen){

        db2ReturnObject.err = errOpen;
        db2ReturnObject.errOrigin = 'db2QueryRunner.db2ExecuteQuery'
        db2ReturnObject.errText = 'Cannot open connection to DB2 Database.';
        resolve(db2ReturnObject)
      }

      conn.prepare(db2Query, (errPrepare, stmt) => {

        if(errPrepare){

          conn.closeSync();
          db2ReturnObject.err = errPrepare;
          db2ReturnObject.errOrigin = 'db2QueryRunner.db2ExecuteQuery'
          db2ReturnObject.errText = 'Cannot prepare DB2 Statement : ' + db2Query;
          resolve(db2ReturnObject)
        }

        stmt.execute(db2Variables, (errExecute, result) => {

          if(errExecute){

            conn.closeSync();
            db2ReturnObject.err = errExecute;
            db2ReturnObject.errOrigin = 'db2QueryRunner.db2ExecuteQuery'
            db2ReturnObject.errText = 'Cannot execute DB2 Statement: ' + db2Query;
            resolve(db2ReturnObject)
          }

          result.fetch((errFetch, data) => {

            if(errFetch){

              conn.closeSync();
              db2ReturnObject.err = errFetch;
              db2ReturnObject.errOrigin = 'db2QueryRunner.db2ExecuteQuery'
              db2ReturnObject.errText = 'Cannot fetch Resultset for DB2 Query: ' + db2Query + '. Maybe, resultset is empty.'
              resolve(db2ReturnObject)
            }

            conn.close(() => {
              
              db2ReturnObject.data = data
              resolve(db2ReturnObject);
            });
          });
        });
      });
    });
  });
};

function db2ExecuteSelect(db2ConnectionString, db2Query, db2Variables){

  var db2ReturnObject = {};

  return new Promise(function(resolve, reject){

    db2.open(db2ConnectionString, (errOpen, conn) => {

      if(errOpen){

        db2ReturnObject.err = errOpen
        resolve(db2ReturnObject)
      }

      conn.prepare(db2Query, (errPrepare, stmt) => {

        if(errPrepare){

          conn.closeSync()
          db2ReturnObject.err = errPrepare
          resolve(db2ReturnObject)
        }

        stmt.execute(db2Variables, (errExecute, result) => {

          if(errExecute){

            db2ReturnObject.err = errExecute
            resolve(db2ReturnObject)
          }

          result.fetch((errFetch, data) => {

            if(errFetch){

              db2ReturnObject.err = errFetch
              resolve(db2ReturnObject)
            }

            conn.close(() => {

              db2ReturnObject.data = data
              resolve(db2ReturnObject);
            });
          });
        });
      });
    });
  });
}

module.exports = {db2ExecuteSelect: db2ExecuteSelect, db2ExecuteQuery: db2ExecuteQuery};
