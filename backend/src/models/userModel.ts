import mongoose, { Schema, Document } from "mongoose"

interface IUser extends Document {
    user: string
    password: string
    role: string
    createdAt?: Date
}

const UserSchema = new Schema<IUser>({
    user: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true }
},{
    timestamps: true
})

const User = mongoose.models.User 
    || mongoose.model<IUser>("Users", UserSchema, "users")
export default User