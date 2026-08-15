import { CakeIcon, ChartNoAxesCombinedIcon, ClipboardListIcon, DollarSignIcon, HouseIcon, LogOutIcon, MenuIcon, ScrollText, ShieldIcon, User2Icon, XIcon } from "lucide-react";
import { NavButton } from "../NavButton";

import styles from "./NavContainer.module.css"
import { useEffect, useState } from "react";
import { checkPermissionAsync } from "../../services/permissionApi";
import { useAuth } from "../../hooks/useAuth";

export function NavContainer() {
    const { user, readPemissions } = useAuth()

    const [ isMobile, setIsMobile ] = useState(false)
    const [ isMenuOpen, setIsMenuOpen ] = useState(false)

    const [ permissions, setPermissions ] = useState<Record<string, boolean>>({})
    
    useEffect(() => {
        const modules = ["orders", "products", "customers", "analytics", "financial"]
        
        const checkPermissions = async () => {
            // Valida se cada módulo é permitido || [true, false, false, ...]
            const results = await Promise.all(
                modules.map(m => checkPermissionAsync({ role: user?.role!, module: m, permission: "read" }))
            )

            //Atribui o módulo ao valor
            setPermissions(Object.fromEntries(modules.map((m, i) => [m, results[i]])))
        }

        checkPermissions()
    }, [readPemissions])

    useEffect(() => {
        const mediaQueryMobile = window.matchMedia("(max-width: 1050px)")
        setIsMobile(mediaQueryMobile.matches)

        const handleMobile = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches)
        }

        mediaQueryMobile.addEventListener("change", handleMobile)
        
        return () => {
            mediaQueryMobile.removeEventListener("change", handleMobile)
        }
    },[])

    if (isMobile) {
        return(
            <>
                <button
                    className={styles.mobileMenuButton}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <XIcon /> : <MenuIcon />}
                </button>

                {isMenuOpen && (
                    <div 
                        className={styles.overlay}
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}

                <div className={`${styles.mobileNavContainer} ${isMenuOpen ? styles.open : ""}`}>
                    <div className={styles.titleContainer}>
                        <h1><ClipboardListIcon /> Comanda App</h1>
                        <h2>Gerenciador de Pedidos</h2>
                    </div>
                    
                    <nav>
                        <NavButton 
                            icon={<HouseIcon />} 
                            sectionName="home" 

                        />
                        {permissions.orders && (
                            <NavButton 
                                icon={<ScrollText/>} 
                                sectionName="pedidos" 

                            />
                        )}

                        {permissions.products && (
                            <NavButton 
                                icon={<CakeIcon />} 
                                sectionName="produtos" 

                            />
                        )}

                        {permissions.customers && (
                            <NavButton 
                                icon={<User2Icon />} 
                                sectionName="clientes" 
                            />
                        )}

                        {permissions.analytics && (
                            <NavButton 
                                icon={<ChartNoAxesCombinedIcon />} 
                                sectionName="analises"
                            />
                        )}

                        {permissions.financial && (
                            <NavButton 
                                icon={<DollarSignIcon />} 
                                sectionName="financeiro"
                            />
                        )}

                        <NavButton 
                            icon={<ShieldIcon />} 
                            sectionName="permissoes"
                        />
                    </nav>

                    <NavButton 
                        icon={<ShieldIcon />} 
                        sectionName="sair" 
                    />
                </div>
            </>
        )
    }

    return (
        <div className={styles.navContainer}>
            <div className={styles.titleContainer}>
                <h1><ClipboardListIcon /> Comanda App</h1>
                <h2>Gerenciador de Pedidos</h2>
            </div>

            <nav>
                <NavButton 
                    icon={<HouseIcon />} 
                    sectionName="home" 

                />
                {permissions.orders && (
                    <NavButton 
                        icon={<ScrollText/>} 
                        sectionName="pedidos" 

                    />
                )}

                {permissions.products && (
                    <NavButton 
                        icon={<CakeIcon />} 
                        sectionName="produtos" 

                    />
                )}

                {permissions.customers && (
                    <NavButton 
                        icon={<User2Icon />} 
                        sectionName="clientes" 
                    />
                )}

                {permissions.analytics && (
                    <NavButton 
                        icon={<ChartNoAxesCombinedIcon />} 
                        sectionName="analises"
                    />
                )}

                {permissions.financial && (
                    <NavButton 
                        icon={<DollarSignIcon />} 
                        sectionName="financeiro"
                    />
                )}

                <NavButton 
                    icon={<ShieldIcon />} 
                    sectionName="permissoes"
                />
            </nav>

            <NavButton 
                icon={<LogOutIcon />} 
                sectionName="sair"

            />
        </div>
    )
}