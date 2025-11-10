import { Request, Response, NextFunction } from "express";
import admin from "../firebase";

// middleware to detect authentication but not fail if no token
const optionalAuthenticateFirebase = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // if no header or doesn't start with Bearer, continue without authentication
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    (req as any).user = undefined;
    return next();
  }

  const token = authHeader.split(" ")[1];

  // if no token, continue without authentication
  if (!token) {
    (req as any).user = undefined;
    return next();
  }

  try {
    // try to verify the token
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    // if there is an error verifying, continue without authentication (don't block)
    (req as any).user = undefined;
    next();
  }
};

export default optionalAuthenticateFirebase;
