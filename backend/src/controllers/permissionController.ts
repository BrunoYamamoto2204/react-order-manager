import { Request, Response } from 'express';
import Permission, { PermissionPayload, PermissionsType } from '../models/PermissionModel';

type CheckPermissionType = {
    role: string, 
    module: keyof PermissionsType, 
    permission: string
}

export const getAllPermissions = async (req: Request, res: Response) => {
    try{
        const permissions = await Permission.find()

        res.json({ content: permissions }) 
    } catch (error){
        res.status(500).json({ message: "Não foi possível retornar as permissões" })
    }
} 
 
export const modifyPermission = async (req: Request, res: Response) => {
    try{
        const { role, actions } = req.body as PermissionPayload

        await Permission.findOneAndUpdate(
            { role: role }, 
            { $set: actions },
            { new: true, upsert: true }
        )

        res.status(201).json({ message: "Permissões atualizadas" })
        
    } catch(error){
        res.status(500).json({ message: "Não foi possível atualizar as permissões" })
    }
}

export const checkPermissionAsync = async (req: Request, res: Response) => {
    try {
        const { role , module, permission } = req.body as CheckPermissionType

        const permissions = await Permission.findOne({ role: role })

        if (permissions?.[module] && permissions?.[module].includes(permission))
            res.json({ allowed: true })
        else 
            res.json({ allowed: false })
    } catch(error){
        res.status(500).json({ message: "Não foi possível atualizar as permissões" })
    }
}

export const checkPermission = async ({ role, module, permission } : CheckPermissionType) : Promise<boolean> => {
    const permissions = await Permission.findOne({ role: role })

    if (permissions?.[module] && permissions?.[module].includes(permission))
        return true
    else 
        return false
}


