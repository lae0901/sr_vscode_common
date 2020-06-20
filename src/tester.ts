import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import {sqlText_createObjectName} from './sqlText' ;
import { textLine_declareFunctionName } from './common_textLine';
import { javascript_declareFunctionName } from './parse_javascript';

// run main function that is declared as async. 
async_main( ) ;

// ------------------------------- async_main ---------------------------------
async function async_main( )
{
  // sqlText_test
  {
    const { errmsg_arr, completion_arr } = await sqlText_test() ;
    for( const line of completion_arr )
    {
      console.log(line) ;
    }

    for (const line of errmsg_arr)
    {
      console.error(line);
    }
  }

  // parse_javascript_test
  {
    const { errmsg_arr, completion_arr } = await parse_javascript_test();
    for (const line of completion_arr)
    {
      console.log(line);
    }

    for (const line of errmsg_arr)
    {
      console.error(line);
    }
  }
}

// ---------------------------------- sqlText_test ----------------------------------
async function sqlText_test( )
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

  return {errmsg_arr, completion_arr};
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
    const { funcName, protoName, isAsync } = javascript_declareFunctionName( textLine ) ;
    if (( funcName != 'SrcmbrXref.readFolderContents') ||
          ( isAsync != true ) || ( protoName.length > 0 ))
    {
      errmsg_arr.push(`${method} test failed. ${funcName} ${protoName} ${isAsync}`);
    }
    else
      completion_arr.push(`${method}. passed. ${funcName} ${protoName} ${isAsync}`)
  }

  return { errmsg_arr, completion_arr };
}
