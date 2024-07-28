"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRoutes = void 0;
const express_1 = require("express");
const errorHandler_1 = require("../handlers/errorHandler");
const auth_1 = __importDefault(require("../middlewares/auth"));
const post_1 = require("../controllers/post");
exports.postRoutes = (0, express_1.Router)();
exports.postRoutes
    .route("/")
    .post(auth_1.default, (0, errorHandler_1.errorHandler)(post_1.createPost))
    .get(auth_1.default, (0, errorHandler_1.errorHandler)(post_1.getPosts));
exports.postRoutes
    .route("/:id")
    .patch(auth_1.default, (0, errorHandler_1.errorHandler)(post_1.editPost))
    .delete(auth_1.default, (0, errorHandler_1.errorHandler)(post_1.deletePost));
exports.postRoutes.get("/filter/:category", [auth_1.default], (0, errorHandler_1.errorHandler)(post_1.filterPosts));
exports.postRoutes.get("/sort/:criteria", [auth_1.default], (0, errorHandler_1.errorHandler)(post_1.filterPosts));
exports.postRoutes
    .route("/:id/comments")
    .post(auth_1.default, (0, errorHandler_1.errorHandler)(post_1.addComments))
    .get(auth_1.default, (0, errorHandler_1.errorHandler)(post_1.getComments));
exports.postRoutes.post("/:id/upvote", [auth_1.default], (0, errorHandler_1.errorHandler)(post_1.upvote));
exports.postRoutes.post("/:id/downvote", [auth_1.default], (0, errorHandler_1.errorHandler)(post_1.downvote));
