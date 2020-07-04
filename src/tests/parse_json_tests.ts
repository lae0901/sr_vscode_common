import { testResults_append, testResults_consoleLog, testResults_new, 
          iTestResultItem } from 'sr_test_framework';
import { editJson_parse } from '../parse_json';


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
export function json_parse_test( ) : iTestResultItem
{
  let passText = '' ;
  let failText = '' ;
  const results = testResults_new();
  const method = 'editJson_parse';
  const { root, lineXref } = editJson_parse( doc_text) ;
  if (( root.itemType != 'object') || !root.obj || root.end != 397 )
    failText = `incorrect results. itemType:${root.itemType} end:${root.end}`;
  else 
    passText = `correct results. itemType:${root.itemType} end:${root.end}`;
  return {method, passText, failText } ;
}
