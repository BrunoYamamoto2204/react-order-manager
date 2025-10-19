import { useState } from "react";
import styles from "../../pages/Pedidos/Pedidos.module.css"
import { Edit2Icon, InfoIcon, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router";
import type { Order } from "../../services/ordersApi"

type OrderListProps = {
    ordersList: Order[],
    removeOrders: (filteredOrder: Order)  => void
}

// Junta a lista de produtos em 1 <ul> (pronto para inserir dentro de <td>)
const OrderProducts = ({ productsStrings }: { productsStrings: string[] }) => {

    const [showAll, setShowAll] = useState(false);
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

export function OrdersList({ ordersList, removeOrders } : OrderListProps) {
    const navigate = useNavigate();

    const status = (status : string) => {
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

    return (
        <>
            {ordersList.map((order) => {
                return( 
                    <tr key={order._id}>
                        {/* Name */}
                        <td>
                            {order.name}
                        </td>

                        {/* Date */}
                        <td>
                            {order.date}
                        </td>

                        {/* Products */}
                        <td>
                            <OrderProducts productsStrings={order.productsStrings} />
                        </td>

                        {/* Value */}
                        <td>
                            {order.value}
                        </td>

                        {/* Status */}
                        <td className={`${styles.status} ${status(order.status)}`}>
                            {order.status} <InfoIcon />
                        </td>

                        {/* Actions */}
                        <td key="actions"> 
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
                        </td>

                    </tr>
                )
            })}
        </>
    )
}
    