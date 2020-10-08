// trackRange.ts 
// track range locations in document as text is inserted and removed from the
// document
import * as vscode from 'vscode';

// -------------------------------- iTrackRangeItem --------------------------------
export interface iTrackRangeItem
{
	range: vscode.Range | undefined;
	start_offset: number;
	end_offset: number;
}

// ------------------------ trackRangeArray_applyDocumentChange -------------------
export function trackRangeArray_applyDocumentChange( 
	doc: vscode.TextDocument,			
	rangeArr: iTrackRangeItem[], chg: vscode.TextDocumentContentChangeEvent )
{
	for( const item of rangeArr )
	{
		if ( item.range )
		{
			trackRangeItem_applyDocumentChange( doc, item, chg ) ;
		}
	}
}

// ----------------------------- trackRangeArray_push -----------------------------
export function trackRangeArray_push( 
			doc: vscode.TextDocument,
			rangeArr: iTrackRangeItem[], 
			loc: {start?:vscode.Position, end?:vscode.Position, start_offset?:number, end_offset?:number})
{
	let { start, end, start_offset, end_offset } = loc ;
	if ( !start )
		start = doc.positionAt( start_offset! ) ;
	if ( typeof start_offset == 'undefined')
		start_offset = doc.offsetAt( start ) ;
		
	if (!end)
		end = doc.positionAt(end_offset!);
	if (typeof end_offset == 'undefined')
		end_offset = doc.offsetAt(end);

	const range = new vscode.Range( start, end ) ;
	rangeArr.push({range, start_offset, end_offset }) ;
}

// ---------------------- trackRangeItem_applyDocumentChange ----------------------
function trackRangeItem_applyDocumentChange( 
					doc: vscode.TextDocument,			
					item: iTrackRangeItem, chg: vscode.TextDocumentContentChangeEvent)
{
	if ( item.range )
	{
		let adjusted = false ;
		const item_start_line = item.range.start.line ;
		const item_end_line = item.range.end.line ;

		// bgnTemp
		const lines = doc.getText().split('\n') ;
		const line_0 = lines[0] ;
		const line_1 = lines[1] ;
		const line_2 = lines[2] ;
		// endTemp

		// first check if changed text is on lines before the track range. If so,
		// only have to adjust the tracked range by the number of lines affected by
		// the change.
		{
			const startLine = chg.range.start.line;
			const endLine = chg.range.end.line;
			if ( endLine < item_start_line )
			{
				const linesInRange = endLine - startLine;
				const linesInserted = chg.text.split("\n").length - 1;
				const diff = linesInserted - linesInRange;
				const adj_start = item.range.start.translate(diff) ;
				const adj_end = item.range.end.translate(diff) ;
				item.range = new vscode.Range(adj_start, adj_end ) ;
				adjusted = true ;
			}

			// the lines affected by the change are after the tracked range. Any changes
			// have no affect on tracked range.
			else if ( startLine > item_end_line )
			{
				adjusted = true ;
			}
		}

		// changed text is on same lines as tracked range. Convert all values to offset
		// with document, then adjust position of tracked range based on those offsets.
		if ( !adjusted )
		{
			const item_start_offset = item.start_offset ;
			const item_end_offset = item.end_offset ;
			const chg_start_offset = chg.rangeOffset ;
			const chg_end_offset = chg.rangeOffset + chg.rangeLength - 1 ;
			const chg_length = chg.text.length - chg.rangeLength;
			
			// item range starts after changes to document.
			if ( item_start_offset > chg_end_offset )
			{
				const start = doc.positionAt( item_start_offset + chg_length );
				const end = doc.positionAt( item_end_offset + chg_length );
				item.range = new vscode.Range(start, end) ;
			}
			
			// change to document taking place after item range. No affect on item position.
			else if ( item_end_offset < chg_start_offset )
			{
			}
			
			// change taking place within range of item.
			else 
			{
				const item_length = item_end_offset - item_start_offset + 1 ;
				
				// calc length of item that is before and after the changed text.
				const item_before_length = chg_start_offset - item_start_offset ;
				const item_affected_start = item_start_offset + item_before_length ;
				const item_rem_length = item_length - item_before_length ;
				const item_affected_length = item_rem_length > chg_length ? chg_length : item_rem_length ;
				const item_after_length = item_length - ( item_before_length + item_affected_length) ;
				
				// length of item after change. Sum of item_before, item_after and the length of
				// change text.
				const item_length_after_chg = item_before_length + chg.text.length + item_after_length ;
				
				// construct new range 
				if ( item_length_after_chg <= 0 )
				{
					item.range = undefined ;
				}
				else
				{
					const start = item.range.start;
					const end = doc.positionAt(item_start_offset + item_length_after_chg - 1);
					item.range = new vscode.Range(start, end);
				}
			}
		}
	}
}
