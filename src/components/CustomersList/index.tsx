import { CheckLineIcon, CircleXIcon, Edit2Icon, TrashIcon } from "lucide-react"
import styles from "../../pages/Clientes/Clientes.module.css"

type CustomersListProps = {
    customersList: object
}

export function CustomersList({ customersList } : CustomersListProps) {
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
            <td>
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