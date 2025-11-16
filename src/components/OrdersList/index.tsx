import { useEffect, useState } from "react";
import styles from "../../pages/Pedidos/Pedidos.module.css"
import { BikeIcon } from "lucide-react";
import { getOrders, updateOrder, type Order } from "../../services/ordersApi"
import { StatusSelectList } from "../StatusSelectList/indes";
import { getCustomerById, updateCustomer } from "../../services/customersApi";

type OrderListProps = {
    ordersList: Order[],
    handleClickOrder: (order: Order) => void
    setOrders: (newOrder: Order[]) => void
    // removeOrders: (filteredOrder: Order)  => void
}

// Junta a lista de produtos em 1 <ul> (pronto para inserir dentro de <td>)
const OrderProducts = ({ productsStrings }: { productsStrings: string[] }) => {

    const [ showAll, setShowAll ] = useState(false);
    const list = showAll ? productsStrings : productsStrings.slice(0,3)
    const showButton = showAll ? "Ver menos..." : "Ver mais..."

    // A lista de produtos
    const formatList = list.map((p, i) => {
        return <li key={i} className={styles.liList}>{p}</li>
    })

    // Botão de Ver Mais/Ver Menos 
    if (productsStrings.length > 3){
        formatList.push(
            <li key="show" className={styles.seeMore}>
                <button onClick={() => setShowAll(!showAll)}>{showButton}</button>
            </li>
        )
    }
    
    return (
        <ul>{formatList}</ul>
    )
}

export function OrdersList({ ordersList, handleClickOrder, setOrders } : OrderListProps) {
    const [ list, setList ] = useState<Order[]>()

    useEffect(() => {
        setList([ ...ordersList ])
    }, [ordersList])

    const statusStyle = (status : string) => {
        if (status === "Pendente"){
            return styles.pending
        } 
        else if (status === "Concluído"){
            return styles.completed
        }
        else{
            return styles.canceled
        }
    }

    const changeStatus = async (order: Order, status: string, customerId: string) => { 
         if (!order._id) {
            console.error("Pedido sem _id");
            return;
        }

        // Realiza a atualização de status no pedido [NO MONGO DB]
        const updatedOrder = { ...order, status };
        await updateOrder(order._id, updatedOrder); 

        // Realiza a atualização de status no pedido [NA LISTA LOCAL]
        const updatedList = list?.map(o => 
            o._id === order._id ? updatedOrder : o
        ) || []

        setOrders(updatedList)
        setList(updatedList);  

        // Atualiza o noPending do cliente, se houver cadastro
        if (customerId) {
            const hasOtherPendingOrders = updatedList.some(o => 
                o.customerId === customerId &&
                o.status === "Pendente" 
            )

            const stillPending = status === "Pendente" || hasOtherPendingOrders;

            const customer = await getCustomerById(customerId) 
            await updateCustomer(customerId, {
                ...customer,
                pendingOrders: stillPending
            })
        }
    }

    const deliveryInf = (isDelivery: boolean) => {
        if (isDelivery) {
            return (
                <td
                    style={{gap:"1rem", color:"var(--primary-light)"}}
                >
                    <BikeIcon/> Entrega
                </td>
            )
        } else {
            return <td>N/A</td>
        }
    }

    return (
        <>
            {list?.map((order) => {
                return( 
                    <tr key={order._id}>
                        {/* Name */}
                        <td>
                            {order.name}
                        </td>

                        {/* Date */}
                        <td>
                            <span style={{fontWeight: "bold", color:"var(--primary)"}}>
                                {order.time}
                            </span> 
                            &nbsp; -&nbsp;
                            {order.date}
                        </td>

                        {/* Products */}
                        <td>
                            <OrderProducts productsStrings={order.productsStrings} />
                        </td>

                        {/* Delivery */}
                        {deliveryInf(order.isDelivery)}
                       
                        {/* Value */}
                        <td>
                            {order.value}
                        </td>

                        {/* Status */}
                        <td className={`${styles.status} ${statusStyle(order.status)}`}>
                            <StatusSelectList 
                                customerId={order.customerId ? order.customerId : ""}
                                status={order.status}
                                changeStatus={changeStatus}
                                order={order}
                            />
                        </td>

                        {/* Actions */}
                        <td className={styles.seeOrder}>
                            <p onClick={() => handleClickOrder(order)}>Ver Pedido</p>
                        </td>
                        {/* <td key="actions"> 
                            <div className={styles.actions}>
                                <button 
                                    onClick={() => navigate(`/pedidos/editar/${order._id}`)}
                                    className={styles.editIcon}>
                                    <Edit2Icon />
                                </button>
                                <button 
                                    onClick={() => removeOrders(order)}
                                    className={styles.deleteIcon}>
                                    <TrashIcon />
                                </button>
                            </div>
                        </td> */}
                    </tr>
                )
            })}
        </>
    )
}
    