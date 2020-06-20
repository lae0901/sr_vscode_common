import * as vscode from 'vscode';
import { javascript_declareFunctionName } from './parse_javascript';

// --------------------- textLine_declareFunctionName ----------------------------
// return func name that is declared on text line that contains function declare.
export function textLine_declareFunctionName( line?: vscode.TextLine )
{
  let funcName : string = '' ;
  let protoName : string = '' ;
  let isAsync : boolean = false ;

  if ( line )
  {
    ({funcName, protoName, isAsync} = javascript_declareFunctionName(line.text)) ;
  }

  return {funcName, protoName, isAsync } ;
}
