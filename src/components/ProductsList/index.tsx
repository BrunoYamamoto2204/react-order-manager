import { Edit2Icon, TrashIcon } from "lucide-react"
import styles from "../../pages/Produtos/Produtos.module.css"

type Product = {
    id: number,
    product: string
    price: number
    category: string
    unity: string
}

type ProductsListProps = {
    productsList: Product[]
    deleteProduct: (product: Product) => void
}

export function ProductsList({ productsList, deleteProduct } : ProductsListProps) {
    return (
        <>
            {productsList.map((order, index) => {
                return (
                    <tr key={`${order.product}_${index}`}>
                        {/* Name */}
                        <td>
                            {order.product}
                        </td>

                        {/* Price */}
                        <td>
                            R$ {order.price.toFixed(2).replace(".",",")}
                        </td>

                        {/* Category */}
                        <td>
                            <span className={styles.category}>{order.category}</span>
                        </td>

                        {/* Unity */}
                        <td>
                            {order.unity}
                        </td>

                        {/* Actions */}
                        <td key="actions"> 
                            <div className={styles.actions}>
                                <button className={styles.editIcon}><Edit2Icon /></button>
                                <button 
                                    onClick={() => deleteProduct(order)}
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