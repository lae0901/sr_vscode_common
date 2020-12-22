// diagnostic-message.ts 

// iDiagnosticeMessage interface is intended to encapsulate all info that the
// stmt parser gathers when it finds an error.

import { iDiagnosticMessage, iPositionedString } from 'sr_ibmi_common';
import * as vscode from 'vscode';
import { positionedString_toRange } from './positioned-string';

// ----------------------------- diagnosticMessage_new -----------------------------
export function diagnosticMessage_new( textItem: iPositionedString, message: string )
{
	const msg : iDiagnosticMessage = {textItem, message } ;
	return msg ;
}

// ---------------------------- diagnosticMessage_toDiagnostic ----------------------------
export function diagnosticMessage_toDiagnostic( msg: iDiagnosticMessage )
{
	const diag: vscode.Diagnostic = {
		code: '',
		message: msg.message,
		range: positionedString_toRange( msg.textItem),
		severity: vscode.DiagnosticSeverity.Error,
		source: ''
	};
	return diag;
}
