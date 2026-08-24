import { ArchiveIcon, BanknoteIcon, CakeIcon, ChartNoAxesCombinedIcon, ClipboardListIcon, DollarSignIcon, HouseIcon, MenuIcon, ScrollText, ShieldIcon, ShoppingCartIcon, User2Icon, Users2, XIcon } from "lucide-react";
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
    const [ permissionsLoaded, setPermissionsLoaded ] = useState(false)
    
    useEffect(() => {
        const modules = ["orders", "products", "customers", "analytics", "financial"]
        
        const checkPermissions = async () => {
             await new Promise(resolve => setTimeout(resolve, 2000))
            // Valida se cada módulo é permitido || [true, false, false, ...]
            const results = await Promise.all(
                modules.map(m => checkPermissionAsync({ role: user?.role!, module: m, permission: "read" }))
            )

            //Atribui o módulo ao valor
            setPermissions(Object.fromEntries(modules.map((m, i) => [m, results[i]])))
            setPermissionsLoaded(true)
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

    function NavSkeleton({ count = 4 }: { count?: number }) {
        return (
            <>
                {Array.from({ length: count }).map((_, i) => (
                    <div key={i} className={styles.skeletonButton} />
                ))}
            </>
        )
    }

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
                    
                   {permissionsLoaded && (   
                        <>
                            <nav>
                                <NavButton key="home" icon={<HouseIcon />} sectionName="home" />
                                {permissions.orders && (
                                    <NavButton key="pedidos" icon={<ScrollText/>} sectionName="pedidos" />
                                )} 
                                {permissions.products && (
                                    <NavButton key="produtos" icon={<CakeIcon />} sectionName="produtos" />
                                )} 
                                {permissions.customers && (
                                    <NavButton key="clientes" icon={<User2Icon />} sectionName="clientes" />
                                )} 
                                {permissions.analytics && (
                                    <NavButton key="analises" icon={<ChartNoAxesCombinedIcon />} sectionName="analises" />
                                )} 
                                {permissions.financial && (
                                    <NavButton key="financeiro" icon={<DollarSignIcon />} sectionName="financeiro" />
                                )} 
                                <NavButton key="permissoes" icon={<ShieldIcon />} sectionName="permissoes" />
                            </nav>
                            
                            <NavButton 
                                icon={<ShieldIcon />} 
                                sectionName="sair" 
                            />
                        </>
                    )}
                </div>
            </>
        )
    }

    return (
        <div className={styles.navContainer}>
            <div className={styles.titleContainer}>
                <h1>Comanda App</h1>
                <h2>Gerenciador de Pedidos</h2>
            </div>
            <nav>
                <NavButton key="home" icon={<HouseIcon />} sectionName="home" />
                
                {permissionsLoaded ? (  
                    <>
                        {permissions.orders && (
                            <NavButton key="pedidos" icon={<ShoppingCartIcon/>} sectionName="pedidos" />
                        )} 
                        {permissions.products && (
                            <NavButton key="produtos" icon={<ArchiveIcon />} sectionName="produtos" />
                        )} 
                        {permissions.customers && (
                            <NavButton key="clientes" icon={<Users2 />} sectionName="clientes" />
                        )} 
                        {permissions.analytics && (
                            <NavButton key="analises" icon={<ChartNoAxesCombinedIcon />} sectionName="analises" />
                        )} 
                        {permissions.financial && (
                            <NavButton key="financeiro" icon={<BanknoteIcon />} sectionName="financeiro" />
                        )} 
                    </>
                ) : (
                    <NavSkeleton />
                )}

                <NavButton key="permissoes" icon={<ShieldIcon />} sectionName="permissoes" />
            </nav>

            <NavButton 
                icon={<User2Icon />} 
                sectionName="conta"
            />
        </div>
    )
}