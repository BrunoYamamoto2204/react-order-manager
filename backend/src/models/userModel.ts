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
    role: { type: String, required: true, default: null },
    mfaEnabled: { type: Boolean, required: true, default: false },
    mfaSecret: { type: String, default: null }
},{
    timestamps: true
})

const User = mongoose.models.Users
    || mongoose.model<IUser>("Users", UserSchema, "users")
export default User