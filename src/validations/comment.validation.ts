import zod from "zod";

const createComment = zod.object({
  body: zod.object({
    content: zod
      .string()
      .max(300, { message: "Must be less than 300 characters" })
      .trim()
      .min(1),
    postId: zod.string(),
  }),
});

export default { createComment };
