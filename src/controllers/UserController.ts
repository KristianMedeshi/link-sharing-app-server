import assert from 'assert'

import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { Document } from 'mongoose'
import jwt from 'jsonwebtoken'
import ms from 'ms'

import User, { IUser } from '../models/User'
import UserInfo, { ILink, IProfile, IUserInfo } from '../models/UserInfo'
import { IJWTPayload } from '../middleware/authMiddleware'

const setJWTToken = (
  user: Document<unknown, unknown, IUser> & IUser,
  res: Response,
): void => {
  const payload: IJWTPayload = { infoId: user.info.toHexString() }
  const expiresIn = '24h'
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {
    expiresIn,
  })
  const tokenExpiration = new Date().getTime() + ms(expiresIn)
  res.cookie('jwt', token, {
    httpOnly: true,
    maxAge: tokenExpiration,
    sameSite: 'strict',
    secure: true,
  })
}

class UserController {
  static async authorized(req: Request, res: Response) {
    return res.json({ message: 'Authorized' })
  }
  static async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const candidate = await User.findOne({ email })
      if (candidate) {
        return res.status(400).json({ message: 'Account already exists' })
      }
      const passwordHash = bcrypt.hashSync(password, 8)
      const userInfo = new UserInfo()
      const user = new User({ email, password: passwordHash, info: userInfo })
      await userInfo.save()
      await user.save()
      setJWTToken(user, res)
      return res.json({ message: 'Registered' })
    } catch (e) {
      console.error(e)
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: 'User not found' })
      }
      const isValidPassword = bcrypt.compareSync(password, user.password)
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Password do not match' })
      }
      setJWTToken(user, res)
      return res.json({ message: 'Logged in' })
    } catch (e) {
      console.error(e)
    }
  }

  static async info(req: Request & { decoded?: IJWTPayload }, res: Response) {
    try {
      if (!req.decoded) {
        req.decoded = { infoId: req.params.infoId }
      }
      const userInfo = (await UserInfo.findById(
        req.decoded.infoId,
      )) as unknown as IUserInfo
      return res.json({
        id: userInfo.id,
        links: userInfo.links,
        profile: userInfo.profile,
      })
    } catch (e) {
      console.error(e)
    }
  }

  static async save(req: Request & { decoded?: IJWTPayload }, res: Response) {
    try {
      assert(req.decoded)
      const userInfo = (await UserInfo.findById(
        req.decoded.infoId,
      )) as unknown as IUserInfo
      userInfo.links = req.body.links as ILink[]
      userInfo.profile = req.body.profile as IProfile
      await userInfo.save()
      return res.json({ message: 'Saved' })
    } catch (e) {
      console.error(e)
    }
  }
}

export default UserController
