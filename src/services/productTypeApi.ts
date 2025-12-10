import { getToken } from "./authApi"

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`
const API_KEY = import.meta.env.VITE_API_KEY

export type ProductType = {
    _id?: string; 
    name: string,
    description?: string
}

const getHeader = () => ({
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    "Authorization": `Bearer ${getToken()}`
})

export const getProductTypes = async (): Promise<ProductType[]> => {
    const response = await fetch(`${API_URL}/productTypes`, {
        headers: getHeader()
    })

    if(!response.ok) throw new Error ("[-] Erro ao buscar os tipos") 
    return response.json()
}

export const getProductTypeById = async (id: string): Promise<ProductType> => {
    const response = await fetch(`${API_URL}/productTypes/${id}`, {
        headers: getHeader()
    })

    if(!response.ok) throw new Error (`[-] Erro ao buscar o tipo [${id}]`) 
    return response.json()
}

export const createProductType = async (content: ProductType): Promise<ProductType> => {
    const response = await fetch(`${API_URL}/productTypes`, {
        method: "POST",
        headers: getHeader(),
        body: JSON.stringify(content)
    })

    if(!response.ok) throw new Error (`[-] Erro ao criar o tipo`) 
    return response.json()
}

export const editProductType = async (id: string, content: ProductType): Promise<ProductType> => {
    const response = await fetch(`${API_URL}/productTypes/${id}`, {
        method: "PUT",
        headers: getHeader(),
        body: JSON.stringify(content)
    })

    if(!response.ok) throw new Error (`[-] Erro ao editar o tipo [${id}]`) 
    return response.json()
}

export const deleteProductType = async (id: string): Promise<ProductType> => {
    const response = await fetch(`${API_URL}/productTypes/${id}`, {
        method: "DELETE",
        headers: getHeader()
    })

    if(!response.ok) throw new Error (`[-] Erro ao deletar o tipo [${id}]`) 
    return response.json()
}

