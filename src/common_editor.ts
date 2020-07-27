import * as vscode from 'vscode';

// -------------------------- activeEditor_selectionLine ----------------------
// return the selection start TextLine of the active TextEditor.
export function activeEditor_selectionLine( options?: {afterNumLines?: number} )
{
  let line: vscode.TextLine | undefined;
  let afterLines:vscode.TextLine[] = [] ;
  const editor = vscode.window.activeTextEditor;
  options = options || { } ;
  const afterNumLines = options.afterNumLines || 0 ;
  if (editor)
  {
    const doc = editor.document;
    let linn = editor.selection.start.line ;
    line = doc.lineAt(linn);

    // also, get the lines that follow the selection line.
    for( let ix = 1 ; ix <= afterNumLines ; ++ix )
    {
      linn += 1 ;
      if ( linn >= doc.lineCount )
        break ;
      const line = doc.lineAt(linn + ix) ;
      afterLines.push( line );
    }
  }
  return {line, afterLines} ;
}

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
