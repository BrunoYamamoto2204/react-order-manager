import { useState } from "react";
import styles from "../../pages/Pedidos/Pedidos.module.css"
import { Edit2Icon, TrashIcon } from "lucide-react";

type Order = {
    id: number,
    name: string,
    date: string,
    products: string[],
    value: string,
    status: string
}

type OrderListProps = {
    ordersList: Order[],
    removeOrders: (filteredOrder: Order)  => void
}

// Junta a lista de produtos em 1 <ul> (pronto para inserir dentro de <td>)
const OrderProducts = ({ products }: { products: string[] }) => {
    const [showAll, setShowAll] = useState(false);

    const list = showAll ? products : products.slice(0,3)
    const showButton = showAll ? "Ver menos..." : "Ver mais..."

    // A lista de produtos
    const formatList = list.map((p, i) => {
        return <li key={i} className={styles.liList}>{p}</li>
    })

    // Botão de Ver Mais/Ver Menos 
    if (products.length > 3){
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
                            <OrderProducts products={order.products} />
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
                                <button className={styles.editIcon}><Edit2Icon /></button>
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

    // Transforma todas as chaves em <td>
    // const buildOrder = (order : object) => {
    //     const tdOrder = Object.entries(order).map(([k, v]) => {
            
    //         if (k === "status"){
    //             if (v === "Pendente"){
    //                 return (
    //                     <td key={`${k}_${v}`}>
    //                         <div className={styles.pending}>
    //                             {v}
    //                             <a href="#"><InfoIcon /></a>
    //                         </div>
    //                     </td>
    //                 )
    //             }
    //             else {
    //                 return (
    //                     <td key={`${k}_${v}`}>
    //                         <div className={styles.completed}>
    //                             {v}
    //                             <a href="#"><InfoIcon /></a>
    //                         </div>
    //                     </td>
    //                 )
    //             }
    //         }
    //         else if (k !== "produtos") {
    //             return <td key={`${k}_${v}`}>{v}</td>
    //         } 
    //         // Produtos: toda a lista <ul> em um td
    //         else{
    //             return <td key={`${k}_${v}`}>{OrderProducts(v)}</td>
    //         }
    //     })

    //     return tdOrder
    // }

    // // Junta todos os grupos de <td> de cada pedido em um <tr>
    // const buildAllOrders = ( orderList : object[]) => {
    //     return orderList.map((p, i) => {
    //         return <tr key={i}>{buildOrder(p)}</tr>
    //     })
    // }

    // return buildAllOrders(orders)
}
    