var db2Helper = require('../db2/db2Helper.js');
var db2QueryRunner = require('../db2/db2QueryRunner.js');

async function generateDB2Model(dbCfg, database, schema, table, saveTo){

  var aQuery = [];

  aQuery.push('SELECT TABLE_SCHEM, TABLE_NAME, COLUMN_NAME, TYPE_NAME, COLUMN_SIZE, nullable ');
  aQuery.push(',(SELECT ');
  aQuery.push('CASE T.TYPE ');
  aQuery.push('WHEN \'P\' THEN \'Primary Key\' ');
  aQuery.push('END AS Type ');
  aQuery.push('FROM SYSCAT.TABCONST T ');
  aQuery.push('JOIN SYSCAT.CONSTDEP C ON T.CONSTNAME = C.CONSTNAME ');
  aQuery.push('JOIN SYSCAT.INDEXES I ON C.BSCHEMA = I.INDSCHEMA AND C.BNAME = I.INDNAME ');
  aQuery.push('JOIN SYSCAT.INDEXCOLUSE U ON I.INDSCHEMA = U.INDSCHEMA AND I.INDNAME = U.INDNAME ');
  aQuery.push('WHERE T.TABSCHEMA = \'' + schema.toUpperCase() + '\' ');
  aQuery.push('AND T.TABNAME = \''+ table.toUpperCase() + '\' ');
  aQuery.push('AND C.BTYPE = \'I\' ');
  aQuery.push('and U.COLNAME = COLUMN_NAME ');
  aQuery.push('ORDER BY T.TABSCHEMA, T.TABNAME, I.INDSCHEMA, I.INDNAME, U.COLSEQ) as constraint ');
  aQuery.push('FROM SYSIBM.SQLCOLUMNS as sqlc ');
  aQuery.push('WHERE TABLE_SCHEM = \'' + schema.toUpperCase() + '\' ');
  aQuery.push('AND TABLE_NAME = \'' + table.toUpperCase() + '\' ');

  let query = aQuery.join(' ');

  let sCon = db2Helper.db2BuildConnectionString(dbCfg[database]);
  var db2Data = await db2QueryRunner.db2ExecuteQuery(sCon, query, []);
  //console.log(query)
  //console.log(db2Data)
}

module.exports = {generateDB2Model: generateDB2Model}
