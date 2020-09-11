import * as vscode from 'vscode';

export interface iServerUrlItem
{
  url: string,
  workspaceFolder: string,
  isDefault: boolean
}

// -------------------------- rock_getServerUrl ----------------------------------------
// the srsnip extension exposes commands: setServerUrl and getServerUrl.  The 
// serverUrl is the url of the server accessed by all the autocoder commands and 
// extensions.
export async function rock_getServerUrl(): Promise<string>
{
  let serverUrl : string | undefined = await vscode.commands.executeCommand('rock.getServerUrl');
  if ( !serverUrl )
    serverUrl = '' ;
  return serverUrl;
}

// -------------------------- rock_getServerUrlList ----------------------------------------
// serverUrlList is stored in global state of srsnip extension.
// The serverUrl specifies the server that the app of the project connects to.
// The webpage-runlog webview looks to the serverUrl to find the webpage-runlog data.
export function rock_getServerUrlList(context: vscode.ExtensionContext)
{
  let serverUrlList = context.globalState.get("serverUrlList") as iServerUrlItem[];
  if (!serverUrlList)
  {
    serverUrlList = [];
    context.globalState.update('serverUrlList', serverUrlList);
  }
  return serverUrlList;
}