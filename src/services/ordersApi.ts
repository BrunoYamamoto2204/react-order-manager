import { getToken } from "./authApi";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`
const API_KEY = import.meta.env.VITE_API_KEY

type Product = {
    uniqueId: number
    productId: string;
    product: string;
    price: string;
    quantity: number;
    category: string,
    unit: string;
}

export type Order = {
    localeCompare(b: Order): number;
    _id?: string; 
    customerId?: string | null;
    isDelivery: boolean,
    deliveryAddress?: string,
    deliveryFee?: string,
    name: string;
    noRegister: boolean;
    date: string;
    time: string;
    productsStrings: string[];
    products: Product[];
    value: string;
    discount: string;
    discountValue: string;
    discountType: string;
    totalGross: string;
    obs: string;
    status: string;
}

const getHeaders = () => ({
    "Content-Type": "application/json",
    'x-api-key': API_KEY,
    'Authorization': `Bearer ${getToken()}`
})

// GET - Buscar Usuários 
export async function getOrders(): Promise<Order[]> {
    const response = await fetch(`${API_URL}/orders`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error("[-] Erro ao buscar os pedidos!");
    return response.json();
}

// GET - Buscar um usuário específico
export async function getOrderById(id: string): Promise<Order> {
    const response = await fetch(`${API_URL}/orders/${id}`, {
        headers: getHeaders()
    });
    if (!response.ok) throw new Error("[-] Erro ao buscar os pedidos!");
    return response.json();
}

// POST - Criar pedido 
export async function createOrder(order: Order): Promise<Order>{
    const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(order),
    })

    if (!response.ok) throw new Error("[-] Erro ao criar pedido!");
    return response.json();
}

// PUT - Atualizar o pedido
export async function updateOrder(id: string, order: Order): Promise<Order> {
    const response = await fetch(`${API_URL}/orders/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(order)
    })

    if (!response.ok) throw new Error("[-] Erro ao atualizar o pedido!");
    return response.json();
}

// DELETE - Exclui o pedido
export async function deleteOrder(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/orders/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    })

    if(!response.ok) throw new Error("[-] Erro ao deletar o pedido!");
}