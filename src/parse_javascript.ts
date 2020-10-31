
export class abc
{

  public static methodName(abc:string)
  {

  }

}



// --------------------- javascript_declareClassName --------------------------
// return name of interface declared on text line.
export function javascript_declareClassName(text: string)
{
  let className: string = '';

  if (text)
  {
    // look for class name in form "export default class className implements {"
    {
      const regexp = /^\s*(export\s)?(default\s)?\s*class\s+(\w+)/;
      const matchArray = regexp.exec(text);
      if (matchArray && matchArray.length >= 4)
      {
        className = matchArray[3] || '';
      }
    }
  }

  return { className };
}

// --------------------- javascript_declareClassMethodName --------------------------
// return name of class method declared on text line.
export function javascript_declareClassMethodName(text: string)
{
  let methodName: string = '';

  if (text)
  {
    // look for class name in form "public|private static methodName("
    {
      const regexp = /^\s*((public)|(private))(?:\s*static)?\s+(\w+)\s*\(/;
      const matchArray = regexp.exec(text);
      if (matchArray && matchArray.length >= 5)
      {
        methodName = matchArray[4] || '';
      }
    }
  }

  return { methodName };
}

// --------------------- javascript_declareFunctionName ----------------------------
// return func name that is declared on text line that contains function declare.
export function javascript_declareFunctionName( text: string )
{
  let funcName: string = '';
  let objectName: string = '';
  let protoName: string = '';
  let isAsync: boolean = false;
  let openBrace: boolean = false ;
  let form: 'funcDeclare'|'funcVariable'|'funcProperty'|'' = '' ;

  if (text)
  {
    // look for function name in form "function funcName"
    {
      const regexp = /(^|\s+)(async\s+)?function\s+(\w+)/;
      const matchArray = regexp.exec(text);
      if (matchArray && matchArray.length >= 4)
      {
        isAsync = matchArray[2] ? true : false;
        funcName = matchArray[3];
        form = 'funcDeclare';
      }
    }

    // look for function name in form funcName = function
    if (!funcName)
    {
      const regexp = /((\w+)\.prototype\.)?((\w+)\.)?([a-zA-Z0-9_]+)\s*=\s*(async\s+)?function/;
      const matchArray = regexp.exec(text);
      if (matchArray && matchArray.length >= 7)
      {
        protoName = matchArray[2];
        objectName = matchArray[4] || '';
        funcName = matchArray[5];
        isAsync = matchArray[6] ? true : false;
        form = 'funcVariable';
      }
    }

    // look for function name in string with form " name( arg1, arg2 ) { ".  Where 
    // the open brace follows the paren enclosed list of argments which is 
    // preceeded by function name.
    //     async expList_load( force )
    // {
    if (!funcName)
    {
      const regexp = /\s*(async\s+)?(\w+)\s*\((\w+)?((\s*,\s*\w+)*)\s*\)\s*({)/;
      const matchArray = regexp.exec(text);
      if (matchArray && matchArray.length >= 3)
      {
        isAsync = matchArray[1] ? true : false;
        funcName = matchArray[2];
        const arg1 = matchArray[3];
        openBrace = matchArray[6] ? true : false;
        form = 'funcProperty';
      }
    }
  }

  protoName = protoName || '' ;
  funcName = funcName || '' ;
  return { form, objectName, funcName, protoName, isAsync };
}

// --------------------- javascript_declareInterfaceName --------------------------
// return name of interface declared on text line.
export function javascript_declareInterfaceName(text: string)
{
  let interfaceName: string = '';

  if (text)
  {
    // look for interface name in form "interface interfaceName {"
    {
      const regexp = /^\s*(export\s)?\s*interface\s+(\w+)\s*{/;
      const matchArray = regexp.exec(text);
      if (matchArray && matchArray.length >= 3)
      {
        interfaceName = matchArray[2] || '';
      }
    }
  }

  return { interfaceName };
}

export type rpg_lineType = 'cspec' | 'dspec' | 'fspec' ;

// --------------------- javascript_declareTypeName --------------------------
// return name of interface declared on text line.
export function javascript_declareTypeName(text: string)
{
  let typeName: string = '';

  if (text)
  {
    // look for type name in form "type typeName = "
    {
      const regexp = /^\s*(export\s)?\s*type\s+(\w+)\s*=/;
      const matchArray = regexp.exec(text);
      if (matchArray && matchArray.length >= 3)
      {
        typeName = matchArray[2] || '';
      }
    }
  }

  return { typeName };
}
