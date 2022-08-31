import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Payload } from "../types/payload";

export const hashCreator = (text: string) => {
  const salt = 10;
  return bcrypt.hash(text, salt);
};
export const createToken = (payload: Payload) =>
  jwt.sign(payload, process.env.SECRET);

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.SECRET);

export const hashCompare = (pasword: string, paswordHash: string) =>
  bcrypt.compare(pasword, paswordHash);
