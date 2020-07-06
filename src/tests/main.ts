// src/test/main.ts

import { text_toLineXref_test } from './editor_tests';
import { testResults_append, testResults_consoleLog, testResults_new } from 'sr_test_framework';
import { json_parse_test,lineXref_findTextIndex_test } from './parse_json_tests';
import { json_toVlu_tests } from './json_toVlu_tests';

main( ) ;

export async function main()
{
  const results = testResults_new( ) ;
  {
    const item = json_parse_test( ) ;
    results.push(item) ;
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

  testResults_consoleLog(results);
}
