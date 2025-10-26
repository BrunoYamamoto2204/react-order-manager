import { ChevronDownIcon, InfoIcon } from "lucide-react"
import type { Order } from "../../services/ordersApi"
import styles from "./StatusSelectList.module.css"
import { useEffect, useRef, useState } from "react"

type StatusSelectListProps ={
    customerId: string
    status: string,
    changeStatus: (order: Order, newStatus: string, customerId: string) => void
    order: Order
}

export function StatusSelectList({ 
    customerId,
    status,
    changeStatus,
    order
}: StatusSelectListProps) {
    const [ isOpen, setIsOpen ] = useState(false);
    const statusRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const checkStatusClick = (event: MouseEvent) => {
            if(
                statusRef.current &&
                !statusRef.current.contains(event.target as Node) 
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", checkStatusClick)
    }, [])

    const handleStatusChange = (newStatus: string) => {
        changeStatus(order, newStatus, customerId);
        setIsOpen(false); 
    };

    const getIconClass = (statusType: string) => {
        if (statusType === "Pendente") return styles.pendingIcon;
        if (statusType === "Concluído") return styles.completedIcon;
        return styles.canceledIcon;
    };

    const statusButton = () => {
        if (status === "Pendente") {
            return (
                <>
                    <button
                        onClick={() => handleStatusChange("Concluído")}
                        className={styles.options}
                    >
                        Concluído <InfoIcon style={{ color: "var(--primary)" }} />
                    </button><button
                        onClick={() => handleStatusChange("Cancelado")}
                        className={styles.options}
                    >
                        Cancelado <InfoIcon style={{ color: "var(--error)" }} />
                    </button>
                </>
            )
        } 

        else if (status === "Concluído") {
            return (
                <>
                    <button 
                        onClick={() => handleStatusChange("Pendente")}
                        className={styles.options}    
                    >
                        Pendente <InfoIcon style={{color:"var(--warning)"}}/>
                    </button>
                    <button
                        onClick={() => handleStatusChange("Cancelado")}
                        className={styles.options}
                    >
                        Cancelado <InfoIcon style={{ color: "var(--error)" }} />
                    </button>
                </>
            )
        } 

        else {
            return (
                <>
                    <button 
                        onClick={() => handleStatusChange("Concluído")}
                        className={styles.options}  
                    >
                        Concluído <InfoIcon style={{color:"var(--primary)"}} />
                    </button>
                    <button 
                        onClick={() => handleStatusChange("Pendente")}
                        className={styles.options}    
                    >
                        Pendente <InfoIcon style={{color:"var(--warning)"}}/>
                    </button>
                </>
            )
        }
    }

    return (
        <div className={styles.statusSelectContainer} ref={statusRef}>
            <button onClick={() => setIsOpen(!isOpen)}>
                <ChevronDownIcon 
                    className={isOpen ? styles.turnArrowUp : styles.turnArrowDown}
                /> 
                {status} 
                <InfoIcon className={getIconClass(status)} />
            </button>
            
            
            <div className={`${styles.statusOptions} ${isOpen ? styles.isOpen : ""}`}>
                {statusButton()}
            </div>
        </div>
    )
}