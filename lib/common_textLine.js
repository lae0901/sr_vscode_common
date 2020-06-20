"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textLine_declareFunctionName = void 0;
const parse_javascript_1 = require("./parse_javascript");
// --------------------- textLine_declareFunctionName ----------------------------
// return func name that is declared on text line that contains function declare.
function textLine_declareFunctionName(line) {
    let funcName = '';
    let protoName = '';
    let isAsync = false;
    if (line) {
        ({ funcName, protoName, isAsync } = parse_javascript_1.javascript_declareFunctionName(line.text));
    }
    return { funcName, protoName, isAsync };
}
exports.textLine_declareFunctionName = textLine_declareFunctionName;
//# sourceMappingURL=common_textLine.js.map