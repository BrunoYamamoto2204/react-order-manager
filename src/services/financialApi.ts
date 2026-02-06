import { getToken } from "./authApi";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`
const API_KEY = import.meta.env.VITE_API_KEY

export type Financial = {
    _id?: string,
    date: string,
    description: string,
    category: string,
    account: string,
    value: number,
    createdAt?: Date,
    updatedAt?: Date
}

const getHeaders = () => ({
    "Content-Type": "application/json",
    'x-api-key': API_KEY,
    'Authorization': `Bearer ${getToken()}`
})

export async function getIncomesExpenses(): Promise<Financial[]> {
    const response = await fetch(`${API_URL}/financial`, {
        headers: getHeaders()
    })
    if (!response.ok) throw new Error("[-] Erro ao buscar contas")
    return response.json()
}

export async function getIncomeExpenseById(id: string): Promise<Financial> {
    const response = await fetch(`${API_URL}/financial/${id}`, {
        headers: getHeaders()
    })
    if (!response.ok) throw new Error(`[-] Erro ao buscar conta: ${id}`)
    return response.json() 
}

export async function createIncomeExpense(incomeExpense: Financial): Promise<Financial> {
    const response = await fetch(`${API_URL}/financial`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(incomeExpense)
    })
    if (!response.ok) throw new Error(`[-] Erro ao criar conta`)
    return response.json()
}

export async function updateIncomeExpense(
    id: string, incomeExpense: Financial
): Promise<Financial> {
    const response = await fetch(`${API_URL}/financial/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(incomeExpense),
    })
    if (!response.ok) throw new Error(`[-] Erro ao editar conta: ${id}`)
    return response.json()
}

export async function deleteIncomeExpense(id: string): Promise<Financial> {
    const response = await fetch(`${API_URL}/financial/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    })
    if (!response.ok) throw new Error(`[-] Erro ao excluir conta: ${id}`)
    return response.json()
}