import { CheckLineIcon, CircleXIcon, Edit2Icon, TrashIcon } from "lucide-react"
import styles from "../../pages/Clientes/Clientes.module.css"
import { useNavigate } from "react-router"
import { type Customer } from "../../services/customersApi"

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
                            ? <td className={styles.noPendingOrders}><CircleXIcon/></td>
                            : <td className={styles.pendingOrders}><CheckLineIcon/></td> 
                        }

                        {/* Ações  */}
                        <td key="actions">
                            <div className={styles.actions}>
                                <button 
                                    onClick={() => navigate(`/clientes/editar/${customer._id}`)}
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