import { useContext } from "react"
import { PermissionsContext } from "../context/PermissionContext"

export function usePermissions() {
    const context = useContext(PermissionsContext)
    
    if (!context) 
        throw new Error("usePermissions deve ser usado dentro de um PermissionsProvider")

    return context
}