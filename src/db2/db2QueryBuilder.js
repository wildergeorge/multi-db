function getById(db2Schema, db2Table, db2PrimaryKey){

  let db2GetByIdQuery = 'select * from ' + db2Schema + '.' + db2Table + ' where ' + db2PrimaryKey + ' = ?';

  return db2GetByIdQuery;
}

function get(db2Schema, db2Table, db2Field){

  let db2GetQuery = 'select * from ' + db2Schema + '.' + db2Table + ' where ' + db2Field + ' = ?';

  return db2GetQuery;
}

module.exports = {getById: getById, get: get};
