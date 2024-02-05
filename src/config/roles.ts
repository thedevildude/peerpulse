import { Role } from "@prisma/client";

const allRoles = {
  [Role.USER]: ["createPost", "createPoll", "votePoll", "commentPost"],
  [Role.ADMIN]: ["getUsers", "manageUsers"],
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
