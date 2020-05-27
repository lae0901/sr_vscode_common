import * as vscode from 'vscode';

// --------------------- textLine_declareFunctionName ----------------------------
// return func name that is declared on text line that contains function declare.
export function textLine_declareFunctionName( line?: vscode.TextLine )
{
  let funcName : string = '' ;
  let protoName : string = '' ;

  if ( line )
  {
    // look for function name in form "function funcName"
    {
      const regexp = /(^|\s+)function\s+(\w+)/;
      const matchArray = regexp.exec(line.text);
      if (matchArray && matchArray.length >= 3)
      {
        funcName = matchArray[2];
      }
    }

    // look for function name in form funcName = function
    if (!funcName )
    {
      const regexp = /((\w+)\.prototype\.)?(\w+)\s*=\s*function/;
      const matchArray = regexp.exec(line.text);
      if (matchArray && matchArray.length >= 4)
      {
        protoName = matchArray[2];
        funcName = matchArray[3];
      }
    }
  }

  return {funcName, protoName} ;
}
