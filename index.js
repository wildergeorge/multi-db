var encryptor;
var key;

var connectors = {};
var databases = {};
var connectionInfo = {};
var db2Connector;

class MultiDB{

  constructor(cfg, decryptPassword){

    if(decryptPassword != null && decryptPassword.length > 0){

      key = decryptPassword
      encryptor = require('simple-encryptor')(key);
    }

    for(var con in cfg){

      databases[con] = cfg[con].type;
      connectionInfo[con] = cfg[con];

      if(key != null && key != ''){

        if(connectionInfo[con].type = 'DB2'){

          // Decrypt pwd field from DB2 config
          connectionInfo[con].pwd = encryptor.decrypt(connectionInfo[con].pwd);
        }
      }
    }

    if (Object.values(databases).indexOf('DB2') > -1) {

      db2Connector = require('./src/db2/db2Connector.js')
      connectors['DB2'] = db2Connector;
    }
  }

  getById(id){

    let mappedObject = connectors[databases[this.getDatabase()]].getById(this, connectionInfo[this.getDatabase()], id);

    return mappedObject;
  }

  get(field, value, caseSensitive){

    let mappedObject = connectors[databases[this.getDatabase()]].get(this, connectionInfo[this.getDatabase()], field, value, caseSensitive);

    return mappedObject;
  }

  getLikeRight(field, value, caseSensitive){

    let mappedObject = connectors[databases[this.getDatabase()]].getLikeRight(this, connectionInfo[this.getDatabase()], field, value, caseSensitive);

    return mappedObject;
  }

  getLikeLeft(field, value, caseSensitive){

    let mappedObject = connectors[databases[this.getDatabase()]].getLikeLeft(this, connectionInfo[this.getDatabase()], field, value, caseSensitive);

    return mappedObject;
  }

  getLikeAll(field, value, caseSensitive){

    let mappedObject = connectors[databases[this.getDatabase()]].getLikeAll(this, connectionInfo[this.getDatabase()], field, value, caseSensitive);

    return mappedObject;
  }

  create(){

    let mappedObject = connectors[databases[this.getDatabase()]].create(this, connectionInfo[this.getDatabase()]);
  }

  createGetById(){

    let mappedObject = connectors[databases[this.getDatabase()]].createGetById(this, connectionInfo[this.getDatabase()]);

    return mappedObject;
  }

  remove(){

    let mappedObject = connectors[databases[this.getDatabase()]].remove(this, connectionInfo[this.getDatabase()]);
  }

  update(){

    let mappedObject = connectors[databases[this.getDatabase()]].update(this, connectionInfo[this.getDatabase()]);
  }

  async manualQuery(database, query, data){

    let object = await connectors[databases[database]].manualQuery(query, data, connectionInfo[database]);

    return object.data;
  }

  async manualQueryFirst(database, query, data){

    let object = await connectors[databases[database]].manualQueryFirst(query, data, connectionInfo[database]);

    return object.data;
  }

  async manualNonQuery(database, query, data){

    let object = await connectors[databases[database]].manualNonQuery(query, data, connectionInfo[database]);

    return object.data;
  }
}

module.exports = MultiDB;
