import bcrypt from "bcryptjs";

export const encryptPassword = async (password: string) => {
  const encryptedPassword = await bcrypt.hash(password, 10);
  return encryptedPassword;
};

export const comparePassword = async (
  password: string,
  encryptedPassword: string
) => {
  return await bcrypt.compare(password, encryptedPassword);
};
