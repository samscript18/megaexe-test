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
exports.login = exports.signup = void 0;
const index_1 = require("../index");
const auth_helper_1 = require("../helpers/auth.helper");
const jwt_helper_1 = __importDefault(require("../helpers/jwt.helper"));
const users_1 = require("../schema/users");
const bad_request_1 = require("../exceptions/bad-request");
const root_1 = require("../exceptions/root");
const not_found_1 = require("../exceptions/not-found");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    users_1.SignUpSchema.parse(req.body);
    const { name, email, password } = req.body;
    const userExists = yield index_1.prismaClient.user.findFirst({ where: { email } });
    if (userExists) {
        throw new bad_request_1.BadRequestsException("user with this email already exists", root_1.ErrorCode.USER_ALREADY_EXISTS);
    }
    const hashedPassword = yield (0, auth_helper_1.hashPassword)(password);
    const user = yield index_1.prismaClient.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
        select: { id: true, name: true, email: true, profilePicture: true },
    });
    res.json({ user });
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    let user = yield index_1.prismaClient.user.findFirst({ where: { email } });
    const updatedUser = yield index_1.prismaClient.user.findFirst({
        where: { email },
        select: { id: true, name: true, email: true, profilePicture: true },
    });
    if (!user || !updatedUser) {
        throw new not_found_1.NotFoundException("User does not exist", root_1.ErrorCode.USER_NOT_FOUND);
    }
    const isMatch = yield (0, auth_helper_1.comparePassword)(password, user === null || user === void 0 ? void 0 : user.password);
    if (!isMatch) {
        throw new bad_request_1.BadRequestsException("Incorrect password", root_1.ErrorCode.INCORRECT_PASSWORD);
    }
    const accessToken = yield jwt_helper_1.default.generateToken(user === null || user === void 0 ? void 0 : user.id.toString());
    res.json({ user: updatedUser, accessToken });
});
exports.login = login;
