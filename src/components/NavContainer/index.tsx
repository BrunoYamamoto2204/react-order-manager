import { CakeIcon, ChartNoAxesCombinedIcon, HouseIcon, ScrollText, User2Icon } from "lucide-react";
import { NavButton } from "../NavButton";
import { useState } from "react";

import styles from "./NavContainer.module.css"

export function NavContainer() {
    const [activeSection, setActiveSection] = useState("Home");

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
                    active={activeSection == "Home"}
                    mudarAtivo={() => setActiveSection("Home")}
                />
                <NavButton 
                    icon={<ScrollText/>} 
                    sectionName="Pedidos" 
                    active={activeSection == "Pedidos"}
                    mudarAtivo={() => setActiveSection("Pedidos")}
                />
                <NavButton 
                    icon={<CakeIcon />} 
                    sectionName="Produtos" 
                    active={activeSection == "Produtos"}
                    mudarAtivo={() => setActiveSection("Produtos")}
                />
                <NavButton 
                    icon={<User2Icon />} 
                    sectionName="Clientes" 
                    active={activeSection == "Clientes"}
                    mudarAtivo={() => setActiveSection("Clientes")}
                />
                <NavButton 
                    icon={<ChartNoAxesCombinedIcon />} 
                    sectionName="Análises" 
                    active={activeSection == "Análises"}
                    mudarAtivo={() => setActiveSection("Análises")}
                />
            </nav>
        </div>
    )
}