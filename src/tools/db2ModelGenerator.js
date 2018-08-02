var db2Helper = require('../db2/db2Helper.js');
var db2QueryRunner = require('../db2/db2QueryRunner.js');

async function generateDB2Model(dbCfg, database, schema, table, db2Sequence, saveTo){

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

  let db2ModelString = generateModelString(db2Data.data, database, table, schema, db2Sequence);
  writeDb2Model(db2ModelString, table.toLowerCase(), saveTo);
}

function generateModelString(db2Data, db2Database, db2Table, db2Schema, db2Sequence){

  let aModelAsString = [];

  let db2TableName = db2Data[0]['TABLE_NAME'];
  let className = db2TableName.split('_').map(x => (x.toLowerCase()).charAt(0).toUpperCase() + x.slice(1).toLowerCase()).join('_');

  aModelAsString.push('var MultiDB = require(\'multi-db-tool\');\n\n');
  aModelAsString.push('class ' + className + ' extends MultiDB{\n\n');
  aModelAsString.push('getProperties(){\n\n' + 'var props = {\n');

  let aColumns = [];

  for(let col in db2Data){

    let aColumn = []
    let tType = '';

    switch(db2Data[col]['TYPE_NAME']){
      case 'BIGINT':
        tType = 'bigint';
        break;
      case 'INTEGER':
        tType = 'number';
        break;
      case 'VARCHAR':
        tType = 'string';
        break;
      case 'TIMESTAMP':
        tType = 'string';
        break;
      default:
        tType = 'string';
    }

    //console.log(db2Data[col])
    let sStart = db2Data[col]['COLUMN_NAME'] + ': {\n'
    aColumn.push('type: \'' + tType + '\'')

    if(db2Data[col]['NULLABLE'] == 0){

      aColumn.push('required: true' )
    }

    if(db2Data[col]['CONSTRAINT'] == 'Primary Key'){

      aColumn.push('key: \'primary\'' )

      if(db2Sequence != null){

        aColumn.push('sequence: \'' + db2Sequence + '\'' )
      }
    }

    if(db2Data[col]['TYPE_NAME'] == 'VARCHAR'){

      aColumn.push('size: ' + db2Data[col]['COLUMN_SIZE'])
    }

    let sComplete = sStart + aColumn.join(',') + '} '
    aColumns.push(sComplete)
  }

  aModelAsString.push(aColumns.join(','))
  aModelAsString.push('}\n\n return props;\n } \n\n');
  aModelAsString.push('getDatabase(){\n\n return \'' + db2Database + '\'\n}');
  aModelAsString.push('\n\ngetTableName(){\n\n return \' ' + db2Table.toUpperCase() + '\'\n}');
  aModelAsString.push('\n\ngetSchema(){\n\n return \' ' + db2Schema.toUpperCase() + '\'\n}\n\n}');
  aModelAsString.push('\n\nmodule.exports = ' + className);

  return(aModelAsString.join(''))
}

function writeDb2Model(db2ModeString, fileName, path){

  
}

module.exports = {generateDB2Model: generateDB2Model}
