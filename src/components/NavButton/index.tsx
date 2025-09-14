import { useLocation, useNavigate } from "react-router";
import styles from "./NavButton.module.css"

type NavButtonProps = {
    icon: React.ReactNode;
    sectionName: string;
} & React.ComponentProps<"button">

export function NavButton({ icon, sectionName } : NavButtonProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const homeSection = sectionName === "Home" ? "/" : `/${sectionName}`

    const isActive = location.pathname === homeSection;
    const activeButton = isActive ? styles.buttonActive : "";

    const handleClick = () => {
        const section = sectionName === "Home" ? "/" : `/${sectionName}`;
        navigate(section);
    }

    return (
        <div className={styles.navButtonContainer}>
            <button
                className={`${styles.navButton} ${activeButton}`}
                onClick={handleClick}
            >
                {icon}
                <span>{sectionName}</span>
            </button>
        </div>
    )
}