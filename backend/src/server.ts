import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import cors from "cors";
import orderRoutes from "./routes/orderRoutes"
import productRoutes from "./routes/productRoutes"
import customerRouter from "./routes/customerRouter"

dotenv.config();

const app = express()
app.use(cors({
  origin: process.env.CLIENT_URL, 
}));
const port = process.env.PORT || 5000;

connectDB()

app.use(express.json())
app.use("/api/orders", orderRoutes)
app.use("/api/products", productRoutes)
app.use("/api/customers", customerRouter)

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`))