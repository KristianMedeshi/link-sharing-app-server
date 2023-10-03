import mongoose, { Document, Schema } from 'mongoose'

export interface ILink {
  platform: string
  link: string
}

export interface IProfile {
  firstName: string
  lastName: string
  email: string
  image: string
}

export interface IUserInfo extends Document {
  profile: IProfile
  links: ILink[]
}

const userInfoScheme: Schema<IUserInfo> = new Schema<IUserInfo>({
  profile: {
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    email: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  links: [
    {
      platform: { type: String, required: true },
      link: { type: String, required: true },
    },
  ],
})

export default mongoose.model<IUserInfo>('UserInfo', userInfoScheme)
