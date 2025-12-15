import { CheckLineIcon, CircleXIcon } from "lucide-react"
import styles from "../../pages/Clientes/Clientes.module.css"
import { type Customer } from "../../services/customersApi"
import { useEffect, useState } from "react"
import { getOrders } from "../../services/ordersApi"

type CustomersListProps = {
    customersList: Customer[]
    handleClickCustomer: (customer: Customer) => void
}

export function CustomersList({ customersList, handleClickCustomer } : CustomersListProps) {
    
    const [ pendingByCustomer, setPendingByCustomer ] = useState<Record<string, number>>({})
    const [ concluedByCustomer, setConcluedByCustomer ] = useState<Record<string, number>>({})
    

    useEffect(() => {
        const loadPendingOrders = async () => {
            const orders = await getOrders()

            // Registro da quantidade de pedidos de cada um dos clientes 
            const pendingOrders: Record<string, number> = {}
            const concluedOrders: Record<string, number> = {}

            orders.forEach(order => {
                const customerId = order.customerId
                if (!customerId) return

                // const customer = customerMap[customerID!]

                if (order.status === "Pendente") {
                    pendingOrders[customerId!] = (pendingOrders[customerId] || 0) + 1
                } else {
                    concluedOrders[customerId!] = (concluedOrders[customerId] || 0) + 1
                }
            })

            setPendingByCustomer(pendingOrders)
            setConcluedByCustomer(concluedOrders)
        }

        loadPendingOrders()
    },[])

    return (
        <>
            {customersList.map((customer, index) => {

                const pendingQuantity = pendingByCustomer[customer._id!]
                const concluedQuantity = concluedByCustomer[customer._id!]

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
                            ? (
                                <td className={styles.pendingOrders}>
                                    <CircleXIcon/> {`${pendingQuantity} Pendentes`}
                                </td>
                            ) : (
                                <td className={styles.noPendingOrders}>
                                    <CheckLineIcon/> {`${concluedQuantity || 0} Pedidos Totais`}
                                </td> 
                            )
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