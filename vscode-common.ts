import * as vscode from 'vscode';

// -------------------------- editor_selectionLine ------------------------
// return the selection start TextLine of the active TextEditor.
export function editor_selectionLine(editor?: vscode.TextEditor)
{
  let line: vscode.TextLine | undefined;
  if (!editor)
  {
    editor = vscode.window.activeTextEditor;
  }
  if (editor)
  {
    const doc = editor.document;
    line = doc.lineAt(editor.selection.start.line);
  }
  return line;
}

// --------------------- textLine_declareFunctionName ----------------------------
// return func name that is declared on text line that contains function declare.
export function textLine_declareFunctionName(line?: vscode.TextLine)
{
  let funcName: string = '';

  if (line)
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
    if (!funcName)
    {
      const regexp = /(\w+)\s*=\s*function/;
      const matchArray = regexp.exec(line.text);
      if (matchArray && matchArray.length >= 2)
      {
        funcName = matchArray[1];
      }
    }
  }

  return funcName;
}
