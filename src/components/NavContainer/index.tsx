import { CakeIcon, ChartNoAxesCombinedIcon, HouseIcon, ScrollText, User2Icon } from "lucide-react";
import { NavButton } from "../NavButton";

import styles from "./NavContainer.module.css"

export function NavContainer() {
    return (
        <div className={styles.navContainer}>
            <div className={styles.titleContainer}>
                <h1>Comanda App</h1>
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
            </nav>
        </div>
    )
}