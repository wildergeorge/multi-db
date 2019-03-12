function getById(db2Schema, db2Table, db2PrimaryKey){

  let db2GetByIdQuery = 'select * from ' + db2Schema + '.' + db2Table + ' where ' + db2PrimaryKey + ' = ?';

  return db2GetByIdQuery;
}

function get(db2Schema, db2Table, db2Field, caseSensitive){

  let db2GetQuery;

  if(caseSensitive){

    db2GetQuery = 'select * from ' + db2Schema + '.' + db2Table + ' where lower(' + db2Field + ') = lower(?)';
  }else{

    db2GetQuery = 'select * from ' + db2Schema + '.' + db2Table + ' where ' + db2Field + ' = ?';
  }

  return db2GetQuery;
}

function getLike(db2Schema, db2Table, db2Field, caseSensitive){

  let db2GetQuery;

  if(caseSensitive){

    db2GetQuery = 'select * from ' + db2Schema + '.' + db2Table + ' where lower(' + db2Field + ') like lower(?)';
  }else{

    db2GetQuery = 'select * from ' + db2Schema + '.' + db2Table + ' where ' + db2Field + ' like ?';
  }

  return db2GetQuery;
}

function getAll(db2Schema, db2Table, db2Field, direction){

  let db2GetAllQuery = 'select * from ' + db2Schema + '.' + db2Table + ' order by ' + db2Field;

  if(direction == 'up'){

    db2GetAllQuery = db2GetAllQuery + ' asc';
  }else if(direction == 'down'){

    db2GetAllQuery = db2GetAllQuery + ' desc';
  }
  
  return db2GetAllQuery;
}

function create(db2Model, db2PrimaryKey){

  let db2CreateQuery;
  let aDb2Fields = [];
  let aDb2Variables = [];
  let aDb2Values = [];

  if(!aDb2Fields.includes(db2PrimaryKey)){

    aDb2Fields.push(db2PrimaryKey);
    //aDb2Variables.push('?');
    //aDb2Values.push('nextval for ' + db2Model.getProperties()[db2PrimaryKey].sequence)
  }

  for(let db2Field in db2Model){

    if(db2Model[db2Field] != db2PrimaryKey){

      aDb2Fields.push(db2Field)
      aDb2Variables.push('?');
      aDb2Values.push(db2Model[db2Field])
    }
  }

  if(db2Model.getProperties()[db2PrimaryKey].sequence != undefined){

    db2CreateQuery = 'insert into ' + db2Model.getSchema() + '.' + db2Model.getTableName() + '('+ aDb2Fields.join(',') + ') VALUES (' + 'nextval for ' + db2Model.getProperties()[db2PrimaryKey].sequence + ',' + aDb2Variables.join(',') + ')';
  }

  return {query: db2CreateQuery, data: aDb2Values};
}

function createGetById(db2Model, db2PrimaryKey){

  let db2CreateObj = create(db2Model, db2PrimaryKey)

  let db2NewQuery = 'select * from final table (' + db2CreateObj.query + ')';

  db2CreateObj.query = db2NewQuery;

  return db2CreateObj;
}

function remove(db2Schema, db2Table, db2PrimaryKey){

  let db2RemoveQuery = 'delete from ' + db2Schema + '.' + db2Table + ' where ' + db2PrimaryKey + ' = ?';

  return db2RemoveQuery;
}

function update(db2Model, db2PrimaryKey){
  //console.log(db2Model.getProperties())
  //console.log('----------------------')
  let aValues = [];
  let bFirst = true;
  let db2UpdateQuery = 'update ' + db2Model.getSchema() + '.' + db2Model.getTableName() + ' set ';

  for(let prop in db2Model){

    if(prop != db2PrimaryKey){

      aValues.push(db2Model[prop]);

      if(bFirst){

        bFirst = false;
      }else{

        db2UpdateQuery += ', ';
      }

      db2UpdateQuery += prop + ' = ? ';
    }
  }

  db2UpdateQuery += ' where ' + db2PrimaryKey + ' = ?';
  aValues.push(db2Model[db2PrimaryKey]);

  return {query: db2UpdateQuery, data: aValues};
}

module.exports = {getById: getById, get: get, create: create, remove: remove, update: update, getLike: getLike, getAll: getAll, createGetById: createGetById};
