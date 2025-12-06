import { CheckLineIcon, CircleXIcon } from "lucide-react"
import styles from "../../pages/Clientes/Clientes.module.css"
import {  type Customer } from "../../services/customersApi"
// import { getCustomerById, type Customer } from "../../services/customersApi"
// import { useEffect, useState } from "react"
// import { getOrders } from "../../services/ordersApi"

type MediaQueryCustomerListProps = {
    customersList: Customer[]
    handleClickCustomer: (customer: Customer) => void
}

export function MediaQueryCustomerList({ 
    customersList, 
    handleClickCustomer 
} : MediaQueryCustomerListProps) {

    // const [ pendingByCustomer, setPendingByCustomer ] = useState<Record<string, number>>({})
    // const [ concluedByCustomer, setConcluedByCustomer ] = useState<Record<string, number>>({})

    // useEffect(() => {
    //     const loadPendingOrders = async () => {
    //         const orders = await getOrders()
            
    //         const customerMap = customersList.reduce((acc, customer) => {
    //             acc[customer._id!] = customer
    //             return acc
    //         }, {} as Record<string, Customer>)

    //         const pendingCounts: Record<string, number> = {}
    //         const concluedCounts: Record<string, number> = {}

    //         orders.forEach(order => {
                
    //         })
    //     }

    //     loadPendingOrders()
    // },[])
    

    return (
        <>
            {customersList.map((customer, index) => {
                
                // const pendingQuantity = pendingByCustomer[customer._id!] 

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
                                    <p> Pedido(s) Pendente(s)</p>
                                    <CircleXIcon/>
                                </div>
                            ) : (
                                <div className={styles.pendingOrders}>
                                    <p> Pedido(s) Concluído(s)</p>
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