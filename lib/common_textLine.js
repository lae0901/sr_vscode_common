"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textLine_declareFunctionName = void 0;
// --------------------- textLine_declareFunctionName ----------------------------
// return func name that is declared on text line that contains function declare.
function textLine_declareFunctionName(line) {
    let funcName = '';
    if (line) {
        // look for function name in form "function funcName"
        {
            const regexp = /(^|\s+)function\s+(\w+)/;
            const matchArray = regexp.exec(line.text);
            if (matchArray && matchArray.length >= 3) {
                funcName = matchArray[2];
            }
        }
        // look for function name in form funcName = function
        if (!funcName) {
            const regexp = /(\w+)\s*=\s*function/;
            const matchArray = regexp.exec(line.text);
            if (matchArray && matchArray.length >= 2) {
                funcName = matchArray[1];
            }
        }
    }
    return funcName;
}
exports.textLine_declareFunctionName = textLine_declareFunctionName;
