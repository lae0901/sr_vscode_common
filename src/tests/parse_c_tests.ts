import { iTestResultItem, testResults_new } from "sr_test_framework";
import { c_declareFunctionName } from "../parse/parse_c";

const func_text = `
ref_strChunk* strChunk_new( int szof )
{
  ref_strChunk* pChunk = malloc( sizeof(ref_strChunk)) ;
  pChunk->pPv = NULL ;
  pChunk->pNx = NULL ;
  pChunk->szof = szof ? szof : 2000 ;
  pChunk->lgth = 0 ;
  pChunk->data = malloc( pChunk->szof );

  return pChunk ;
}
`;

// -------------------------------- c_parse_test --------------------------------
export function c_parse_test(): iTestResultItem[]
{
  const results = testResults_new();
  {
    const method = 'c_declareFunctionName';
    const { returnType, returnType_pointerTo, funcName } = c_declareFunctionName( func_text ) ;
    const expected = {returnType:'ref_strChunk', returnType_pointerTo:'*', funcName:'strChunk_new'};
    const actual = {returnType, returnType_pointerTo, funcName } ;
    const tryItem = { method, expected, actual };
    results.push( tryItem ) ;
  }

  {
    const func_text_nopointer = `
ref_strChunk strChunk_new( int szof )
{
  ref_strChunk* pChunk = malloc( sizeof(ref_strChunk)) ;
  return pChunk ;
}
`;
    const method = 'c_declareFunctionName';
    const aspect = 'no pointer to';
    const { returnType, returnType_pointerTo, funcName } = c_declareFunctionName(func_text_nopointer);
    const expected = { returnType: 'ref_strChunk', returnType_pointerTo: '', funcName: 'strChunk_new' };
    const actual = { returnType, returnType_pointerTo, funcName };
    const tryItem = { method, aspect, expected, actual };
    results.push(tryItem);
  }

  return results ;
}
