import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import {sqlText_createObjectName} from './sqlText' ;
import { textLine_declareFunctionName } from './common_textLine';
import { javascript_declareFunctionName } from './parse_javascript';

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
  const results = testerResults_new( ) ;

  // sqlText_test
  {
    const {completion_arr, errmsg_arr} = await sqlText_test() ;
    testerResults_append( results, completion_arr, errmsg_arr );
  }

  // sqlCreateTable_test
  {
    const { completion_arr, errmsg_arr } = await sqlCreateTable_test();
    testerResults_append(results, completion_arr, errmsg_arr);
  }

  // parse_javascript_test
  {
    const { errmsg_arr, completion_arr } = await parse_javascript_test();
    testerResults_append( results, completion_arr, errmsg_arr ) ;
  }

  // write tester results to console.
  testerResults_consoleLog(results) ;
}

// ---------------------------------- sqlText_test ----------------------------------
async function sqlText_test( ) : Promise<iTesterResults>
{
  const results = testerResults_new( ) ;

  {
    const errmsg_arr : string[] = [] ;
    const completion_arr : string[] = [] ;
    let method = '' ;

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
        errmsg_arr.push(`${method} test failed. ${objectType}`);
      }
      else if (objectName != 'ITMST_GetLatestDueDate')
      {
        errmsg_arr.push(`${method} test failed. ${objectName}`);
      }
      else 
        completion_arr.push(`${method}. passed. ${objectType} ${objectName}`)
    }
    
    testerResults_append( results, completion_arr, errmsg_arr ) ;
  }

  return results ;
}

// ---------------------------------- sqlCreateTable_test ----------------------------------
async function sqlCreateTable_test(): Promise<iTesterResults>
{
  const errmsg_arr: string[] = [];
  const completion_arr: string[] = [];
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
      errmsg_arr.push(`${method} test failed. ${objectType}`);
    }
    else if ((objectName != 'itmstmo') || ( schemaName != 'aplusb1fcc'))
    {
      errmsg_arr.push(`${method} test failed. ${schemaName}/${objectName}`);
    }
    else
      completion_arr.push(`${method}. passed. ${objectType} ${schemaName}/${objectName}`)
  }

  return { completion_arr, errmsg_arr }
}

// ---------------------------------- parse_javascript_test ----------------------------------
async function parse_javascript_test()
{
  const errmsg_arr: string[] = [];
  const completion_arr: string[] = [];
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
      errmsg_arr.push(`${method} test failed. ${objectName}.${funcName} ${protoName} ${isAsync}`);
    }
    else
      completion_arr.push(`${method}. passed. ${objectName}.${funcName} ${protoName} ${isAsync}`)
  }

  return { errmsg_arr, completion_arr };
}
