import { useLocation, useNavigate } from "react-router";
import styles from "./NavButton.module.css"
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

type NavButtonProps = {
    icon: React.ReactNode;
    sectionName: string;
} & React.ComponentProps<"button">

export function NavButton({ icon, sectionName } : NavButtonProps) {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [ confirmLogout, setConfirmLogout ] = useState(false)

    const { logout } = useAuth();

    // Formata a URL 
    const currentSection = sectionName === "home" ? "/" : `/${sectionName}`

    // Define se está o componente está ativo 
    const isActive = pathname === currentSection;
    const activeButton = isActive ? styles.buttonActive : "";

    const handleClick = () => {
        navigate(currentSection);
    }

    const handleLogout = () => {
        logout(); 
        navigate("/login"); 
    }

    function firstUpperCase(name: string){
        return name.charAt(0).toUpperCase() + name.slice(1)
    }

    if (sectionName === "sair"){
        return (
            <div className={styles.navButtonContainer} >
                {confirmLogout && (
                    <div className={styles.confirmDeleteBox}>
                        <div className={styles.confirmDelete}>
                            <h3>{`Sair da Sessão`}</h3>
                            <label style={{color:"var(--gray-300)"}}>
                                {`Deseja mesmo sair desta conta?`}
                            </label>

                            <div className={styles.confirmDeleteButtons}>
                                <button
                                    className={`${styles.button} ${styles.confirmButton}`}
                                    onClick={handleLogout}
                                >
                                    Sair
                                </button>

                                <button
                                    className={`${styles.button} ${styles.cancelButton}`}
                                    onClick={() => setConfirmLogout(false)}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>                
                )}

                <button
                    className={`${styles.navButton} ${activeButton}`}
                    onClick={() => setConfirmLogout(true)}
                >
                    {icon}
                    <span>{firstUpperCase(sectionName)}</span>
                </button>
            </div>
        )
    }

    return (
        <div className={styles.navButtonContainer}>
            <button
                className={`${styles.navButton} ${activeButton}`}
                onClick={handleClick}
            >
                {icon}
                <span>{firstUpperCase(sectionName)}</span>
            </button>
        </div>
    )
}