import { CakeIcon, ChartNoAxesCombinedIcon, ClipboardListIcon, DollarSignIcon, HouseIcon, LogOutIcon, MenuIcon, ScrollText, ShieldIcon, User2Icon, XIcon } from "lucide-react";
import { NavButton } from "../NavButton";

import styles from "./NavContainer.module.css"
import { useEffect, useState } from "react";

export function NavContainer() {
    const [ isMobile, setIsMobile ] = useState(false)
    const [ isMenuOpen, setIsMenuOpen ] = useState(false)

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
                            allowedRoles={["admin", "user"]}
                        />
                        <NavButton 
                            icon={<ScrollText/>} 
                            sectionName="pedidos"
                            allowedRoles={["admin", "user"]}
                        />
                        <NavButton 
                            icon={<CakeIcon />} 
                            sectionName="produtos" 
                            allowedRoles={["admin", "user"]}
                        />
                        <NavButton 
                            icon={<User2Icon />} 
                            sectionName="clientes"
                            allowedRoles={["admin", "user"]}
                        />
                        <NavButton 
                            icon={<ChartNoAxesCombinedIcon />} 
                            sectionName="analises"
                            allowedRoles={["admin"]}
                        />
                        <NavButton 
                            icon={<DollarSignIcon />} 
                            sectionName="financeiro"
                            allowedRoles={["admin"]}
                        />
                        <NavButton 
                            icon={<DollarSignIcon />} 
                            sectionName="financeiro"
                            allowedRoles={["admin"]}
                        />
                    </nav>

                    <NavButton 
                        icon={<ShieldIcon />} 
                        sectionName="sair" 
                        allowedRoles={["admin", "user"]}
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
                    allowedRoles={["admin", "user"]}
                />
                <NavButton 
                    icon={<ScrollText/>} 
                    sectionName="pedidos" 
                    allowedRoles={["admin", "user"]}
                />
                <NavButton 
                    icon={<CakeIcon />} 
                    sectionName="produtos" 
                    allowedRoles={["admin", "user"]}
                />
                <NavButton 
                    icon={<User2Icon />} 
                    sectionName="clientes" 
                    allowedRoles={["admin", "user"]}
                />
                <NavButton 
                    icon={<ChartNoAxesCombinedIcon />} 
                    sectionName="analises" 
                    allowedRoles={["admin"]}
                />
                <NavButton 
                    icon={<DollarSignIcon />} 
                    sectionName="financeiro" 
                    allowedRoles={["admin"]}
                />
                <NavButton 
                    icon={<ShieldIcon />} 
                    sectionName="permissoes"
                    allowedRoles={["admin", "user"]}
                />
            </nav>

            <NavButton 
                icon={<LogOutIcon />} 
                sectionName="sair" 
                allowedRoles={["admin", "user"]}
            />
        </div>
    )
}