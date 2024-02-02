import zod from "zod";

const register = zod.object({
  body: zod.object({
    email: zod.string().email({ message: "Invalid email address" }),
    password: zod
      .string()
      .min(5, { message: "Password must be at least 5 characters long" })
      .max(10, { message: "Password must be at most 10 characters long" }),
    username: zod
      .string({ required_error: "Username is required" })
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(15, { message: "Username must be at most 15 characters long" }),
  }),
});

const login = zod.object({
  body: zod.object({
    email: zod.string().email({ message: "Invalid email address" }),
    password: zod.string().min(1, { message: "Password is required" }),
  }),
});

const logout = zod.object({
  body: zod.object({
    refreshToken: zod.string().trim().min(1),
  }),
});

const refreshToken = zod.object({
  body: zod.object({
    refreshToken: zod.string().trim().min(1),
  }),
});

const forgotPassword = zod.object({
  body: zod.object({
    email: zod.string().email({ message: "Invalid email address" }),
  }),
});

const resetPassword = zod.object({
  query: zod.object({
    token: zod.string().trim().min(1),
  }),
  body: zod.object({
    password: zod
      .string()
      .min(5, { message: "Password must be at least 5 characters long" })
      .max(10, { message: "Password must be at most 10 characters long" }),
  }),
});

const verifyEmail = zod.object({
  query: zod.object({
    token: zod.string().trim().min(1),
  }),
});

export default {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
