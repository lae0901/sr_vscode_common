
// --------------------- javascript_declareFunctionName ----------------------------
// return func name that is declared on text line that contains function declare.
export function javascript_declareFunctionName( text: string )
{
  let funcName: string = '';
  let objectName: string = '';
  let protoName: string = '';
  let isAsync: boolean = false;

  if (text)
  {
    // look for function name in form "function funcName"
    {
      const regexp = /(^|\s+)(async\s+)?function\s+(\w+)/;
      const matchArray = regexp.exec(text);
      if (matchArray && matchArray.length >= 4)
      {
        isAsync = matchArray[2] ? true : false;
        funcName = matchArray[3];
      }
    }

    // look for function name in form funcName = function
    if (!funcName)
    {
      const regexp = /((\w+)\.prototype\.)?((\w+)\.)?([a-zA-Z0-9_]+)\s*=\s*(async\s+)?function/;
      const matchArray = regexp.exec(text);
      if (matchArray && matchArray.length >= 7)
      {
        protoName = matchArray[2];
        objectName = matchArray[4] || '';
        funcName = matchArray[5];
        isAsync = matchArray[6] ? true : false;
      }
    }
  }

  protoName = protoName || '' ;
  funcName = funcName || '' ;
  return { objectName, funcName, protoName, isAsync };
}
