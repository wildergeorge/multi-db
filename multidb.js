var connectors = {};
var databases = {};
var connectionInfo = {};
var db2Connector;

class MultiDB{

  constructor(cfg){

    for(var con in cfg){

      databases[con] = cfg[con].type;
      connectionInfo[con] = cfg[con];
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

  get(field, value){

    let mappedObject = connectors[databases[this.getDatabase()]].get(this, connectionInfo[this.getDatabase()], field, value);

    return mappedObject
  }

  create(){

    let mappedObject = connectors[databases[this.getDatabase()]].create(this, connectionInfo[this.getDatabase()]);
  }

  remove(){

    let mappedObject = connectors[databases[this.getDatabase()]].remove(this);
  }
}

module.exports = MultiDB;
