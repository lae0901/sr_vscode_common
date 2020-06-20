# vscode common functions

## editor functions
* editor_selectionLine( editor?: vscode.TextEditor ) : vscode.TextLine

## textLine functions
* textLine_declareFunctionName( line?: vscode.TextLine ) : string

## sql text functions
* {objectType, objectName} = sqlText_createObjectName( sqlText )

## publish instructions
* increment version number in package.json
* make sure any new functions are imported and exported in index.ts
* npm run build
* npm run test
* git add, commit, push to repo
* npm publish
* npm update in projects which use this package
