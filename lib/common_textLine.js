"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textLine_declareFunctionName = void 0;
// --------------------- textLine_declareFunctionName ----------------------------
// return func name that is declared on text line that contains function declare.
function textLine_declareFunctionName(line) {
    let funcName = '';
    let protoName = '';
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
            const regexp = /((\w+)\.prototype\.)?(\w+)\s*=\s*function/;
            const matchArray = regexp.exec(line.text);
            if (matchArray && matchArray.length >= 4) {
                protoName = matchArray[2];
                funcName = matchArray[3];
            }
        }
    }
    return { funcName, protoName };
}
exports.textLine_declareFunctionName = textLine_declareFunctionName;
