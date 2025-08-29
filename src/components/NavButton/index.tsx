import styles from "./NavButton.module.css"

type NavButtonProps = {
    icon: React.ReactNode;
    sectionName: string;
    active?: boolean;
    mudarAtivo: () => void;
} & React.ComponentProps<"button">

export function NavButton({ icon, sectionName, active, mudarAtivo } : NavButtonProps) {
    const activeButton = active ? styles.buttonActive : "";

    return (
        <div className={styles.navButtonContainer}>
            <button className={`${styles.navButton} ${activeButton}`} onClick={mudarAtivo}>
                {icon}
                <span>{sectionName}</span>
            </button>
        </div>
    )
}