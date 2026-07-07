import mongoose from "mongoose"
import User from "../models/userModel"
import bcrypt from "bcryptjs"
import dotenv from "dotenv";

dotenv.config()

const createUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "")
        console.log("🚀 MongoDB Conectado!")

        const username = process.argv[2]
        const password = process.argv[3]
        const role = process.argv[4] || "user"

        if (!username || !password) {
            console.log("📍 Formato do script: npm run create-user <username> <password> [role]")
            process.exit(1)
        }
        
        const existingUser = await User.findOne({ username })
        if (existingUser) {
            console.log("⚠ Username já existe!")
            process.exit(1)
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            user: username,
            password: hashPassword,
            role: role,
        })

        await newUser.save()
        console.log("✅ Usuário criado com sucesso!")
        console.log(`👤 User: ${username}`)
        console.log(`🥼 Role: ${role}`)

        process.exit(1)
    } catch (error) {
        console.log("❌ Erro ao criar usuário: ", error)
        process.exit(1)
    }
}

createUser()