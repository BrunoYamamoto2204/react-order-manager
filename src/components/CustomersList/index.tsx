import { CheckLineIcon, CircleXIcon, Edit2Icon, TrashIcon } from "lucide-react"
import styles from "../../pages/Clientes/Clientes.module.css"

type Customer = {
    id: number,
    name: string,
    phone: string,
    email: string,
    pendingOrders: boolean,
}

type CustomersListProps = {
    customersList: Customer[]
    removeCustomer: (filteredCustomer: Customer) => void
}

export function CustomersList({ customersList, removeCustomer } : CustomersListProps) {
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
                                <button className={styles.editIcon}><Edit2Icon /></button>
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

    // Contruir cada cliente (<td>)
    const buildCustomer = (customer : object) => {
        const valuesList = Object.entries(customer).map(([k, v]) => {
            if (k === "pedidosPendentes") {
                if (v > 0) {
                    return <td className={styles.pendingOrders} key={k}><CheckLineIcon/></td>
                }
                else return <td className={styles.noPendingOrders} key={k}><CircleXIcon/></td>
            }
            else  return <td key={k}>{v}</td>
        })
        
        valuesList.push(
            <td key="actions">
                <div className={styles.actions}>
                    <a className={styles.editIcon} href=""><Edit2Icon /></a>
                    <a className={styles.deleteIcon} href=""><TrashIcon /></a>
                </div>
            </td>
        )

        return valuesList
    }

    // Colocar todos os clientes em <tr>
    const buildAllCustomer = (customers : object) => {
        return Object.entries(customers).map(([k, v]) => {
            return <tr key={k}>{buildCustomer(v)}</tr>
        })
    }
    
    return buildAllCustomer(customersList)
}