import * as vscode from 'vscode';

// --------------------- textLine_declareFunctionName ----------------------------
// return func name that is declared on text line that contains function declare.
export function textLine_declareFunctionName( line?: vscode.TextLine )
{
  let funcName : string = '' ;

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
      const regexp = /(\w+)\s*=\s*function/;
      const matchArray = regexp.exec(line.text);
      if (matchArray && matchArray.length >= 2)
      {
        funcName = matchArray[1];
      }
    }
  }

  return funcName ;
}
