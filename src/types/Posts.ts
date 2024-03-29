import { Post, User } from "@prisma/client";

export type CollegePost = Omit<Post, "comments"> & { Auther: User } & {
  comments: (Comment & { User: User })[] & {
    _count: { comments: number; likes: number };
  };
};
