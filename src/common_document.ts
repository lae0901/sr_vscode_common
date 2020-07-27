// common_document.ts 

import * as vscode from 'vscode';

// --------------------------------- document_eol ---------------------------------
// return eol of the text document as a string.
export function document_eol(document: vscode.TextDocument): string
{
  if (document.eol == vscode.EndOfLine.CRLF)
    return '\r\n';
  else
    return '\n';
}

// ------------------------------ document_lineEndPos ------------------------------
// return vscode.Position of the end of the line. ( including EOL )
export function document_lineEndPos(document: vscode.TextDocument, linn: number): vscode.Position
{
  const lineText = document.lineAt(linn).text;
  const pos = new vscode.Position(linn, lineText.length + document_eol(document).length);
  return pos;
}

