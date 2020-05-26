"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editor_selectionLine = void 0;
const vscode = require("vscode");
// -------------------------- editor_selectionLine ------------------------
// return the selection start TextLine of the active TextEditor.
function editor_selectionLine(editor) {
    let line;
    if (!editor) {
        editor = vscode.window.activeTextEditor;
    }
    if (editor) {
        const doc = editor.document;
        line = doc.lineAt(editor.selection.start.line);
    }
    return line;
}
exports.editor_selectionLine = editor_selectionLine;
