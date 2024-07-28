"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnAuthorizedException = void 0;
const root_1 = require("./root");
class UnAuthorizedException extends root_1.HttpException {
    constructor(message, errorCode, errors) {
        super(message, 401, errorCode, errors);
    }
}
exports.UnAuthorizedException = UnAuthorizedException;
