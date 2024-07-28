import { z } from "zod";

export const CreatePostSchema = z.object({
  image: z.string(),
  content: z.string(),
  category: z.string(),
});

export const AddCommentsSchema = z.object({
  content: z.string(),
  replyToId: z.string(),
});
