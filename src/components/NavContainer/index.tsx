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
                    sectionName="Home" 
                />
                <NavButton 
                    icon={<ScrollText/>} 
                    sectionName="Pedidos" 
                />
                <NavButton 
                    icon={<CakeIcon />} 
                    sectionName="Produtos" 
                />
                <NavButton 
                    icon={<User2Icon />} 
                    sectionName="Clientes" 
                />
                <NavButton 
                    icon={<ChartNoAxesCombinedIcon />} 
                    sectionName="Analises" 
                />
            </nav>
        </div>
    )
}