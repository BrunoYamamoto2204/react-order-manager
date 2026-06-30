import { Request, Response } from 'express';
import User from "../models/userModel"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import speakeasy from "speakeasy"
import qrcode from "qrcode"

// Permite a estensão do Request, permitindo usar req.user 
interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        username: string;
        role: string;
    };
}

const createToken = (selectedUser: any) => {
    // cria o token do login
    if (!process.env.JWT_SECRET){
        throw new Error("JWT_SECRET não definido nas variáveis de ambiente")
    }

    return jwt.sign(
        { userId: selectedUser._id, username: selectedUser.user, role: selectedUser.role},
        process.env.JWT_SECRET, 
        { expiresIn: '7d' } // Token expira em 7 dias
    )
}

export const register = async (req: Request, res: Response) => {
    try{
        const { username, password } = req.body

        const existingUser = await User.findOne({ user: username })
        if(existingUser) {
            return res.status(400).json({
                error: `(400) - Usuário já existente`
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            user: username,
            password: hashPassword,
            role: "admin"
        })

        await newUser.save()
        return res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json({
            error: `(500) - Erro ao criar usuário: ${error}`
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try{
        const { user, password } = req.body 

        // ------------------- 1a Etapa - Login e Senha ------------------- //
        // verifica se o cliente existe
        const selectedUser = await User.findOne({ user })
        if (!selectedUser) {
            return res.status(401).json({
                message: `(401) - Falha no login! Credenciais inválidas`
            })
        }

        // verifica se a senha está correta
        const confirmPassword = await bcrypt.compare(password, selectedUser.password)
        if (!confirmPassword) {
            return res.status(401).json({
                message: `(401) - Falha no login! Credenciais inválidas`
            })
        }
        
        // Validação se o secret está configurado para utilizar o MFA
        if (!selectedUser.mfaEnabled) {
            return res.status(403).json({ message: "MFA não configurado para este usuário" })
        }

        // ------------------- 2a Etapa - MFA ------------------- //
        // Permite que o usuário continue a autenticação
        return res.status(200).json({
            mfaEnabled: true,
            userId: selectedUser._id
        })
    } catch (error) {
        return res.status(500).json({
            message: `(500) - Falha no login: ${error}`
        })
    }
}

export const createSecret = async (req: Request, res: Response) => {
    try{
        const formattedReq = req as AuthenticatedRequest
        const userId = formattedReq.user?.userId

        const selectedUser = await User.findById(userId)
        if (!selectedUser){
            return res.status(404).json({ message: "Usuário não encontrado" })
        }

        // Cria o secret e gera o QRcode
        const secret = speakeasy.generateSecret({ name: "ComandaApp" })
        const qrCodeImage = await qrcode.toDataURL(secret.otpauth_url!)

        selectedUser.mfaSecret = secret.base32
        await selectedUser.save()

        res.status(200).json({ qrCode: qrCodeImage, secret: secret })
    } 
    catch (error) {
        return res.status(500).json({ message: `{Erro ao configurar MFA: ${error}` })
    }
}

// Realiza o 1a login com MFA. Define o secret como válido e salva o usuário com a permissão para utilizar MFA 
export const confirmUserSecret = async (req: Request, res: Response) => {
    try{
        const { code } = req.body
        const formattedReq = req as AuthenticatedRequest
        const userId = formattedReq.user?.userId

        const selectedUser = await User.findById(userId)
        if (!selectedUser){
            return res.status(404).json({ message: "Usuário não encontrado" })
        }

        // Verifica se já há um secret para o usuário
        if (!selectedUser.mfaSecret) {
            return res.status(404).json({ message: "Não foi configurado secret para este usuário" })
        }

        // Verifica se o secret é válido
        const isValid = speakeasy.totp.verify({
            secret: selectedUser.mfaSecret!,
            encoding: "base32",
            token: code
        })
        if (!isValid) {
            return res.status(401).json({ message: "Secret inválido ou expirado" })
        }

        // Caso o secret exista e seja válido, permitir a utilização de MFA
        selectedUser.mfaEnabled = true
        await selectedUser.save()

        res.status(200).json({ message: "MFA foi ativado com sucesso" })
    } catch(error){
        return res.status(500).json({ message: `Erro ao confirmar MFA: Ausência de secret ou secret inválido`})
    }
}

export const loginWithMfa = async (req: Request, res: Response) => {
    try {
        const { userId, code } = req.body

        const selectedUser = await User.findById(userId)
        if (!selectedUser){
            return res.status(404).json({ message: "Usuário não encontrado" })
        }

        // Verifica se o secret é válido
        const isValid = speakeasy.totp.verify({
            secret: selectedUser.mfaSecret,
            encoding: "base32",
            token: code
        })
        if (!isValid) {
            return res.status(401).json({ message: "Secret inválido ou expirado" })
        }

        return res.status(200).json({
            token: createToken(selectedUser)
        }) 
    }
    catch(error) {
        return res.status(500).json({ message: "Falha na verificação do MFA" })
    }
}

export const verifyUser = async (req: Request, res: Response) => {
    const formattedReq = req as AuthenticatedRequest

    if (!formattedReq.user) {
        return res.status(401).send()
    }
    
    return res.status(200).send()
}