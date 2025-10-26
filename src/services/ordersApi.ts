const API_URL = `${import.meta.env.VITE_API_URL}/api`;

type Product = {
  id: number;
  product: string;
  price: string;
  quantity: number;
  unit: string;
}

export type Order = {
    _id?: string; 
    customerId?: string;
    name: string;
    date: string;
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

// GET - Buscar Usuários 
export async function getOrders(): Promise<Order[]> {
    const response = await fetch(`${API_URL}/orders`);
    if (!response.ok) throw new Error("[-] Erro ao buscar os pedidos!");
    return response.json();
}

// GET - Buscar um usuário específico
export async function getOrderById(id: string): Promise<Order> {
    const response = await fetch(`${API_URL}/orders/${id}`);
    if (!response.ok) throw new Error("[-] Erro ao buscar os pedidos!");
    return response.json();
}

// POST - Criar pedido 
export async function createOrder(order: Order): Promise<Order>{
    const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(order)
    })

    if (!response.ok) throw new Error("[-] Erro ao criar pedido!");
    return response.json();
}

// PUT - Atualizar o pedido
export async function updateOrder(id: string, order: Order): Promise<Order> {
    const response = await fetch(`${API_URL}/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(order)
    })

    if (!response.ok) throw new Error("[-] Erro ao atualizar o pedido!");
    return response.json();
}

// DELETE - Exclui o pedido
export async function deleteOrder(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/orders/${id}`, {
        method: "DELETE"
    })

    if(!response.ok) throw new Error("[-] Erro ao deletar o pedido!");
}