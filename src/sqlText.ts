
// --------------------- sqlText_createObjectName ----------------------------
// find the sql create object type and object name in the sql statement text.
export function sqlText_createObjectName( stmtText: string )
{
  let objectType: string = '';
  let objectName: string = '';

    // look for the "create" or "create or replace" clause.
    {
      const regexp = /(^|\s+)(create\s+)(or\s+replace\s+)?((table)|(function)|(procedure))\s+(\w+)/i;
      const matchArray = regexp.exec(stmtText);
      if (matchArray && matchArray.length >= 8)
      {
        objectType = matchArray[4].toLowerCase( ) ;
        objectName = matchArray[8];
      }
    }

  return { objectType, objectName };
}
