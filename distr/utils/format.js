"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Format = void 0;
class Format {
    static formatDate(date) {
        let dd = date.getDate().toString();
        let mm = (date.getMonth() + 1).toString();
        let yy = (date.getFullYear() % 100).toString();
        if (+dd < 10) {
            dd = '0' + dd;
        }
        if (+mm < 10) {
            mm = '0' + mm;
        }
        if (+yy < 10) {
            yy = '0' + yy;
        }
        return dd + '.' + mm + '.' + yy;
    }
    static toField(len, str) {
        let newStr = str;
        while (newStr.length < len) {
            newStr += ' ';
        }
        return newStr;
    }
}
exports.Format = Format;
