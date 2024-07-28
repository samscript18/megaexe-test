"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const root_1 = require("../exceptions/root");
const internal_exception_1 = require("../exceptions/internal.exception");
const zod_1 = require("zod");
const validations_1 = require("../exceptions/validations");
const errorHandler = (method) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield method(req, res, next);
        }
        catch (error) {
            let exception;
            if (error instanceof root_1.HttpException) {
                exception = error;
            }
            else {
                if (error instanceof zod_1.ZodError) {
                    exception = new validations_1.UnprocessableEntity("Unprocessable entity", root_1.ErrorCode.UNPROCESSABLE_ENTITY, error);
                }
                else {
                    exception = new internal_exception_1.InternalException("Internal Server Error", root_1.ErrorCode.INTERNAL_SERVER_ERR0R, error);
                }
            }
            next(exception);
        }
    });
};
exports.errorHandler = errorHandler;
