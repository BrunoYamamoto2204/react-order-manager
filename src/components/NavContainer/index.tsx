import { CakeIcon, ChartNoAxesCombinedIcon, ClipboardListIcon, DollarSignIcon, HouseIcon, LogOutIcon, MenuIcon, ScrollText, User2Icon, XIcon } from "lucide-react";
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
                        />
                        <NavButton 
                            icon={<ScrollText/>} 
                            sectionName="pedidos" 
                        />
                        <NavButton 
                            icon={<CakeIcon />} 
                            sectionName="produtos" 
                        />
                        <NavButton 
                            icon={<User2Icon />} 
                            sectionName="clientes" 
                        />
                        <NavButton 
                            icon={<ChartNoAxesCombinedIcon />} 
                            sectionName="analises" 
                        />
                        <NavButton 
                            icon={<DollarSignIcon />} 
                            sectionName="financeiro" 
                        />
                    </nav>

                    <NavButton 
                        icon={<LogOutIcon />} 
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
                <NavButton 
                    icon={<ScrollText/>} 
                    sectionName="pedidos" 
                />
                <NavButton 
                    icon={<CakeIcon />} 
                    sectionName="produtos" 
                />
                <NavButton 
                    icon={<User2Icon />} 
                    sectionName="clientes" 
                />
                <NavButton 
                    icon={<ChartNoAxesCombinedIcon />} 
                    sectionName="analises" 
                />
                <NavButton 
                    icon={<DollarSignIcon />} 
                    sectionName="financeiro" 
                />
            </nav>

            <NavButton 
                icon={<LogOutIcon />} 
                sectionName="sair" 
            />
        </div>
    )
}