// diagnostic-message.ts 

// iDiagnosticeMessage interface is intended to encapsulate all info that the
// stmt parser gathers when it finds an error.

import * as vscode from 'vscode';
import { iPositionedString, positionedString_toRange } from './positioned-string';

// ------------------------------ iDiagnosticMessage ------------------------------
export interface iDiagnosticMessage
{
	textItem: iPositionedString;
	message: string;
}

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
