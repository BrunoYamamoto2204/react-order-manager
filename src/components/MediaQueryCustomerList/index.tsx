import { CheckLineIcon, CircleXIcon } from "lucide-react"
import styles from "../../pages/Clientes/Clientes.module.css"
import { type Customer } from "../../services/customersApi"
// import { getOrders } from "../../services/ordersApi"
// import { useState } from "react"

type MediaQueryCustomerListProps = {
    customersList: Customer[]
    handleClickCustomer: (customer: Customer) => void
}

export function MediaQueryCustomerList({ 
    customersList, 
    handleClickCustomer 
} : MediaQueryCustomerListProps) {

    // const [ pendingQuantity, setPendingQuantity ] = useState(0)

    // const loadPendingOrders = async (customerId: string) => {
    //     const orders = await getOrders()
        
    //     setPendingQuantity(orders.reduce((total, order) => {
    //         if (order.customerId === customerId) total += 1 
    //         return total
    //     }, 0))
    // }

    return (
        <>
            {customersList.map((customer, index) => {
                
                // loadPendingOrders(customer._id!)

                return (
                    <div key={`${customer.name}_${index}`} className={styles.mobileCustomerBox}>
                        {/* Nome, Número, E-mail */}
                        <div className={styles.mobileCustomerHeader}>
                            <div className={styles.mobileCustomerInfo}>
                                <p>{customer.name}</p>
                                <label>
                                    {customer.phone}
                                </label>
                                <label>
                                    {customer.email}
                                </label>
                            </div>

                            <div className={styles.seeCustomer}>
                                <p onClick={() => handleClickCustomer(customer)}>Ver Cliente</p>
                            </div>
                        </div>

                        <hr />

                        {customer.pendingOrders 
                            ? (
                                <div className={styles.noPendingOrders}>
                                    <p>Pedido(s) Pendente(s)</p>
                                    <CircleXIcon/>
                                </div>
                            ) : (
                                <div className={styles.pendingOrders}>
                                    <p>Pedido(s) Concluído(s)</p>
                                    <CheckLineIcon/>
                                </div> 
                            )
                        }   
                    </div>
                )
            })}
        </>
    )
}