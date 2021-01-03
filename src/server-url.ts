import { iConnectSettings } from 'sr_ibmi_common';
import * as vscode from 'vscode';

export interface iServerUrlItem
{
  url: string,
  workspaceFolder: string,
  isDefault: boolean
}

// -------------------------- rock_currentConnectSettings --------------------------
/**
 * return current ibm i connection setting. Connection settings include the URL of
 * ibm i, autocoder IFS product folder, product library, ...
 */
export async function rock_currentConnectSettings()
{
  const connectSettings = (await vscode.commands.executeCommand('rock.currentConnectSettings')) as iConnectSettings;
  return connectSettings;
}

// -------------------------- rock_getConnectSettings --------------------------
/**
 * return current ibm i connection setting. Connection settings include the URL of
 * ibm i, autocoder IFS product folder, product library, ...
 */
export async function rock_getConnectSettings( connectName: string | undefined )
{
  const connectSettings = 
      (await vscode.commands.executeCommand('rock.getConnectSettings', connectName )) as iConnectSettings;
  return connectSettings;
}
