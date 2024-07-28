import { z } from "zod";

export const SignUpSchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })
  .required({ name: true, email: true, password: true });
