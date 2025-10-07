import { useState } from "react";
import styles from "../../pages/Pedidos/Pedidos.module.css"
import { Edit2Icon, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router";

type Product = {
    id: number;
    product: string;
    price: string;
    quantity: number;
}

type Order = {
    id: number,
    name: string,
    date: string,
    productsStrings: string[],
    products: Product[],
    value: string,
    discount: string,
    discountValue: string,
    discountType: string,
    totalGross: string,
    obs: string,
    status: string
}

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

    return (
        <>
            {ordersList.map((order) => {
                return( 
                    <tr key={order.id}>
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
                        <td>
                            {order.status}
                        </td>

                        {/* Actions */}
                        <td key="actions"> 
                            <div className={styles.actions}>
                                <button 
                                    onClick={() => navigate(`/pedidos/editar/${order.id}`)}
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
    