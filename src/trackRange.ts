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

	// text contents of the range. When processing a document change, this property
	// will contain the text value before the change was applied. May need this
	// value when the last character is a new line.
	text: string;
}

// ------------------------ trackRangeArray_applyDocumentChange ------------------------
export function trackRangeArray_applyDocumentChange(
	doc: vscode.TextDocument,
	rangeArr: iTrackRangeItem[], chg: vscode.TextDocumentContentChangeEvent)
{
	for (const item of rangeArr)
	{
		if (item.range)
		{
			trackRangeItem_applyDocumentChange(doc, item, chg);
		}
	}
}

// ----------------------------- trackRangeItem_update -----------------------------
export function trackRangeItem_update(
	doc: vscode.TextDocument, item: iTrackRangeItem,
	loc: { start?: vscode.Position, end?: vscode.Position, start_offset?: number, end_offset?: number })
{
	const { range, start_offset, end_offset, text } = trackRangeItem_new(doc, loc);

	item.range = range;
	item.start_offset = start_offset;
	item.end_offset = end_offset;
	item.text = text;
}

// ----------------------------- trackRangeItem_new -----------------------------
function trackRangeItem_new(
	doc: vscode.TextDocument,
	loc: { start?: vscode.Position, end?: vscode.Position, start_offset?: number, end_offset?: number })
	: iTrackRangeItem
{
	let { start, end, start_offset, end_offset } = loc;
	if (!start)
		start = doc.positionAt(start_offset!);
	if (typeof start_offset == 'undefined')
		start_offset = doc.offsetAt(start);

	if (!end)
		end = doc.positionAt(end_offset!);
	if (typeof end_offset == 'undefined')
		end_offset = doc.offsetAt(end);

	const range = new vscode.Range(start, end);

	const text = doc.getText(range);

	return { range, start_offset, end_offset, text };
}

// ----------------------------- trackRangeArray_push -----------------------------
export function trackRangeArray_push(
	doc: vscode.TextDocument,
	rangeArr: iTrackRangeItem[],
	loc: { start?: vscode.Position, end?: vscode.Position, start_offset?: number, end_offset?: number })
{
	const item = trackRangeItem_new(doc, loc);
	rangeArr.push(item);
}

// ---------------------- trackRangeItem_applyDocumentChange ----------------------
function trackRangeItem_applyDocumentChange(
	doc: vscode.TextDocument,
	item: iTrackRangeItem, chg: vscode.TextDocumentContentChangeEvent)
{
	if (item.range)
	{
		let adjusted = false;
		const item_start_line = item.range.start.line;
		const item_end_line = item.range.end.line;

		const item_start_offset = item.start_offset;
		const item_end_offset = item.end_offset;
		const chg_start_offset = chg.rangeOffset;
		const chg_end_offset = chg.rangeOffset + chg.rangeLength - 1;
		const chg_length = chg.text.length - chg.rangeLength;
		const chg_startLine = chg.range.start.line;
		const chg_endLine = chg.range.end.line;

		// first check if changed text is on lines before the track range. If so,
		// only have to adjust the tracked range by the number of lines affected by
		// the change.
		if (chg_endLine < item_start_line)
		{
			const linesInRange = chg_endLine - chg_startLine;
			const linesInserted = chg.text.split("\n").length - 1;
			const diff = linesInserted - linesInRange;
			const adj_start = item.range.start.translate(diff);
			const adj_end = item.range.end.translate(diff);
			trackRangeItem_update(doc, item, { start: adj_start, end: adj_end });
			adjusted = true;
		}

		// the lines affected by the change are after the tracked range. Any changes
		// have no affect on tracked range.
		else if (chg_startLine > item_end_line)
		{
			adjusted = true;
		}

		// changed text is on same lines as tracked range. Convert all values to offset
		// with document, then adjust position of tracked range based on those offsets.
		else
		{
			// item range starts after changes to document.
			if (item_start_offset > chg_end_offset)
			{
				const start_offset = item_start_offset + chg_length;
				const end_offset = item_end_offset + chg_length;
				const start = doc.positionAt(start_offset);
				const end = doc.positionAt(end_offset);
				trackRangeItem_update(doc, item, { start, end, start_offset, end_offset });
			}

			// change to document taking place after item range. No affect on item position.
			else if (item_end_offset < chg_start_offset)
			{
			}

			// change taking place within range of item.
			else 
			{
				// const item_length = item_end_offset - item_start_offset + 1 ;
				const item_length = item_end_offset - item_start_offset;

				// calc length of item that is before and after the changed text.
				const item_before_length = chg_start_offset - item_start_offset;
				const item_affected_start = (chg.rangeLength == 0) ? -1 : item_start_offset + item_before_length;
				const item_rem_length = item_length - item_before_length;

				// affected length is the chg.rangeLength. But does not exceed remaining length of item.
				// ( remember, when inserting text, chg.rangeLength will be zero. So affected range of
				//   the item is also zero. The item range is being extended. )
				const item_affected_length = (chg.rangeLength <= item_rem_length) ? chg.rangeLength : item_rem_length;

				const item_after_length = item_length - (item_before_length + item_affected_length);

				// length of item after change. Sum of item_before, item_after and the length of
				// change text.
				const item_length_after_chg = item_before_length + chg.text.length + item_after_length;

				// construct new range 
				if (item_length_after_chg <= 0)
				{
					item.range = undefined;
				}
				else
				{
					// const end_offset = item_start_offset + item_length_after_chg - 1;
					const end_offset = item_start_offset + item_length_after_chg;
					const start = item.range.start;
					trackRangeItem_update(doc, item, { start, end_offset });
				}
			}
		}
	}
}
