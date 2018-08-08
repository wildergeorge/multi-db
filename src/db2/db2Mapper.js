function db2MapDataToClassFirst(db2Model, db2Object){
  
  for(var db2Prop in db2Model.getProperties()){

    if(db2Model.getProperties()[db2Prop].type === 'bigint'){

      db2Model[db2Prop] = parseInt(db2Object.data[db2Prop]);
    }else if(db2Model.getProperties()[db2Prop].type === 'bigint'){

      db2Model[db2Prop] = parseInt(db2Object.data[db2Prop]);
    }else{

      db2Model[db2Prop] = db2Object.data[db2Prop];
    }
  }

  return db2Model;
}

function db2MapDataToClass(db2Model, db2Object){

  for(var db2Prop in db2Model.getProperties()){

    if(db2Model.getProperties()[db2Prop].type === 'bigint'){

      db2Model[db2Prop] = parseInt(db2Object[db2Prop]);
    }else if(db2Model.getProperties()[db2Prop].type === 'bigint'){

      db2Model[db2Prop] = parseInt(db2Object[db2Prop]);
    }else{

      db2Model[db2Prop] = db2Object[db2Prop];
    }
  }

  return db2Model;
}

module.exports = {db2MapDataToClassFirst: db2MapDataToClassFirst, db2MapDataToClass: db2MapDataToClass};
