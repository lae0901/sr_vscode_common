import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import {sqlText_createObjectName} from './sqlText' ;

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


