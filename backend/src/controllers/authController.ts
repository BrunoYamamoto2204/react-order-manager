import { Request, Response } from 'express';
import User from "../models/userModel"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req: Request, res: Response) => {
    try{
        const { username, password } = req.body

        const existingUser = await User.findOne({ username })
        if(existingUser) {
            return res.status(400).json({
                error: `(400) - Usuário já existente`
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            username,
            password: hashPassword,
            role: "admin"
        })

        await newUser.save()
        res.status(201).json(newUser)
    } catch (error) {
        res.status(403).json({
            error: `(500) - Erro ao criar usuário`
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try{
        const { username, password } = req.body 

        // verifica se o cliente existe
        const user = await User.findOne({ username })
        if (!user) {
            res.status(401).json({
                message: `(401) - Falha no login! Credenciais inválidas`
            })
        }

        // verifica se a senha está correta
        const confirmPassword = await bcrypt.compare(password, user.password)
        if (!confirmPassword) {
            res.status(401).json({
                message: `(401) - Falha no login! Credenciais inválidas`
            })
        }

        const token = jwt.sign(
            { userId: user._id, username: user.user, role: user.role},
            process.env.JWT_SECRET || "secret",
            { expiresIn: '1d' } // Token expira em 7 dias
        )

        res.status(200).json({
            token,
            user: {
                userId: user._id, 
                username: user.user, 
                role: user.role
            }
        })

    } catch (error) {
        res.status(403).json({
            message: `(500) - Falha no login`
        })
    }
}

export const verifyToken = async (req: Request, res: Response) => {
    res.json({ valid: true, user: req.body.user })
}