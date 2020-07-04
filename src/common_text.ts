// ./src/common_text.ts

// ------------------------------- iDocumentLineXref -------------------------------
// document text line that cross references to the line number and start pos of the
// line in the document.
export interface iDocumentLineXref
{
  linn: number;
  start: number;
  text: string;
  eol: string;
}

// ---------------------------- lineXref_findTextIndex ----------------------------
// find the lineXref of the text line where the index in the text stream is located.
export function lineXref_findTextIndex( arr: iDocumentLineXref[], index:number )
{
  const found_item = arr.find((item) =>
  {
    const end_index = item.start + item.text.length + item.eol.length - 1 ;
    return( item.start <= index && index <= end_index);
  });
  return found_item ;
}

// -------------------------------- text_toLineXref --------------------------------
// split text stream into lines. Return array that locates start position of each
// text line in the stream.
export function text_toLineXref(text: string ): iDocumentLineXref[]
{
  // check text for eol string.
  const eol = ( text.indexOf('\r\n') >= 0) ? '\r\n' : '\n';
  const lines = text.split(eol);
  let start = 0;
  let linn = 0;
  let pv: iDocumentLineXref | null = null;
  const lineXref_arr = lines.map((item) =>
  {
    const xref = { linn, start, text: item, eol };
    linn += 1 ;
    start += item.length + eol.length;
    return xref;
  });
  return lineXref_arr;
}
