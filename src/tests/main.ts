// src/test/main.ts

import { text_toLineXref_test } from './editor_tests';
import { testResults_append, testResults_consoleLog, testResults_new } from 'sr_test_framework';

main( ) ;

export async function main()
{
  {
    const results = text_toLineXref_test() ;
    testResults_consoleLog(results);
  }
}
