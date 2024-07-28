import { NextFunction, Request, Response } from "express";
import { UnAuthorizedException } from "../exceptions/unauthorized.exception";
import { ErrorCode } from "../exceptions/root";
import { prismaClient } from "..";
import jwtHelper from "../helpers/jwt.helper";
import { User } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    next(new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
  const token = authHeader?.split(" ")[1];
  try {
    const payload = await jwtHelper.verifyToken(token!);
    if (!payload.userId) {
      next(new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }

    const user = await prismaClient.user.findFirst({
      where: { id: +payload.userId },
    });

    if (!user) {
      next(new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }
    req.user = user!;

    next();
  } catch (error) {
    next(
      new UnAuthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED, error)
    );
  }
};

export default authMiddleware;
