"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddCommentsSchema = exports.CreatePostSchema = void 0;
const zod_1 = require("zod");
exports.CreatePostSchema = zod_1.z.object({
    image: zod_1.z.string(),
    content: zod_1.z.string(),
    category: zod_1.z.string(),
});
exports.AddCommentsSchema = zod_1.z.object({
    content: zod_1.z.string(),
    replyToId: zod_1.z.string(),
});
