import { CheckLineIcon, CircleXIcon } from "lucide-react"
import styles from "../../pages/Clientes/Clientes.module.css"
import { type Customer } from "../../services/customersApi"
import { getOrders } from "../../services/ordersApi"
import { useEffect, useState } from "react"

type MediaQueryCustomerListProps = {
    customersList: Customer[]
    handleClickCustomer: (customer: Customer) => void
    pageNumber: number
    pagesList: (page: number) => Customer[] 
}

export function MediaQueryCustomerList({ 
    customersList, 
    handleClickCustomer,
    pageNumber,
    pagesList
} : MediaQueryCustomerListProps) {

    const [ pendingByCustomer, setPendingByCustomer ] = useState<Record<string, number>>({})
    const [ concluedByCustomer, setConcluedByCustomer ] = useState<Record<string, number>>({})

    useEffect(() => {
        const loadPendingOrders = async () => {
            const orders = await getOrders()

            const customerMap = customersList.reduce((acc, customer) => {
                acc[customer._id!] = customer
                return acc
            }, {} as Record<string, Customer>)

            const pendingOrders: Record<string, number> = {}
            const concluedOrders: Record<string, number> = {}

            orders.forEach(order => {
                const customerId = order.customerId
                if (!customerId) return

                const customer = customerMap[customerId] 
                if (!customer) return

                if (order.status === "Pendente") {
                    pendingOrders[customerId] =  (pendingOrders[customerId] || 0) + 1
                } else {
                    concluedOrders[customerId] = (concluedOrders[customerId] || 0) + 1
                }
            })

            setPendingByCustomer(pendingOrders)
            setConcluedByCustomer(concluedOrders)
        }

        loadPendingOrders()
    },[customersList])
    

    return (
        <>
            {pagesList(pageNumber)?.map((customer, index) => {
                
                const pendingQuantity = pendingByCustomer[customer._id!] 
                const concluedQuantity = concluedByCustomer[customer._id!]

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
                                <div className={styles.pendingOrders}>
                                    <p>{pendingQuantity} Pedido(s) Pendente(s)</p>
                                    <CircleXIcon/>
                                </div>
                            ) : (
                                <div className={styles.noPendingOrders}>
                                    <p>{concluedQuantity} Pedido(s) Totais(s)</p>
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