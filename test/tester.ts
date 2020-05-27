import * as vscode from 'vscode';
import { textLine_declareFunctionName } from '../src/common_textLine';

function test_textLine_declareFunctionName( )
{
  const textLine = '  Array.prototype.removeAt = function (index)';
  new vscode.TextLine() ;
  textLine_declareFunctionName(textLine) ;
}