const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`
const API_KEY = import.meta.env.VITE_API_KEY

export const login = async (user: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method:"POST",
        headers: {
            "Content-Type": "application/json",
            'x-api-key': API_KEY
        },
        body: JSON.stringify({ user, password })
    })

    if(!response.ok) throw new Error("Erro ao realizar login:")

    return await response.json()
}

export const loginMfa = async (userId: number, code: string) => {
    const mfaResponse = await fetch(`${API_URL}/auth/mfa`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'x-api-key': API_KEY
        },
        body: JSON.stringify({ 
            userId: userId,
            code: code
        })
    })

    const data = await mfaResponse.json()

    if(!mfaResponse.ok) throw new Error(data.message)

    // token no localhost é utilizado pelo context provider para validar se o usuário já realizou login no navegador há menos de 7 dias
    
    localStorage.setItem("token", data.token)

    // Retorna o user, para validar ao acessar as rotas, se está logado
    return data.user
}

export const createSecret = async (userId: number, gerarNovamente? : boolean) => {
    const response = await fetch(`${API_URL}/auth/secret`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'x-api-key': API_KEY
        },
        body: JSON.stringify({
            userId: userId,
            gerarNovamente: gerarNovamente
        })
    })

    const data = await response.json()

    if (!response.ok) throw new Error(data.message)

    return data
}

export const confirmUserSecret = async (userId: number, code: string) => {
    const reponse = await fetch(`${API_URL}/auth/confirmSecret`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": API_KEY
        },
        body: JSON.stringify({
            userId: userId,
            code: code
        })
    })

    const data = await reponse.json()

    if (!reponse.ok) return new Error(data.message)
}

export const logout = () => {
    localStorage.removeItem("token")
}

export const getToken = () => {
    return localStorage.getItem("token")
}

export const isAuthenticated = () => {
    return !!getToken()
}