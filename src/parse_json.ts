// ./src/parse_json.ts - parse text stream that contains json

import { text_toLineXref } from './common_text';
import { iDocumentLineXref } from '.';

export type jsonItemType = 'object' | 'array' | 'scalar' | '' ;

// ----------------------------------- iJsonItem -----------------------------------
export interface iJsonItem
{
  start: number;
  end:number;
  itemType: jsonItemType;
  obj?: iJsonObject;
  arr?: iJsonArray;
  scalar?: iJsonScalar;
}

// ---------------------------------- iJsonObject ----------------------------------
export interface iJsonObject
{
  start: number;
  end: number;
  properties: iJsonObjectProperty[]
}

// ------------------------------ iJsonObjectProperty ------------------------------
export interface iJsonObjectProperty
{
  start: number;
  end: number;
  name: string;
  nameText: string;
  item?: iJsonItem;
  errmsg?: string;
}

// ---------------------------------- iJsonArray ----------------------------------
export interface iJsonArray
{
  start: number;
  end: number;
  arr: iJsonItem[];
}

// ---------------------------------- iJsonScalar ----------------------------------
export interface iJsonScalar
{
  start: number;
  text:string;
  boolVlu?: boolean;
  strVlu?: string;
  numVlu?: number;
}

// ------------------------------- iJsonParseResults -------------------------------
export interface iJsonParseResults
{
  // the root item of the json object
  root: iJsonItem;   
  
  // provides index range of each line in text stream
  lineXref: iDocumentLineXref[];  
}

// ---------------------------------- editJson_parse ------------------------------
// parse json text stream for the purpose of editing that text stream. Returns a 
// parse tree that includes that start position of each item in the json stream. 
// An xref data structure is also returned which provides the text stream position
// range of each line in the stream. Using the two structures, a text editor can 
// identify the linn location of each json item.
export function editJson_parse( text: string ) : iJsonParseResults
{
  const xref_array = text_toLineXref(text) ;
  let start = 0 ;
  const item = parseItem( text, start ) ;

  return { root:item, lineXref:xref_array} ;
}

// ---------------------------------- parseArray ----------------------------------
function parseArray(text: string, start: number): iJsonArray
{
  // array starts with "[", then series of jsonItems, followed by closing "]".
  let end = -1;
  let errmsg = '';
  let ix = -1 ;
  const items: iJsonItem[] = [];

  // start char is "["
  const ch1 = text.substr(start,1) ;
  if ( ch1 != '[')
    errmsg = 'start of array. Unexpected character.' ;
  else
    ix = start + 1 ;

  while (!errmsg)
  {
    const item = parseItem(text, ix ) ;

    // something identified and parsed. store as item in array of items. 
    // ( a ']' character will return as an empty item. )
    if ( item.itemType )
    {
      items.push(item) ;
      ix = item.end + 1;
    }

    // advance past comma that follows the object property.
    const rx = /(\s*)([,\]])/g;
    rx.lastIndex = ix;
    const rv = rx.exec(text);
    if ( !rv || rv.index != ix )
      errmsg = 'unexpected character after json array item' ;
    else
    {
      ix = rv.index + rv[1].length;
      const ch1 = rv[2];
      if ( ch1 == ']')
      {
        ix += 1 ;
        break ;
      }
      else if ( ch1 == ',')
        ix += 1 ;
    }
  }

  end = ix;
  return { start, end, arr:items };
}

// ---------------------------------- parseItem ----------------------------------
function parseItem( text: string, ix: number ) : iJsonItem
{
  // scan past whitespace to the start of the json value. Value is either an object
  // an array or a scalar. 
  const re = /(\s*)([{\[\"\dtf\'\]}])/g; 
  re.lastIndex = ix ;
  let fx = -1 ;
  const rv = re.exec(text) ;

  let errmsg = '' ;
  let itemType : jsonItemType = '' ;
  let start = -1 ;
  let end = -1 ;
  let obj : iJsonObject | undefined ;
  let scalar : iJsonScalar | undefined ;
  let arr : iJsonArray | undefined ;
  if ( !rv || rv.index > ix )
    errmsg = `unexpected json value`;
  else
  {
    start = rv.index + rv[1].length ;
    const ch1 = rv[2] ;
    if ( ch1 == '{')
    {
      itemType = 'object' ;
      obj = parseObject(text, start) ;
      end = obj.end ;
    }
    else if ( ch1 == '[')
    {
      itemType = 'array' ;
      arr = parseArray( text, start ) ;
      end = arr.end ;
    }
    // end of the array or object that the item is located in. 
    else if (( ch1 == ']') || ( ch1 == '}'))
    {
      itemType = '' ;
    }
    else
    {
      itemType = 'scalar' ;
      scalar = parseScalar(text, start ) ;
      end = start + scalar.text.length - 1 ;
    }
  }
  return { start, end, itemType, obj, arr, scalar } ;
}

// ---------------------------------- parseObject ----------------------------------
function parseObject( text: string, start: number) : iJsonObject
{
  // object consists of series of "prop name": prop_value.  
  // parse properties until the closing "}".
  let ix = start + 1 ;
  let end = -1 ;
  let errmsg = '' ;
  const properties : iJsonObjectProperty[] = [] ;
  while( !errmsg )
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

      // advance past comma that follows the object property.
      ix = prop.end + 1;

      // advance past whitespace to start of property name or close brace.
      const rx = /\s*,/g;
      rx.lastIndex = ix;
      const rv = rx.exec(text);
      if (rv && rv.index == ix)
      {
        ix = rv.index + rv[0].length;
      }
    }
  }

  end = ix ;
  return {start, end, properties } ;
}

// ---------------------------------- parseObjectProperty ----------------------------------
function parseObjectProperty(text: string, start: number): iJsonObjectProperty
{
  let ix = start;
  let end = -1 ;
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
    re.lastIndex = start;
    let fx = -1;
    const rv = re.exec(text);
    if (!rv || rv.index != ix )
      errmsg = 'expected property name not found' ;
    else
    {
      nameStart = ix + rv[1].length ; // adv past whitespace to prop name.
      // property name is a quoted string. The regexp returns the text of the entire
      // quoted string and then the actual property name.
      if (rv[3])
      {
        nameText = rv[3] ;
        name = rv[4] ;
      }

      // property name is specified without quotes.
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
    end = item.end;
  }

  return { start:nameStart, end, name, nameText, item }
}

// ---------------------------------- parseScalar ----------------------------------
function parseScalar(text: string, start: number): iJsonScalar
{
  let ix = start + 1;
  let end = -1;
  let errmsg = '';
  let scalarText = '' ;
  let boolVlu: boolean | undefined;
  let strVlu: string | undefined;
  let numVlu: number | undefined;

  // advance past whitespace to start of property name or close brace.
  const re = /((\"([^\"]*)\")|(\n+)|(true)|(false))/g;
  re.lastIndex = start;
  let fx = -1;
  const rv = re.exec(text);

  // nothing but whitespace
  if (!rv || rv.index != start)
    errmsg = 'unexpected json value';
  else
  {
    scalarText = rv[1] ;
    if ( rv[2])
    {
      strVlu = rv[3];
    }
    else if ( rv[4])
    {
      numVlu = Number(rv[4]);
    }
    else if ( rv[5])
    {
      boolVlu = Boolean(rv[5]);
    }
    else if (rv[6])
    {
      boolVlu = Boolean(rv[6]);
    }
  }

  return { start, text:scalarText, boolVlu, strVlu, numVlu };
}
