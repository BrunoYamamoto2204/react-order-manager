import { CheckLineIcon, CircleXIcon } from "lucide-react"
import styles from "../../pages/Clientes/Clientes.module.css"
import { type Customer } from "../../services/customersApi"

type CustomersListProps = {
    customersList: Customer[]
    handleClickCustomer: (customer: Customer) => void
}

export function CustomersList({ customersList, handleClickCustomer } : CustomersListProps) {
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
                            ? <td className={styles.pendingOrders}><CircleXIcon/></td>
                            : <td className={styles.noPendingOrders}><CheckLineIcon/></td> 
                        }

                        {/* Ações  */}
                        <td className={styles.seeCustomer}>
                            <p onClick={() => handleClickCustomer(customer)}>Ver Cliente</p>
                        </td>
                    </tr>
                )
            })}
        </>
    )
}