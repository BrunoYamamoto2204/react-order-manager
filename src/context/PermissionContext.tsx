import { createContext } from "react"

type PermissionsContextProps = {
    permissions: Record<string, boolean>
    permissionsLoaded: boolean
}

export const PermissionsContext = createContext<PermissionsContextProps | undefined>(undefined)