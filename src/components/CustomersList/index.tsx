import { CheckLineIcon, CircleXIcon, Edit2Icon, TrashIcon } from "lucide-react"
import styles from "../../pages/Clientes/Clientes.module.css"
import { useNavigate } from "react-router"

type Customer = {
    id: number,
    name: string,
    cpfCnpj: string,
    phone: string,
    email: string,
    pendingOrders: boolean,
    road?: string,
    num?: string,
    neighborhood?: string, 
    city?: string,
    state?: string,
    cep?: string,
    obs: string
}

type CustomersListProps = {
    customersList: Customer[]
    removeCustomer: (filteredCustomer: Customer) => void
}

export function CustomersList({ customersList, removeCustomer } : CustomersListProps) {
    const navigate = useNavigate()
    
    return (
        <>
            {customersList.map((customer, index) => {
                return (
                    <tr key={`${customer.name}_${index}`}>
                        {/* Name */}
                        <td>
                            {customer.name}
                        </td>

                        {/* Phone */}
                        <td>
                            {customer.phone}
                        </td>

                        {/* E-mail */}
                        <td>
                            {customer.email}
                        </td>

                        {/* Completed orders */}
                        {customer.pendingOrders 
                            ? <td className={styles.pendingOrders}><CheckLineIcon/></td> 
                            : <td className={styles.noPendingOrders}><CircleXIcon/></td>
                        }

                        {/* Ações  */}
                        <td key="actions">
                            <div className={styles.actions}>
                                <button 
                                    onClick={() => navigate(`/clientes/editar/${customer.id}`)}
                                    className={styles.editIcon}>
                                    <Edit2Icon />
                                </button>
                                <button 
                                    className={styles.deleteIcon}
                                    onClick={() => removeCustomer(customer)}>
                                    <TrashIcon />
                                </button>
                            </div>
                        </td>
                    </tr>
                )
            })}
        </>
    )
}