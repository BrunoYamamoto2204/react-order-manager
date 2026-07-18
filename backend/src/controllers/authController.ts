import { Request, Response } from 'express';
import User from "../models/userModel"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import speakeasy from "speakeasy"
import qrcode from "qrcode"
import { use } from 'react';

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
        { userId: selectedUser._id, username: selectedUser.user, role: selectedUser.role },
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
        
        // ------------------- 2a Etapa - Indentifica se precisa de configuração do secret ------------------- //
        // Permite que o usuário continue a autenticação
        return res.status(200).json({
            requiresSecret: !selectedUser.mfaEnabled,
            userId: selectedUser._id
        })  
    } catch (error) {
        return res.status(500).json({
            message: `(500) - Falha no login: ${error}`
        })
    }
}

// Valida o código das próximas vezes com o MFA já habilitado
export const loginWithMfa = async (req: Request, res: Response) => {
    try {
        const { userId, code } = req.body

        const selectedUser = await User.findById(userId)

        if (!selectedUser){
            
            return res.status(404).json({ message: "Usuário não encontrado" })
        }

        // Valida a existência do secret antes de realizar login com MFA
        if (!selectedUser.mfaEnabled) {
            return res.status(403).json({ message: "Insira o SECRET no Authenticator e digite código informado" })
        }

        // Com o secret, calcula se o código está valido
        const isValid = speakeasy.totp.verify({
            secret: selectedUser.mfaSecret,
            encoding: "base32",
            token: code
        })
        if (!isValid) {
            return res.status(401).json({ message: "Secret inválido ou expirado" })
        }

        return res.status(200).json({
            token: createToken(selectedUser),
            user: { id: selectedUser._id, user: selectedUser.user, role: selectedUser.role }
        }) 
    }
    catch(error) {
        return res.status(500).json({ message: "Falha na verificação do MFA" })
    }
}

// Gera o secret no primeiro acesso e salva no BD
export const createSecret = async (req: Request, res: Response) => {
    try{
        const { userId, gerarNovamente } = req.body
        let secret

        const selectedUser = await User.findById(userId)
        if (!selectedUser){
            return res.status(404).json({ message: "Usuário não encontrado" })
        }

        if (selectedUser.mfaSecret || gerarNovamente){
            const url = speakeasy.otpauthURL({
                secret: selectedUser.mfaSecret,
                label: `ComandaApp - ${selectedUser.user}`,
                encoding: "base32"
            })

            secret = {
                base32: selectedUser.mfaSecret,
                otpauth_url: url
            }
        } else {
            secret = speakeasy.generateSecret({ name: `ComandaApp - ${selectedUser.user}` })
        }

        // Cria o secret e gera o QRcode
        const qrCodeImage = await qrcode.toDataURL(secret.otpauth_url!)

        // Salva o secret no registor do usuário 
        selectedUser.mfaSecret = secret.base32
        await selectedUser.save()

        res.status(200).json({ 
            qrCode: qrCodeImage, 
            secret: secret.base32
        })
    } 
    catch (error) {
        return res.status(500).json({ message: `Erro ao configurar MFA: ${error}` })
    }
}

// Valida com o secret se o código enviado pela primeira vez é válido, se for, ativa MFA
export const confirmUserSecret = async (req: Request, res: Response) => {
    try{
        const { userId, code } = req.body

        const selectedUser = await User.findById(userId)
        if (!selectedUser){
            return res.status(404).json({ message: "Usuário não encontrado" })
        }

        // Verifica se já há um secret para o usuário
        if (!selectedUser.mfaSecret) {
            return res.status(404).json({ message: "Não foi configurado secret para este usuário" })
        }

       // Com o secret, calcula se o código está valido
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

export const verifyUser = async (req: Request, res: Response) => {
    const formattedReq = req as AuthenticatedRequest

    if (!formattedReq.user) {
        return res.status(401).send()
    }
    
    return res.status(200).send()
}