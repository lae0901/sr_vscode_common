// src/test/main.ts

import { text_toLineXref_test } from './editor_tests';
import { testResults_append, testResults_consoleLog, testResults_new } from 'sr_test_framework';
import { json_parse_test,lineXref_findTextIndex_test, json_parse_test_emptyArray } from './parse_json_tests';
import { json_toVlu_tests } from './json_toVlu_tests';
import { sqlCreateTable_test, sqlText_test, 
          javascript_declareFunctionName_property_test, 
          javascript_declareInterfaceName_test,  
          parse_javascript_test} from './tester';
import { c_parse_test } from './parse_c_tests';

main( ) ;

export async function main()
{
  const results = testResults_new( ) ;
  {
    const item = json_parse_test( ) ;
    results.push(item) ;
  }
  {
    const item = json_parse_test_emptyArray();
    results.push(item);
  }

  // test functions which return a value from object returned by json_parse.
  {
    const rv = json_toVlu_tests() ;
    results.push(...rv) ;
  }
  {
    const item = lineXref_findTextIndex_test();
    results.push(item);
  }

  {
    const res = text_toLineXref_test() ;
    results.push(...res) ;
  }

  // sqlText_test
  {
    const { results: res } = await sqlText_test();
    results.push(...res);
  }

  // sqlCreateTable_test
  {
    const { results: res } = await sqlCreateTable_test();
    results.push(...res);
  }

  // parse_javascript_test
  {
    const { results: res } = await parse_javascript_test();
    results.push(...res);
  }

  // javascript_declareFunctionName_property_test
  {
    const { results: res } = await javascript_declareFunctionName_property_test() ;
    results.push(...res);
  }

  {
    const { results: res } = await javascript_declareInterfaceName_test();
    results.push(...res);
  }

  // parse C code
  {
    const arr = c_parse_test( ) ;
    results.push( ...arr ) ;
  }

  await testResults_consoleLog(results);
}
