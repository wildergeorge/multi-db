function getPrimaryKey(db2ModelProperties){

  var db2ModelPrimaryKey = null;

  for(var key in db2ModelProperties){

    if(db2ModelProperties[key].key === 'primary'){

      db2ModelPrimaryKey = key;
    }
  }

  return db2ModelPrimaryKey;
}

function db2BuildConnectionString(db2ConnectionData){
  
  var aDb2Connection = [];

  for(var db2Part in db2ConnectionData){

    if(db2Part !== 'type'){

      aDb2Connection.push(db2Part + '=' + db2ConnectionData[db2Part]);
    }
  }

  return aDb2Connection.join(';')
}

module.exports = {getPrimaryKey: getPrimaryKey, db2BuildConnectionString: db2BuildConnectionString};
