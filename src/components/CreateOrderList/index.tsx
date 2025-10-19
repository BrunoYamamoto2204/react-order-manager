import { TrashIcon } from "lucide-react"
import styles from "../../pages/Pedidos/CreatePedido.module.css"

type CreateOrderListProps = {
    orderList : Product[]
    changeQuantity : (newQuantity : number, productName: string) => void
    removeProduct: (listItem: Product) => void
}

type Product = {
    id: number,
    product: string;
    price: string;
    quantity: number;
    unit: string
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
                                    changeQuantity(validateQuantity, order.product)
                                }}
                                value={order.quantity}
                                type="number"
                            />
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
