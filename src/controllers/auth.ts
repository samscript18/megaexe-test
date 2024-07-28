import { Request, Response } from "express";
import { prismaClient } from "../index";
import { hashPassword, comparePassword } from "../helpers/auth.helper";
import jwtHelper from "../helpers/jwt.helper";
import { SignUpSchema } from "../schema/users";
import { BadRequestsException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { NotFoundException } from "../exceptions/not-found";

export const signup = async (req: Request, res: Response) => {
  SignUpSchema.parse(req.body);
  const { name, email, password } = req.body;
  const userExists = await prismaClient.user.findFirst({ where: { email } });
  if (userExists) {
    throw new BadRequestsException(
      "user with this email already exists",
      ErrorCode.USER_ALREADY_EXISTS
    );
  }
  const hashedPassword = await hashPassword(password);
  const user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: { id: true, name: true, email: true, profilePicture: true },
  });
  res.json({ user });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  const updatedUser = await prismaClient.user.findFirst({
    where: { email },
    select: { id: true, name: true, email: true, profilePicture: true },
  });
  if (!user || !updatedUser) {
    throw new NotFoundException(
      "User does not exist",
      ErrorCode.USER_NOT_FOUND
    );
  }
  const isMatch = await comparePassword(password, user?.password!);
  if (!isMatch) {
    throw new BadRequestsException(
      "Incorrect password",
      ErrorCode.INCORRECT_PASSWORD
    );
  }
  const accessToken = await jwtHelper.generateToken(user?.id.toString());
  res.json({ user: updatedUser, accessToken });
};
