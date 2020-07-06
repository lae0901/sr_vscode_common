import { jsonArray_toVlu, jsonItem_toVlu, jsonObject_toVlu, jsonScalar_toVlu } from '../json_toVlu';
import { doc_text } from './parse_json_tests' ;
import { iTestResultItem, testResults_new } from 'sr_test_framework';
import { editJson_parse, iJsonItem, iJsonScalar, iJsonObject } from '../parse_json';
import { iJsonObjectProperty } from '..';

// -------------------------------- json_toVlu_tests --------------------------------
export function json_toVlu_tests(): iTestResultItem[]
{
  let passText = '';
  let failText = '';
  const results = testResults_new();
  const method = 'editJson_parse';
  const { root, lineXref } = editJson_parse(doc_text);
  
  {
    const res = jsonScalar_toVlu_test( ) ;
    results.push(res) ;
  }

  return results ;
}

// ----------------------------- jsonScalar_toVlu_test -----------------------------
function jsonScalar_toVlu_test( ) : iTestResultItem
{
  const method = 'jsonItem_toVlu' ;
  const expected = 'couri7' ;
  const { root } = editJson_parse(doc_text);
  const jobj = root.obj as iJsonObject ;
  const prop = jobj.properties.find((item) =>
  {
    return (item.name == 'library');
  });

  let vlu : any ;
  if (( prop ) && ( prop.item ) && ( prop.item.scalar) )
    vlu = jsonScalar_toVlu( prop.item.scalar );

  if ( typeof vlu == 'string') 
  {
    if ( vlu == expected)
    return { method, passText:`correct result. library property. value is ${vlu}` };
  else 
    return { method, failText:`library property. expected ${expected}. got ${vlu} `};
  }
  else
  {
    return { method, failText: 'parse json failed. no library property'} ;
  }
}
