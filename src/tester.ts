import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import {sqlText_createObjectName} from './sqlText' ;
import { textLine_declareFunctionName } from './common_textLine';
import { javascript_declareFunctionName, javascript_declareInterfaceName } from './parse_javascript';
import { testResults_append, testResults_consoleLog, testResults_new, iTestResultItem } from 'sr_test_framework';

interface iTesterResults
{
  completion_arr: string[],
  errmsg_arr: string[]
};

// run main function that is declared as async. 
async_main( ) ;

// ----------------------------- testerResults_append -----------------------------
function testerResults_append( testerResults:iTesterResults, 
                              completion_arr: string[], errmsg_arr: string[])
{
  testerResults.completion_arr.push( ...completion_arr );
  testerResults.errmsg_arr.push( ...errmsg_arr );
}

// --------------------------- testerResults_consoleLog ---------------------------
function testerResults_consoleLog( testerResults: iTesterResults )
{
  const { errmsg_arr, completion_arr } = testerResults;
  for (const line of completion_arr)
  {
    console.log(line);
  }

  for (const line of errmsg_arr)
  {
    console.error(line);
  }
}

// ------------------------------- testerResults_new -------------------------------
function testerResults_new( ) : iTesterResults
{
  const errmsg_arr: string[] = [] ;
  const completion_arr: string[] = [] ;
  return { completion_arr, errmsg_arr } ;
}

// ------------------------------- async_main ---------------------------------
async function async_main( )
{
  const results = testResults_new();

  // sqlText_test
  {
    const {results:res} = await sqlText_test() ;
    results.push(...res);
  }

  // sqlCreateTable_test
  {
    const { results:res } = await sqlCreateTable_test();
    results.push(...res);
  }

  // parse_javascript_test
  {
    const { results: res } = await parse_javascript_test();
    results.push(...res);
  }

  {
    const { results: res } = await javascript_declareInterfaceName_test() ;
    results.push(...res);
  }

  // write tester results to console.
  testResults_consoleLog(results) ;
}

// ---------------------------------- sqlText_test ----------------------------------
export async function sqlText_test( ) : Promise<{results:iTestResultItem[]}>
{
  const results = testResults_new();
  let errmsg = '';
  let passText = '';
  let method = '';

  {
    const stmtText = `-- comment text
    CREATE or replace FUNCTION ITMST_GetLatestDueDate(  
        inItno       char(27),                              
        inWhid       char(2))                               
        returns      decimal(6,0)                           
        language sql                                        
                                                            
        begin atomic    `;

    // test the string_padLeft function.
    {
      method = 'sqlText_createObjectName' ;
      const { objectType, objectName } = sqlText_createObjectName( stmtText );
      if ( objectType != 'function')
      {
        errmsg = `${method} test failed. ${objectType}`;
      }
      else if (objectName != 'ITMST_GetLatestDueDate')
      {
        errmsg = `${method} test failed. ${objectName}`;
      }
      else 
        passText = `${method}. passed. ${objectType} ${objectName}`;
    }
    
    testResults_append(results, passText, errmsg, method);
  }

  return {results} ;
}

// ---------------------------------- sqlCreateTable_test ----------------------------------
export async function sqlCreateTable_test(): Promise<{results:iTestResultItem[]}>
{
  const results = testResults_new();
  let errmsg = '';
  let passText = '';
  let method = '';

  const stmtText = `
  create table  aplusb1fcc/itmstmo                         
    (                                                        
    itno          char(27),                                  
    pritnum       char(30) not null default ' ',             
    qualCat       char(256) not null default ' ' ccsid 1208, `;

  // test the string_padLeft function.
  {
    method = 'sqlText_createObjectName_schema';
    const { objectType, objectName, schemaName } = sqlText_createObjectName(stmtText);
    if (objectType != 'table')
    {
      errmsg = `${method} test failed. ${objectType}`;
    }
    else if ((objectName != 'itmstmo') || ( schemaName != 'aplusb1fcc'))
    {
      errmsg = `${method} test failed. ${schemaName}/${objectName}`;
    }
    else
      passText = `${method}. passed. ${objectType} ${schemaName}/${objectName}`;
    testResults_append(results, passText, errmsg, method);
  }

  return { results }
}

// ---------------------------------- parse_javascript_test ----------------------------------
export async function parse_javascript_test()
{
  const results = testResults_new();
  let errmsg = '';
  let passText = '';
  let method = '';

  const textLine = `SrcmbrXref.readFolderContents = async function( dirPath:string)
{
	const folderContentsFilePath = path.join(dirPath, '.srcmbr-folderContents.json');
	let { text, errmsg } = await file_readText( folderContentsFilePath ) ;
	if ( !text )
		text = '[]' ;
	const folderContents = JSON.parse( text ) as iFolderContent[];
	return folderContents ;
}`;

  // test the textLine_declareFunctionName function.
  {
    method = 'javascript_declareFunctionName';
    const { objectName, funcName, protoName, isAsync } = javascript_declareFunctionName( textLine ) ;
    if ( (objectName != 'SrcmbrXref') || ( funcName != 'readFolderContents') ||
          ( isAsync != true ) || ( protoName.length > 0 ))
    {
      errmsg = `${method} test failed. ${objectName}.${funcName} ${protoName} ${isAsync}`;
    }
    else
      passText = `${method}. passed. ${objectName}.${funcName} ${protoName} ${isAsync}`;
    testResults_append(results, passText, errmsg, method);
  }

  return { results };
}

// -------------------- javascript_declareFunctionName_property_test --------------
export async function javascript_declareFunctionName_property_test()
{
  let method = '';
  const results = testResults_new();
  let errmsg = '';
  let passText = '';

  {
    const textLine = `async expItem_addMeta(item, options, custName)
    {
      options = options || {};
      item.add = options.add || false;
      item.focusProp = options.focusProp || '';
    }`;

    // test the textLine_declareFunctionName function.
    {
      method = 'javascript_declareFunctionName';
      const { objectName, funcName, protoName, isAsync } = javascript_declareFunctionName(textLine);
      if ((funcName != 'expItem_addMeta') ||
        (isAsync != true) || (protoName.length > 0))
      {
        errmsg = `${method} test failed. ${objectName}.${funcName} ${protoName} ${isAsync}`;
      }
      else
        passText = `${method}. passed. ${objectName}.${funcName} ${protoName} ${isAsync}`;
      testResults_append(results, passText, errmsg, method);
    }
  }

  {
    const textLine = `async expItem_addMeta( )
    {
      options = options || {};
      item.add = options.add || false;
      item.focusProp = options.focusProp || '';
    }`;

    // test the textLine_declareFunctionName function.
    {
      method = 'javascript_declareFunctionName';
      const { objectName, funcName, protoName, isAsync } = javascript_declareFunctionName(textLine);
      if ((funcName != 'expItem_addMeta') ||
        (isAsync != true) || (protoName.length > 0))
      {
        errmsg = `${method} test failed. ${objectName}.${funcName} ${protoName} ${isAsync}`;
      }
      else
        passText = `${method}. passed. ${objectName}.${funcName} ${protoName} ${isAsync}`;
      testResults_append(results, passText, errmsg, method);
    }
  }

  return { results };
}

// -------------------------- javascript_declareInterfaceName_test ----------------
export async function javascript_declareInterfaceName_test()
{
  let method = '';
  const results = testResults_new() ;
  let errmsg = '' ;
  let passText = '' ;

  const textLine = `
  interface iLineMatchItem
  {
  howCompare : HowCompare,`;

  // test the javascript_declareInterfaceName function.
  {
    method = 'javascript_declareInterfaceName';
    const { interfaceName } = javascript_declareInterfaceName(textLine);
    if ( !interfaceName ) 
      errmsg = `interface name not found`;
    else if ( interfaceName != 'iLineMatchItem')
      errmsg = `incorrect interface name ${interfaceName}`;
    else
      passText = `parsed interface name ${interfaceName}`;
    testResults_append(results, passText, errmsg, method );
  }

  const textLine2 = `interface iLineMatchItem`;

  // test the javascript_declareInterfaceName function.
  {
    method = 'javascript_declareInterfaceName ( interface name at end of string )';
    const { interfaceName } = javascript_declareInterfaceName(textLine2);
    if (!interfaceName)
      errmsg = `interface name not found`;
    else if (interfaceName != 'iLineMatchItem')
      errmsg = `incorrect interface name ${interfaceName}`;
    else
      passText = `parsed interface name ${interfaceName}`;
    testResults_append(results, passText, errmsg, method);
  }

  return { results };
}
