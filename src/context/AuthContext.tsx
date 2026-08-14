import { createContext } from "react"

type User = {
    id: string
    username: string
    role: string
}

type AuthContextProps = {
    user: User | null
    isLoading: boolean,
    readPemissions: string[],
    setReadPemissions: (permissions: string[]) => void,
    logout: () => void
    setUser: (user: User | null) => void  
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined)


