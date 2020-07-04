// src/test/main.ts

import { text_toLineXref_test } from './editor_tests';
import { testResults_append, testResults_consoleLog, testResults_new } from 'sr_test_framework';
import { json_parse_test } from './parse_json_tests';

main( ) ;

export async function main()
{
  const results = testResults_new( ) ;
  {
    const item = json_parse_test( ) ;
    results.push(item) ;
  }

  {
    const res = text_toLineXref_test() ;
    results.push(...res) ;
  }

  testResults_consoleLog(results);
}
