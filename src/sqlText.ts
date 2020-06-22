
// --------------------- sqlText_createObjectName ----------------------------
// find the sql create object type and object name in the sql statement text.
export function sqlText_createObjectName( stmtText: string )
{
  let objectType: string = '';
  let qualObjectName: string = '';
  let objectName: string = '';
  let schemaName: string = '';

    // look for the "create" or "create or replace" clause.
    {
    const regexp = /(^|\s+)(create\s+)(or\s+replace\s+)?((table)|(function)|(procedure))\s+((\w+)[\.\/])?(\w+)/i;
      const matchArray = regexp.exec(stmtText);
      if (matchArray && matchArray.length >= 11)
      {
        objectType = matchArray[4] || '' ;
        objectType = objectType.toLowerCase( ) ;
        schemaName = matchArray[9] || '';
        objectName = matchArray[10] || '';
      }
    }

  return { objectType, objectName, schemaName };
}
