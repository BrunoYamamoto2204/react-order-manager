import { TrashIcon } from "lucide-react"
import styles from "../../pages/Pedidos/CreatePedido.module.css"
import type { OrderProduct } from "../../pages/Pedidos/createPedido"


type CreateOrderListProps = {
    orderList : OrderProduct[]
    changeQuantity : (newQuantity : number, productId: string) => void
    removeProduct: (listItem: OrderProduct) => void
}



export function CreateOrderList({ orderList, changeQuantity, removeProduct} : CreateOrderListProps) {
    return (
        <>
            {orderList.map((order, index) => {
                const total = order.quantity * Number(order.price)

                return (
                    <tr key={`${order.product}_${index}`}>
                        {/* Product Name */}
                        <td className={styles.itemTopLine}>
                            {order.product}
                        </td>

                        {/* Product Price */}
                        <td className={styles.itemTopLine}>
                            <input
                                onChange={e => {
                                    const newQuantity = e.target.value
                                    const validateQuantity = Math.max(0, Number(newQuantity))
                                    changeQuantity(validateQuantity, order.uniqueId.toString())
                                }}
                                value={order.quantity}
                                type="number"
                            />
                        </td>

                        {/* Product Unit */}
                        <td className={styles.itemTopLine}>
                            {order.unit}
                        </td>

                        {/* Product Quantity */}
                        <td className={styles.itemTopLine}>
                            R$ {order.price}
                        </td>

                        {/* Total Value */}
                        <td className={styles.itemTopLine} >
                            R$ {total.toFixed(2)}
                        </td>
                        
                        {/* Delete Product */}
                        <td 
                            className={`${styles.icon} ${styles.itemTopLine}`}
                            onClick={() => removeProduct(order)}>
                            <TrashIcon />
                        </td>
                    </tr>
                )
            })}
        </>
    )
}
