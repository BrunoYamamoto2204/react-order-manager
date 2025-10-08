import { Edit2Icon, TrashIcon } from "lucide-react"
import styles from "../../pages/Produtos/Produtos.module.css"
import { useNavigate } from "react-router"

type Product = {
    id: number,
    product: string
    price: number
    category: string
    unit: string,
    description: string
}

type ProductsListProps = {
    productsList: Product[]
    deleteProduct: (product: Product) => void
}

export function ProductsList({ productsList, deleteProduct } : ProductsListProps) {
    const navigate = useNavigate()
    
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
                            {order.unit}
                        </td>

                        {/* Actions */}
                        <td key="actions"> 
                            <div className={styles.actions}>
                                <button 
                                    onClick={() => navigate(`/produtos/editar/${order.id}`)}
                                    className={styles.editIcon}>
                                    <Edit2Icon />
                                </button>
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