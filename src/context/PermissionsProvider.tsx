import { useEffect, useState, type ReactNode } from "react"
import { PermissionsContext } from "./PermissionContext"
import { checkPermissionAsync } from "../services/permissionApi"
import { useAuth } from "../hooks/useAuth"

const MODULES = ["orders", "products", "customers", "analytics", "financial"]

export function PermissionsProvider({ children }: { children: ReactNode }) {
    const { user, readPemissions } = useAuth()

    const [ permissions, setPermissions ] = useState<Record<string, boolean>>({})
    const [ permissionsLoaded, setPermissionsLoaded ] = useState(false)

    useEffect(() => {
        if (!user) return

        let ignore = false

        const checkPermissions = async () => {
            const results = await Promise.all(
                MODULES.map(m => checkPermissionAsync({ role: user.role, module: m, permission: "read" }))
            )

            if (ignore) return

            setPermissions(Object.fromEntries(MODULES.map((m, i) => [m, results[i]])))
            setPermissionsLoaded(true)
        }

        checkPermissions()

        return () => { ignore = true }
    }, [user, readPemissions])

    return (
        <PermissionsContext.Provider value={{ permissions, permissionsLoaded }}>
            {children}
        </PermissionsContext.Provider>
    )
}