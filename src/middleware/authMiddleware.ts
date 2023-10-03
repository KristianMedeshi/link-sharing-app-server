import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'

export interface IJWTPayload {
  infoId: string
}

const authMiddleware = (
  req: Request & { decoded?: IJWTPayload },
  res: Response,
  next: NextFunction,
): void | Response => {
  if (req.method === 'OPTIONS') {
    next()
  }
  try {
    const token = req.cookies.jwt
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided.' })
    }
    req.decoded = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
    ) as IJWTPayload
    next()
  } catch (e) {
    res.status(401).json({ message: 'Unauthorized: Invalid token.' })
  }
}

export default authMiddleware
