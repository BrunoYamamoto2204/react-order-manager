import type { PemissionResponseType, PermissionsType } from "../pages/Permissoes"
import { getToken } from "./authApi"

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`
const API_KEY = import.meta.env.VITE_API_KEY

export type PermissionPayload = {
    role?: string
    actions: PermissionsType
}

export type CheckPermissionPayload = {
    role: string
    module: string,
    permission: string
}

const getHeaders = () => ({
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    'Authorization': `Bearer ${getToken()}`
})

export async function modifyPermission(content: PermissionPayload) {
    const response = await fetch(`${API_URL}/permisions/modify`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(content)
    })

    const data = await response.json()

    if(!response.ok)
        throw new Error(data.message)

    return data.message
}

export async function getPermissions() : Promise<PemissionResponseType[]>{
    const response = await fetch(`${API_URL}/permisions/get`, {
        method: "GET",
        headers: getHeaders()
    })

    const data = await response.json()

    if(!response.ok) 
        throw new Error(data.message)
    
    return data.content
}

export async function checkPermissionAsync(content: CheckPermissionPayload) {
    const response = await fetch(`${API_URL}/permisions/check`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(content)
    })

    const data = await response.json()

    if (!response.ok)
        throw new Error(data.message)

    return data.allowed
}