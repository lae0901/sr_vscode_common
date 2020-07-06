
import {iJsonArray, iJsonItem, iJsonScalar, iJsonObject } from './parse_json';

// -------------------------------- jsonArray_toVlu --------------------------------
export function jsonArray_toVlu(jaar: iJsonArray)
{
  const vluArr : any = [] ;
  for( const item of jaar.arr)
  {
    const vlu = jsonItem_toVlu(item) ;
    vluArr.push(vlu) ;
  }

  return vluArr ;
}

// -------------------------------- jsonItem_toVlu --------------------------------
export function jsonItem_toVlu(item: iJsonItem)
{
  if (item.scalar)
    return jsonScalar_toVlu(item.scalar)
  else if ( item.arr )
    return jsonArray_toVlu(item.arr) ;
  else if ( item.obj )
    return jsonObject_toVlu(item.obj) ;
  else
    return '' ;
}

// ------------------------------- jsonObject_toVlu -------------------------------
export function jsonObject_toVlu( jobj: iJsonObject )
{
  const obj : {[key:string] : any} = { } ;
  for( const prop of jobj.properties)
  {
    const vlu = ( prop.item ) ? jsonItem_toVlu( prop.item ) : undefined  ;
    obj[prop.name] = vlu ;
  }
  return obj ;
}

// ------------------------------- jsonScalar_toVlu -------------------------------
export function jsonScalar_toVlu(scalar: iJsonScalar): boolean | string | number 
{
  if (typeof scalar.boolVlu == 'boolean')
    return scalar.boolVlu;
  else if (typeof scalar.strVlu == 'string')
    return scalar.strVlu;
  else if (typeof scalar.numVlu == 'number')
    return scalar.numVlu;
  else
    return '';
}
