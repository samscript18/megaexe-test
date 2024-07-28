"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const errorHandler_1 = require("../handlers/errorHandler");
exports.authRoutes = (0, express_1.Router)();
exports.authRoutes.post("/signup", (0, errorHandler_1.errorHandler)(auth_1.signup));
exports.authRoutes.post("/login", (0, errorHandler_1.errorHandler)(auth_1.login));
