import { useEffect } from "react"
import styles from "./DeleteConfirm.module.css"

type DeleteConfirmProps<T> = {
    name: string
    setOpenConfirm: (isOpen: boolean) => void
    removeRegister: (register: T) => void
    register: T,
    setShowRegister: (isOpen: boolean) => void
}

export function DeleteConfirm<T>({ 
    name,
    setOpenConfirm, 
    removeRegister,
    register,
    setShowRegister
}: DeleteConfirmProps<T>) {
    useEffect(() => {
        const mainElement = document.querySelector("main")
        if(mainElement) {
            mainElement.scrollTo({ top: 0, behavior: "smooth" });
        }
    },[])

    const handleConfirm = () => {
        removeRegister(register)
        setOpenConfirm(false)

        if (setShowRegister !== setOpenConfirm) {
            setShowRegister(false)
        }
    }

    return (
        <>
            <div 
                className={styles.overlay}
            />
            <div className={styles.confirmDeleteBox}>
                <div className={styles.confirmDelete}>
                    <h3>{`Excluir ${name}`}</h3>
                    <label style={{color:"var(--gray-300)"}}>
                        {`Deseja mesmo excluir permanentemente este ${name}?`}
                    </label>

                    <div className={styles.confirmDeleteButtons}>
                        <button
                            className={`${styles.button} ${styles.confirmButton}`}
                            onClick={handleConfirm}
                        >
                            Sim desejo Excluir
                        </button>

                        <button
                            className={`${styles.button} ${styles.cancelButton}`}
                            onClick={() => setOpenConfirm(false)}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}