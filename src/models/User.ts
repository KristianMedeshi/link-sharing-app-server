import mongoose, { Schema } from 'mongoose'

export interface IUser extends mongoose.Document {
  email: string
  password: string
  info: mongoose.Types.ObjectId
}

const userScheme: Schema<IUser> = new Schema<IUser>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  info: { type: Schema.Types.ObjectId, ref: 'UserInfo', required: true }
})

export default mongoose.model<IUser>('User', userScheme)
