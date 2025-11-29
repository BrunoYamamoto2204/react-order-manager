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

    if(!response.ok) throw new Error("Erro ao realizar login")

    const data = await response.json()

    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))

    return data
}

export const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
}

export const getToken = () => {
    return localStorage.getItem("token")
}

export const isAuthenticated = () => {
    return !!getToken()
}