

// --------------------- c_declareFunctionName ----------------------------
// return func name that is declared on text line that contains function declare.
export function c_declareFunctionName( text: string )
{
  let returnType: string = '' ;
  let returnType_pointerTo: string = '' ;
  let funcName: string = '';

  if (text)
  {
    // look for function name in form "returnType funcName( argtype argName )"
    {
      // ( start of string or whitespace )
      // ( return type name )
      // ( optional * after type name or just whitespace )
      // ( function name )
      // ( open paren )
      const regexp = /(^|\s+)(\w+)((\s*\*\s*)|\s+)(\w+)\s*(\()/;
      const match = regexp.exec(text);
      if (match)
      {
        returnType = match[2] ;
        returnType_pointerTo = match[4] ? match[4].trim( ) : '' ;
        funcName = match[5] ;
      }
    }
  }

  return { returnType, returnType_pointerTo, funcName };
}

// --------------------------------- c_parseStruct ---------------------------------
export function c_parseStruct( str:string )
{

}

function c_parseStructDeclare_start( str:string)
{
  

}

// look for function name in form "returnType funcName( argtype argName )"
{
  // ( start of string or whitespace )
  // ( return type name )
  // ( optional * after type name or just whitespace )
  // ( function name )
  // ( open paren )
  const regexp = /(^|\s+)(\w+)((\s*\*\s*)|\s+)(\w+)\s*(\()/;
  const match = regexp.exec(text);
  if (match)
  {
    returnType = match[2];
    returnType_pointerTo = match[4] ? match[4].trim() : '';
    funcName = match[5];
  }
}

