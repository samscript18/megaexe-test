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
exports.downvote = exports.upvote = exports.getComments = exports.addComments = exports.sortPosts = exports.filterPosts = exports.getPosts = exports.deletePost = exports.editPost = exports.createPost = void 0;
const __1 = require("..");
const not_found_1 = require("../exceptions/not-found");
const root_1 = require("../exceptions/root");
const unauthorized_exception_1 = require("../exceptions/unauthorized.exception");
const posts_1 = require("../schema/posts");
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const validatedData = posts_1.CreatePostSchema.parse(req.body);
    const post = yield __1.prismaClient.post.create({
        data: {
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            content: validatedData.content,
            image: validatedData.image,
            category: validatedData.category,
        },
    });
    res.json(post);
});
exports.createPost = createPost;
const editPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let post;
    try {
        post = yield __1.prismaClient.post.findFirstOrThrow({
            where: { id: Number(req.params.id) },
        });
    }
    catch (error) {
        throw new not_found_1.NotFoundException("Post not found", root_1.ErrorCode.POST_NOT_FOUND);
    }
    if (post.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new unauthorized_exception_1.UnAuthorizedException("Unauthorized to edit this post", root_1.ErrorCode.UNAUTHORIZED);
    }
    const updatedPost = yield __1.prismaClient.post.update({
        where: { id: Number(req.params.id) },
        data: {
            content: req.body.content,
            category: req.body.category,
            updatedAt: new Date(),
        },
    });
    res.json(updatedPost);
});
exports.editPost = editPost;
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let post;
    try {
        post = yield __1.prismaClient.post.findFirstOrThrow({
            where: { id: Number(req.params.id) },
        });
    }
    catch (error) {
        throw new not_found_1.NotFoundException("Post not found", root_1.ErrorCode.POST_NOT_FOUND);
    }
    if (post.userId !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        throw new unauthorized_exception_1.UnAuthorizedException("Unauthorized to delete this post", root_1.ErrorCode.UNAUTHORIZED);
    }
    yield __1.prismaClient.post.delete({
        where: { id: Number(req.params.id) },
    });
    res.json({ message: "Post deleted" });
});
exports.deletePost = deletePost;
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield __1.prismaClient.post.findMany({
        include: {
            user: {
                select: { name: true, profilePicture: true },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    res.json({ count: posts.length, data: posts });
});
exports.getPosts = getPosts;
const filterPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield __1.prismaClient.post.findMany({
        where: { category: req.params.category },
        include: {
            user: {
                select: { name: true, profilePicture: true },
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    res.json({ count: posts.length, data: posts });
});
exports.filterPosts = filterPosts;
const sortPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let sortCriteria = {};
    if (req.params.criteria === "upvotes") {
        sortCriteria = { upvotes: "desc" };
    }
    else {
        sortCriteria = { createdAt: "desc" };
    }
    const posts = yield __1.prismaClient.post.findMany({
        include: {
            user: {
                select: { name: true, profilePicture: true },
            },
        },
        orderBy: sortCriteria,
    });
    res.json(posts);
    res.json({ count: posts.length, data: posts });
});
exports.sortPosts = sortPosts;
const addComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const validatedData = posts_1.AddCommentsSchema.parse(req.body);
    const comment = yield __1.prismaClient.comment.create({
        data: {
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            postId: Number(req.params.id),
            content: validatedData.content,
            replyToId: validatedData.replyToId
                ? Number(validatedData.replyToId)
                : null,
        },
    });
    res.json(comment);
});
exports.addComments = addComments;
const getComments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comments = yield __1.prismaClient.comment.findMany({
        where: { postId: Number(req.params.id) },
        include: {
            user: {
                select: { name: true, profilePicture: true },
            },
            replies: { select: { userId: true, content: true } },
        },
        orderBy: {
            createdAt: "asc",
        },
    });
    res.json({ count: comments.length, data: comments });
});
exports.getComments = getComments;
const upvote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let post;
    try {
        post = yield __1.prismaClient.post.findFirstOrThrow({
            where: { id: Number(req.params.id) },
        });
    }
    catch (error) {
        throw new not_found_1.NotFoundException("Post not found", root_1.ErrorCode.POST_NOT_FOUND);
    }
    const updatedPost = yield __1.prismaClient.post.update({
        where: { id: Number(req.params.id) },
        data: {
            upvotes: { increment: 1 },
        },
    });
    res.json(updatedPost);
});
exports.upvote = upvote;
const downvote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let post;
    try {
        post = yield __1.prismaClient.post.findFirstOrThrow({
            where: { id: Number(req.params.id) },
        });
    }
    catch (error) {
        throw new not_found_1.NotFoundException("Post not found", root_1.ErrorCode.POST_NOT_FOUND);
    }
    const updatedPost = yield __1.prismaClient.post.update({
        where: { id: Number(req.params.id) },
        data: {
            downvotes: { increment: 1 },
        },
    });
    res.json(updatedPost);
});
exports.downvote = downvote;
