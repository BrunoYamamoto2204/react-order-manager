import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
    user: string
    password: string
    role: string,
    mfaEnabled: boolean,
    mfaSecret: string
    createdAt?: Date
}

const UserSchema = new Schema<IUser>({
    user: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String }
},{
    timestamps: true
})

const User = mongoose.models.Users
    || mongoose.model<IUser>("Users", UserSchema, "users")
export default User