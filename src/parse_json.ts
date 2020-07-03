// ./src/parse_json.ts - parse text stream that contains json

import { text_toLineXref } from './common_text';

type jsonItemType = 'object' | 'array' | 'scalar' | '' ;

interface iJsonItem
{
  start: number;
  obj?: iJsonObject;
  arr?: iJsonArray;
  scalar?: iJsonScalar;
}

interface iJsonObject
{
  start: number;
  end: number;
  properties: iObjectProperty[]
}

interface iObjectProperty
{
  start: number;
  name: string;
  nameText: string;
  value: iJsonItem;
}

interface iJsonArray
{
  start: number;
  end: number;
  arr: iJsonItem[];
}

interface iJsonScalar
{
  start: number;
  text:string;
  boolVlu?: boolean;
  strVlu?: string;
  numVlu?: number;
}

// ---------------------------------- json_parse ----------------------------------
export function json_parse( text: string )
{
  const xref_array = text_toLineXref(text) ;
  let start = 0 ;
  const { valueType, fx } = parseItem( text, start ) ;
  if ( valueType == 'object')
  {

  }
  return 'abc' ;
}

// ---------------------------------- parseItem ----------------------------------
function parseItem( text: string, start: number ) : iJsonItem
{
  const re = /\s*([{\[\"])/g;
  re.lastIndex = start ;
  let fx = -1 ;
  const rv = re.exec(text) ;
  let vt : valueType = '' ;
  if ( rv &&  rv.length == 2 )
  {
    fx = rv.index ;
    const ch1 = rv[1] ;
    if ( ch1 == '{')
      vt = 'object' ;
    else if ( ch1 == '[')
      vt = 'array' ;
    else if ( ch1 == '"')
      vt = 'scalar' ;
  }
  return {valueType:vt, fx } ;
}

// ---------------------------------- parseObject ----------------------------------
function parseObject( text: string, start: number)
{
  // object consists of series of "prop name": prop_value.  
  // parse until the closing "}".


}
