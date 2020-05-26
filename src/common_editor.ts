import * as vscode from 'vscode';

// -------------------------- editor_selectionLine ------------------------
// return the selection start TextLine of the active TextEditor.
export function editor_selectionLine( editor?: vscode.TextEditor  )
{
  let line : vscode.TextLine | undefined ;
  if ( !editor )
  {
    editor = vscode.window.activeTextEditor;
  }
  if ( editor )
  {
    const doc = editor.document;
    line = doc.lineAt(editor.selection.start.line);
  }
  return line ;
}
