var db2Helper = require('./db2Helper');
var db2Mapper = require('./db2Mapper');
var db2QueryBuilder = require('./db2QueryBuilder');
var db2QueryRunner = require('./db2QueryRunner');

async function getById(db2Model, db2ConnectionString, id){

  let queryGetById = db2QueryBuilder.getById(db2Model.getSchema(), db2Model.getTableName(), db2Helper.getPrimaryKey(db2Model.getProperties()));

  let db2Object = await db2QueryRunner.db2ExecuteQuery(db2Helper.db2BuildConnectionString(db2ConnectionString), queryGetById, [id]);

  if(db2Object.err == undefined){

    return db2Mapper.db2MapDataToClass(db2Model, db2Object);
  }else{

    return db2Object
  }
}

async function get(db2Model, db2ConnectionString, db2Field, db2Value){

  let queryGet = db2QueryBuilder.get(db2Model.getSchema(), db2Model.getTableName(), db2Field);

  let db2Object = await db2QueryRunner.db2ExecuteQuery(db2Helper.db2BuildConnectionString(db2ConnectionString), queryGet, [db2Value]);

  if(db2Object.err == undefined){

    return db2Mapper.db2MapDataToClass(db2Model, db2Object);
  }else{

    return db2Object
  }
}

async function create(db2Model, db2ConnectionString){

  console.log('oink')
  console.log(db2Model)
}

module.exports = {getById: getById, get: get, create: create};
