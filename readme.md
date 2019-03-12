# Module for working with multiple DB2 Database Connections

* Still in developing state
* Supports basic functions using Active Record Style for DB2
* Implemented functions
  * getById(id)
  * get(field, value, caseSensitive)
  * create()
  * remove()
  * update()
  * getLikeALL(field, value, caseSensitive) adds Wildcards around value
  * getLikeRight(field, value, caseSensitive) adds Wildcard on the right side of value
  * getLikeLeft(field, value, caseSensitive) adds Wildcard on the left side of value
  * getAllUp(field) get Data from table sorted by field ascending
  * getAllDown(field) get Data from table sorted by field descending
  * createGetById
* Functions for standard Queries
  * manualQuery(db, query, [data]) data can be empty, prepared statement is used
  * manualNonQuery(db, query, [data]) data can be empty, prepared statement is used
* Uses connection pooling of official db2 module
* caseSensitive is of type boolean

Module is working with prepared statements to prevent sql injection.

__How to use:__

```javascript
var multiDB = require('multi-db-tool');
var mutli = new multiDB(require('path to config file ..', 'passphrase for decrypting properties ...')
```

Note: Decrpyting is not implemented yet, should be set to null

### Example for config file:
```javascript
var config = {

  ip: {
    type: 'DB2',
    database: 'DB2...',
    hostname: '127.0.0.1',
    port: '13337',
    protocol: 'TCPIP',
    uid: 'test',
    pwd: 'pw'
  },
  up:{
    type: 'DB2',
    database: 'DB2...',
    hostname: '192.168.1.1',
    port: '13339',
    protocol: 'TCPIP',
    uid: 'usr',
    pwd: 'pw'
  }
}

module.exports = config;
```

### Example for Model file:
```javascript
var MultiDB = require('multi-db');

class Benutzer extends MultiDB{

  getProperties(){

    var props = {
      ID_BENUTZER: {
        type: 'bigint',
        required: true,
        key: 'primary',
        sequence: '... sequence name ...'
      },
      BENUTZERNAME: {
        type: 'string',
        required: true,
        size: 255
      },
      EMAIL: {
        type: 'string',
        required: true,
        size: 255
      },
      NAME: {
        type: 'string',
        size: 255
      },
      VORNAME: {
        type: 'string',
        size: 255
      }
    }

    return props;
  }

  getDatabase(){

    return 'ip';
  }

  getTableName(){

    return 'BENUTZER';
  }

  getSchema(){

    return 'TESTSCHEMA';
  }
}

module.exports = Benutzer;
```
Note: getDatabase has to match with a Database in config file

### Using the module with promises
```javascript
var test = new Benutzer();

test.getById(10).then((data) => {

  console.log(data)
});
```

### Using the module with await
```javascript
let test = new Benutzer();
let test2 = await test.getById(10)
```

Note: Can only be used in async functions!

### Using tool for standard queries
```javascript
var multiDB = require('multi-db-tool');
var mutli = new multiDB(require('path to config file ..', null)

multi.manualQuery('ip', 'select * from test.test where test_data = ?', ['test']).then((data) => {

})

let test = await multi.manualQuery('ip', 'select * from test.test where test_data = ?', ['test'])
```

### Using Model generator
```javascript
var db2Tool = require('./node_modules/multi-db-tool/src/tools/db2ModelGenerator.js')

db2Tool.generateDB2Model(require('... path to db config file'), 'name of db in config file', '..schema', '..table name', '.. sequence name for primary fields', '..path to write file');
```
