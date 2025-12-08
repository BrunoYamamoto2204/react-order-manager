import { getToken, isAuthenticated, logout as logoutFunction } from "../services/authApi"
import { Messages } from "../components/Messages"
import { useEffect, useState, type ReactNode } from "react"
import { AuthContext } from "./AuthContext"

type User = {
    id: string
    username: string
    role: string
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [ user, setUser ] = useState<User | null>(null)
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated()) {
                try {
                    const getUser = localStorage.getItem("user")
                    if(getUser) {
                        setUser(JSON.parse(getUser))
                    }

                    const response = await fetch(
                        `${import.meta.env.VITE_API_URL}/api/auth/verify`, 
                        {
                            headers: {
                                "x-api-key": import.meta.env.VITE_API_KEY,
                                "Authorization": `Bearer ${getToken()}`
                            }
                        }
                    )

                    if(!response.ok) {
                        logout()
                        Messages.info("Sua sessão expirou!")
                    }
                } catch(error) {
                    console.error("Erro ao verificar autenticação: ", error)
                }
            }
            setIsLoading(false)
        }

        // Verifica se há token para pular o login 
        checkAuth()
    },[])

    const logout = () => {
        logoutFunction()
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, isLoading, logout, setUser}}>
            {children}
        </AuthContext.Provider>
    )
}
