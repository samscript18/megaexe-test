import { Request, Response } from "express";
import { prismaClient } from "..";
import { Post } from "@prisma/client";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { UnAuthorizedException } from "../exceptions/unauthorized.exception";
import { AddCommentsSchema, CreatePostSchema } from "../schema/posts";

export const createPost = async (req: Request, res: Response) => {
  const validatedData = CreatePostSchema.parse(req.body);
  const post = await prismaClient.post.create({
    data: {
      userId: req.user?.id!,
      content: validatedData.content,
      image: validatedData.image,
      category: validatedData.category,
    },
  });
  res.json(post);
};
export const editPost = async (req: Request, res: Response) => {
  let post: Post;
  try {
    post = await prismaClient.post.findFirstOrThrow({
      where: { id: Number(req.params.id) },
    });
  } catch (error) {
    throw new NotFoundException("Post not found", ErrorCode.POST_NOT_FOUND);
  }
  if (post.userId !== req.user?.id) {
    throw new UnAuthorizedException(
      "Unauthorized to edit this post",
      ErrorCode.UNAUTHORIZED
    );
  }

  const updatedPost = await prismaClient.post.update({
    where: { id: Number(req.params.id) },
    data: {
      content: req.body.content,
      category: req.body.category,
      updatedAt: new Date(),
    },
  });

  res.json(updatedPost);
};
export const deletePost = async (req: Request, res: Response) => {
  let post: Post;
  try {
    post = await prismaClient.post.findFirstOrThrow({
      where: { id: Number(req.params.id) },
    });
  } catch (error) {
    throw new NotFoundException("Post not found", ErrorCode.POST_NOT_FOUND);
  }
  if (post.userId !== req.user?.id) {
    throw new UnAuthorizedException(
      "Unauthorized to delete this post",
      ErrorCode.UNAUTHORIZED
    );
  }

  await prismaClient.post.delete({
    where: { id: Number(req.params.id) },
  });

  res.json({ message: "Post deleted" });
};

export const getPosts = async (req: Request, res: Response) => {
  const posts = await prismaClient.post.findMany({
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
};

export const filterPosts = async (req: Request, res: Response) => {
  const posts = await prismaClient.post.findMany({
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
};

export const sortPosts = async (req: Request, res: Response) => {
  let sortCriteria = {};
  if (req.params.criteria === "upvotes") {
    sortCriteria = { upvotes: "desc" };
  } else {
    sortCriteria = { createdAt: "desc" };
  }
  const posts = await prismaClient.post.findMany({
    include: {
      user: {
        select: { name: true, profilePicture: true },
      },
    },
    orderBy: sortCriteria,
  });
  res.json(posts);
  res.json({ count: posts.length, data: posts });
};

export const addComments = async (req: Request, res: Response) => {
  const validatedData = AddCommentsSchema.parse(req.body);
  const comment = await prismaClient.comment.create({
    data: {
      userId: req.user?.id!,
      postId: Number(req.params.id),
      content: validatedData.content,
      replyToId: validatedData.replyToId
        ? Number(validatedData.replyToId)
        : null,
    },
  });
  res.json(comment);
};

export const getComments = async (req: Request, res: Response) => {
  const comments = await prismaClient.comment.findMany({
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
};

export const upvote = async (req: Request, res: Response) => {
  let post: Post;
  try {
    post = await prismaClient.post.findFirstOrThrow({
      where: { id: Number(req.params.id) },
    });
  } catch (error) {
    throw new NotFoundException("Post not found", ErrorCode.POST_NOT_FOUND);
  }
  const updatedPost = await prismaClient.post.update({
    where: { id: Number(req.params.id) },
    data: {
      upvotes: { increment: 1 },
    },
  });

  res.json(updatedPost);
};

export const downvote = async (req: Request, res: Response) => {
  let post: Post;
  try {
    post = await prismaClient.post.findFirstOrThrow({
      where: { id: Number(req.params.id) },
    });
  } catch (error) {
    throw new NotFoundException("Post not found", ErrorCode.POST_NOT_FOUND);
  }
  const updatedPost = await prismaClient.post.update({
    where: { id: Number(req.params.id) },
    data: {
      downvotes: { increment: 1 },
    },
  });

  res.json(updatedPost);
};
