# vscode common functions

## editor functions
* editor_selectionLine( editor?: vscode.TextEditor ) : vscode.TextLine

## text functions
* iDocumentLineXref[] = text_toLineXref( text, eol )
* iDocumentLineXref = lineXref_findTextIndex(  iDocumentLineXref[], index )

## textLine functions
* textLine_declareFunctionName( line?: vscode.TextLine ) : string

## sql text functions
* {objectType, objectName} = sqlText_createObjectName( sqlText )

## parse javascript statement functions
* {objectName, funcName, protoName, isAsync } = javascript_declareFunctionName( lineText: string)
* { interfaceName } = javascript_declareInterfaceName( text: string )

## parse json functions
* {root, lineXref} = editJson_parse( text )
* vlu = jsonArray_toVlu( iJsonArray )
* vlu = jsonObject_toVlu( iJsonObject )
* vlu = jsonItem_toVlu( iJsonItem )
* vlu = jsonScalar_toVlu( iJsonScalar )

## parse json interfaces
* iJsonParseResults
* iJsonArray
* iJsonItem
* iJsonObject
* iJsonObjectProperty
* iJsonScalar

## publish instructions
* increment version number in package.json
* make sure any new functions are imported and exported in index.ts
* npm run build
* npm run test
* git add, commit, push to repo
* npm publish
* npm update in projects which use this package
