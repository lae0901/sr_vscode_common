import { testResults_append, testResults_consoleLog, testResults_new } from 'sr_test_framework';
import { text_toLineXref } from '../common_text';

// ----------------------------- text_toLineXref_test -----------------------------
export function text_toLineXref_test( )
{
  const results = testResults_new( ) ;
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
  const method = 'text_toLineXref' ;
  const xref_arr = text_toLineXref(doc_text, '\n') ;
  testResults_append( results, 'ok', '', method ) ;

  return results ;
}
