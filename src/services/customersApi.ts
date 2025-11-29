import { getToken } from "./authApi"

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`
const API_KEY = import.meta.env.VITE_API_KEY

export type Customer = {
    _id?: string,
    name: string,
    cpfCnpj: string,
    phone: string,
    email: string,
    pendingOrders: boolean,
    road?: string,
    num?: string,
    neighborhood?: string, 
    city?: string,
    state?: string,
    cep?: string,
    obs: string
}

const getHeaders = () => ({
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
    "Authorization": `Bearer ${getToken()}`
})

export async function getCustomers(): Promise<Customer[]> {
    const response = await fetch(`${API_URL}/customers`, {
        headers: getHeaders()
    })
    if (!response.ok) throw new Error("Erro ao buscar clientes")
    return response.json()
}

export async function getCustomerById(id: string): Promise<Customer>{
    const response = await fetch(`${API_URL}/customers/${id}`, {
        headers: getHeaders()
    })
    if (!response.ok) throw new Error(`Erro ao buscar cliente ${id}`)
    return response.json()
}

export async function createCustomer(customer: Customer): Promise<Customer> {
    const response = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(customer)
    })

    if(!response.ok) throw new Error("Erro ao criar cliente") 
    return response.json()
}

export async function updateCustomer(id: string, customer: Customer): Promise<Customer>{
    const response = await fetch(`${API_URL}/customers/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(customer)
    })

    if(!response.ok) throw new Error(`Erro ao atualizar cliente ${id}}`)
    return response.json()
}

export async function deleteCustomer(id: string) {
    const response = await fetch(`${API_URL}/customers/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    })

    if(!response.ok) throw new Error(`Erro ao excluir cliente ${id}`)
    return response.json()
}