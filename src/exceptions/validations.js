"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnprocessableEntity = void 0;
const root_1 = require("./root");
class UnprocessableEntity extends root_1.HttpException {
    constructor(message, errorCode, errors) {
        super(message, 422, errorCode, errors);
    }
}
exports.UnprocessableEntity = UnprocessableEntity;
