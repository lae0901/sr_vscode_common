// ./src/parse_json.ts - parse text stream that contains json

import { text_toLineXref } from './common_text';

type jsonItemType = 'object' | 'array' | 'scalar' | '' ;

interface iJsonItem
{
  start: number;
  itemType: jsonItemType;
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
  item?: iJsonItem;
  errmsg?: string;
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
  const item = parseItem( text, start ) ;

  return item ;
}

// ---------------------------------- parseItem ----------------------------------
function parseItem( text: string, ix: number ) : iJsonItem
{
  const re = /\s*([{\[\"])/g;
  re.lastIndex = ix ;
  let fx = -1 ;
  const rv = re.exec(text) ;
  let itemType : jsonItemType = '' ;
  let start = -1 ;
  let obj : iJsonObject | undefined ;
  if ( rv &&  rv.length == 2 )
  {
    start = rv.index ;
    const ch1 = rv[1] ;
    if ( ch1 == '{')
    {
      itemType = 'object' ;
      obj = parseObject(text, start) ;
    }
    else if ( ch1 == '[')
    {
      itemType = 'array' ;
    }
    else if ( ch1 == '"')
    {
      itemType = 'scalar' ;
    }
  }
  return { start, itemType, obj } ;
}

// ---------------------------------- parseObject ----------------------------------
function parseObject( text: string, start: number) : iJsonObject
{
  // object consists of series of "prop name": prop_value.  
  // parse properties until the closing "}".
  let ix = start + 1 ;
  let end = -1 ;
  let errmsg = '' ;
  const properties : iObjectProperty[] = [] ;
  while(true)
  {
    // advance past whitespace to start of property name or close brace.
    const re = /\s*(.)/g;
    re.lastIndex = ix;
    let fx = -1;
    const rv = re.exec(text);

    // nothing but whitespace
    if ( !rv || rv.index != ix )
      errmsg = 'missing end of object' ;
    else
    {
      const ch1 = rv[1] ;
      ix = ix + rv[0].length - 1 ;

      if ( ch1 == '}')
        break ;
      else if ( ch1 == ',')
        errmsg = 'unexpected delimiter' ;
    }

    // parse the object property
    if ( !errmsg )
    {
      const prop = parseObjectProperty(text, ix) ;
      properties.push(prop) ;
    }
    break ;
  }

  end = ix ;
  return {start, end, properties } ;
}

// ---------------------------------- parseObjectProperty ----------------------------------
function parseObjectProperty(text: string, start: number): iObjectProperty
{
  let ix = start;
  let errmsg = '' ;
  let isQuoted = false ;
  let nameStart = -1 ;
  let name = '' ;
  let nameText = '' ;
  let item : iJsonItem | undefined;

  // start of property name. either double quoted or just a name. Followed by
  // colon.
  {
    const re = /(\s*)(("([A-Za-z0-9_-]+)")|(\w+))\s*:/g;
    re.lastIndex = ix;
    let fx = -1;
    const rv = re.exec(text);
    if (!rv || rv.index != ix )
      errmsg = 'expected property name not found' ;
    else
    {
      nameStart = ix + rv[1].length ; // adv past whitespace to prop name.
      if (rv[3])
      {
        nameText = rv[3] ;
        name = rv[4] ;
      }
      else
      {
        nameText = rv[5] ;
        name = rv[5] ;
      }
      ix = rv.index + rv[0].length;  // advance to past colon.
    }
  }

  // got property name. now parse the item with is the property value.
  // ( can be scalar, object or array )
  if ( !errmsg )
  {
    item = parseItem(text, ix) ;
  }

  return { start:nameStart, name, nameText, item }
}
