import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import cors from "cors";
import orderRoutes from "./routes/orderRoutes"
import productRoutes from "./routes/productRoutes"
import customerRouter from "./routes/customerRouter"
import authRoutes from "./routes/authRoutes"
import { apiKeyAuth } from "./middleware/apiKeyAuth";
import { jwtAuth } from "./middleware/jwtAuth";

dotenv.config();

const app = express()
app.use(cors({
  origin: process.env.CLIENT_URL, 
}));
const port = process.env.PORT || 5000;

connectDB()

app.use(express.json())

// --------------------- AUTENTICAÇÃO ------------------ //

// Autenticação com apiKey para acessar o backend
app.use(apiKeyAuth)

// Rota de cadastro e login 
app.use("/api/auth", authRoutes)

// Autenticação com jwtAuth para acessar o backend
// app.use(jwtAuth)
// ----------------------------------------------------- //

// --------------------- APLICAÇÃO --------------------- //

// Rotas da aplicação (Apenas após autenticação )
app.use("/api/orders", jwtAuth, orderRoutes)
app.use("/api/products", jwtAuth, productRoutes)
app.use("/api/customers", jwtAuth, customerRouter)

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`))
// ----------------------------------------------------- //