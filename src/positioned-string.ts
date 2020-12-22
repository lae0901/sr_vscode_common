// src/common/positioned-string.ts

import * as vscode from 'vscode';
import { iPositionedString } from 'sr_ibmi_common' ;

// --------------------------- positionedString_contains ---------------------------
export function positionedString_contains( posstr: iPositionedString, pos: vscode.Position )
{
	const ex = posstr.coln + posstr.text.length - 1 ;
	if (( posstr.linn == pos.line ) && ( pos.character >= posstr.coln ) 
			&& ( pos.character <= ex ))
		return true ;
	else 
		return false ;
}

// --------------------------- positionedString_toRange ---------------------------
export function positionedString_toRange( posstr: iPositionedString )
{
	const { text, linn, coln } = posstr ;
	const start = new vscode.Position( linn, coln ) ;
	const end = new vscode.Position( linn, coln + text.length ) ;
	const range = new vscode.Range( start, end ) ;
	return range ;
}
