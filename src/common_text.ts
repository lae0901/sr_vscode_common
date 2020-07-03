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

// -------------------------------- text_toLineXref --------------------------------
// split text stream into lines. Return array that locates start position of each
// text line in the stream.
export function text_toLineXref(text: string, eol: string): iDocumentLineXref[]
{
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
