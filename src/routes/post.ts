import { Router } from "express";
import { errorHandler } from "../handlers/errorHandler";
import authMiddleware from "../middlewares/auth";
import {
  addComments,
  createPost,
  deletePost,
  downvote,
  editPost,
  filterPosts,
  getComments,
  getPosts,
  upvote,
} from "../controllers/post";

export const postRoutes: Router = Router();

postRoutes
  .route("/")
  .post(authMiddleware, errorHandler(createPost))
  .get(authMiddleware, errorHandler(getPosts));

postRoutes
  .route("/:id")
  .patch(authMiddleware, errorHandler(editPost))
  .delete(authMiddleware, errorHandler(deletePost));
postRoutes.get(
  "/filter/:category",
  [authMiddleware],
  errorHandler(filterPosts)
);
postRoutes.get("/sort/:criteria", [authMiddleware], errorHandler(filterPosts));
postRoutes
  .route("/:id/comments")
  .post(authMiddleware, errorHandler(addComments))
  .get(authMiddleware, errorHandler(getComments));
postRoutes.post("/:id/upvote", [authMiddleware], errorHandler(upvote));
postRoutes.post("/:id/downvote", [authMiddleware], errorHandler(downvote));
