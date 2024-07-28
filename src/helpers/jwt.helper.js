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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const secrets_const_1 = __importDefault(require("../constants/secrets.const"));
const jsonwebtoken_1 = require("jsonwebtoken");
class JWT {
    decode() {
        return Buffer.from(secrets_const_1.default.jwtSecret).toString("ascii");
    }
    generateToken(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield (0, jsonwebtoken_1.sign)({ userId }, this.decode(), { expiresIn: "1d" });
            return token;
        });
    }
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield (0, jsonwebtoken_1.verify)(token, this.decode());
            return payload;
        });
    }
}
const jwtHelper = new JWT();
exports.default = jwtHelper;
