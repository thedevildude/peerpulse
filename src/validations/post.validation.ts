import zod from "zod";

const createPost = zod.object({
  body: zod.object({
    title: zod
      .string()
      .max(80, { message: "Title must be at most 80 characters long" })
      .optional(),
    content: zod
      .string()
      .max(1000, { message: "Must be less than 1000 characters" })
      .trim()
      .min(1),
    media: zod.string().optional(),
  }),
});

const createPoll = zod.object({
  body: zod.object({
    title: zod
      .string()
      .max(80, { message: "Title must be at most 80 characters long" })
      .optional(),
    content: zod
      .string()
      .max(150, { message: "Must be less than 150 characters" })
      .trim()
      .min(1),
    media: zod.string().optional(),
    options: zod
      .array(
        zod.object({
          content: zod
            .string()
            .max(100, { message: "Option must be at most 100 characters long" })
            .trim()
            .min(1),
          media: zod.string().optional(),
        })
      )
      .min(2),
  }),
});

export default { createPost, createPoll };
