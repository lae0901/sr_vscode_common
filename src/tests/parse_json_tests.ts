import { testResults_append, testResults_consoleLog, testResults_new } from 'sr_test_framework';
import { json_parse } from '../parse_json';


const doc_text = `{
  "ibmi-url": "http:\\192.168.1.170:10080",
  "library": "couri7",
  "srcFiles": ["qrpglesrc"],
  "srcTypes": [
    "SQLTBL",
    "SQLPRC"
  ],
  "members": [
    "ITMST*"
  ],
  "files": [
    {
      "file": "itmst_dimcode",
      "srcmbr": "ITMSTF20",
      "srctype": "SQLPRC"
    },
    {
      "file": "itmst_priceListPrice",
      "srcmbr": "ITMSTF21",
      "srctype": "SQLPRC"
    }
  ]
}`

// -------------------------------- json_parse_test --------------------------------
export function json_parse_test( )
{
  const results = testResults_new();
  const method = 'json_parse';
  json_parse( doc_text) ;
  testResults_append(results, 'ok', '', method);
  return results ;
}
