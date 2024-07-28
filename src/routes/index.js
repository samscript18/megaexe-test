"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootRouter = void 0;
const express_1 = require("express");
const auth_1 = require("./auth");
const post_1 = require("./post");
exports.rootRouter = (0, express_1.Router)();
exports.rootRouter.use("/auth", auth_1.authRoutes);
exports.rootRouter.use("/post", post_1.postRoutes);
