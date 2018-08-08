var db2Helper = require('./db2Helper');
var db2Mapper = require('./db2Mapper');
var db2QueryBuilder = require('./db2QueryBuilder');
var db2QueryRunner = require('./db2QueryRunner');

async function getById(db2Model, db2ConnectionString, id){

  let queryGetById = db2QueryBuilder.getById(db2Model.getSchema(), db2Model.getTableName(), db2Helper.getPrimaryKey(db2Model.getProperties()));

  let db2Object = await db2QueryRunner.db2ExecuteQueryFirst(db2Helper.db2BuildConnectionString(db2ConnectionString), queryGetById, [id]);

  if(db2Object.err == undefined){

    return db2Mapper.db2MapDataToClassFirst(db2Model, db2Object);
  }else{

    return db2Object
  }
}

async function get(db2Model, db2ConnectionString, db2Field, db2Value){

  let queryGet = db2QueryBuilder.get(db2Model.getSchema(), db2Model.getTableName(), db2Field);

  let db2Object = await db2QueryRunner.db2ExecuteQuery(db2Helper.db2BuildConnectionString(db2ConnectionString), queryGet, [db2Value]);

  if(db2Object.err == undefined){

    let aDb2Objects = [];

    for(let i = 0; i < db2Object.data.length; i++){

      aDb2Objects.push(db2Mapper.db2MapDataToClass(Object.assign(Object.create(db2Model), db2Model), db2Object.data[i]))
    }

    return aDb2Objects;
  }else{

    return db2Object
  }
}

async function getLikeRight(db2Model, db2ConnectionString, db2Field, db2Value){

  let queryGet = db2QueryBuilder.getLike(db2Model.getSchema(), db2Model.getTableName(), db2Field);

  let db2Object = await db2QueryRunner.db2ExecuteQuery(db2Helper.db2BuildConnectionString(db2ConnectionString), queryGet, [db2Value + '%']);

  if(db2Object.err == undefined){

    let aDb2Objects = [];

    for(let i = 0; i < db2Object.data.length; i++){

      aDb2Objects.push(db2Mapper.db2MapDataToClass(Object.assign(Object.create(db2Model), db2Model), db2Object.data[i]))
    }

    return aDb2Objects;
  }else{

    return db2Object
  }
}

async function getLikeLeft(db2Model, db2ConnectionString, db2Field, db2Value){

  let queryGet = db2QueryBuilder.getLike(db2Model.getSchema(), db2Model.getTableName(), db2Field);

  let db2Object = await db2QueryRunner.db2ExecuteQuery(db2Helper.db2BuildConnectionString(db2ConnectionString), queryGet, ['%' + db2Value]);
  
  if(db2Object.err == undefined){

    let aDb2Objects = [];

    for(let i = 0; i < db2Object.data.length; i++){

      aDb2Objects.push(db2Mapper.db2MapDataToClass(Object.assign(Object.create(db2Model), db2Model), db2Object.data[i]))
    }

    return aDb2Objects;
  }else{

    return db2Object
  }
}

async function getLikeAll(db2Model, db2ConnectionString, db2Field, db2Value){

  let queryGet = db2QueryBuilder.getLike(db2Model.getSchema(), db2Model.getTableName(), db2Field);

  let db2Object = await db2QueryRunner.db2ExecuteQuery(db2Helper.db2BuildConnectionString(db2ConnectionString), queryGet, ['%' + db2Value + '%']);

  if(db2Object.err == undefined){

    let aDb2Objects = [];

    for(let i = 0; i < db2Object.data.length; i++){

      aDb2Objects.push(db2Mapper.db2MapDataToClass(Object.assign(Object.create(db2Model), db2Model), db2Object.data[i]))
    }

    return aDb2Objects;
  }else{

    return db2Object
  }
}

async function create(db2Model, db2ConnectionString){

  try{

    let queryObjectCreate = db2QueryBuilder.create(db2Model, db2Helper.getPrimaryKey(db2Model.getProperties()));

    if(db2Helper.db2TypeValidationInsert(db2Model).err == false){

      let db2Object = await db2QueryRunner.db2ExecuteNonQuery(db2Helper.db2BuildConnectionString(db2ConnectionString), queryObjectCreate.query, queryObjectCreate.data);
    }else{

      throw db2Helper.db2TypeValidationInsert(db2Model).errText;
    }
  }catch(multidbException){

    console.log(multidbException)
  }
}

async function remove(db2Model, db2ConnectionString){

  let queryRemove = db2QueryBuilder.remove(db2Model.getSchema(), db2Model.getTableName(), db2Helper.getPrimaryKey(db2Model.getProperties()));

  try{

    let db2Object = await db2QueryRunner.db2ExecuteNonQuery(db2Helper.db2BuildConnectionString(db2ConnectionString), queryRemove, [db2Model[db2Helper.getPrimaryKey(db2Model.getProperties())]]);
  }catch(multidbException){

    console.log(err)
  }
}

async function update(db2Model, db2ConnectionString){

  let queryObjectUpdate = db2QueryBuilder.update(db2Model, db2Helper.getPrimaryKey(db2Model.getProperties()));

  try{

    let db2Object = await db2QueryRunner.db2ExecuteNonQuery(db2Helper.db2BuildConnectionString(db2ConnectionString), queryObjectUpdate.query, queryObjectUpdate.data);
  }catch(e){

    console.log(e)
  }
}

module.exports = {getById: getById, get: get, create: create, remove: remove, update: update, getLikeAll: getLikeAll, getLikeRight: getLikeRight, getLikeLeft: getLikeLeft};
