const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export type Product = {
    _id?: string,
    product: string
    price: number
    category: string
    unit: string,
    description: string
}

// GET - Produtos
export async function getProducts(): Promise<Product[]>{
    const response = await fetch(`${API_URL}/products`)
    if (!response.ok) throw new Error ("[-] Erro ao buscar produtos")
    return response.json()
}

// GET - Produto Específico 
export async function getProductById(id: string): Promise<Product>{
    const response = await fetch(`${API_URL}/products/${id}`)
    if (!response.ok) throw new Error(`[-] Erro ao buscar produto ${id}`)
    return response.json()
}

// POST - Criar Produto
export async function createProduct(content: Product): Promise<Product> {
    const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(content)
    })

    if(!response.ok) throw new Error("[-] Erro ao criar produto") 
    return response.json()
}

// PUT - Atualizar Produto
export async function updateProduct(id: string, content: Product): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(content)
    })

    if (!response.ok) throw new Error(`[-] Erro ao editar Pedido ${id}`)
    return response.json()
}   

// DELETE - Excluir Produto 
export async function deleteProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE"
    })

    if(!response.ok) throw new Error(`[-] Erro ao excluir pedido ${id}`)
    return response.json()
}