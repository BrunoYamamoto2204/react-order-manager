import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        const mongoUri = process.env.MONGODB_URI || ""
        await mongoose.connect(mongoUri)
        console.log("\n🚀 MongoDB conectado!")
    } catch(error) {
        console.log("Erro ao conectar:\n" + error)
        process.exit(1);
    }
}