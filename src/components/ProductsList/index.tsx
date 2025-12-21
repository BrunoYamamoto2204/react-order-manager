import styles from "../../pages/Produtos/Produtos.module.css"
import type { Product } from "../../services/productsApi";

type ProductsListProps = {
    handleClickproduct: (product: Product) => void,
    pageNumber: number,
    pagesList: (page: number) => Product[]
}

export function ProductsList({ 
    handleClickproduct,
    pageNumber,
    pagesList
} : ProductsListProps) {   
    return (
        <>
            {pagesList(pageNumber).map((product, index) => {
                return (
                    <tr key={`${product.product}_${index}`}>
                        {/* Name */}
                        <td>
                            {product.product}
                        </td>

                        {/* Price */}
                        <td>
                            R$ {product.price.toFixed(2).replace(".",",")}
                        </td>

                        {/* Category */}
                        <td>
                            <span className={styles.category}>{product.category}</span>
                        </td>

                        {/* Unity */}
                        <td>
                            {product.unit}
                        </td>

                        {/* Actions */}
                        <td className={styles.seeProduct}>
                            <p onClick={() => handleClickproduct(product)}>Ver Produto</p>
                        </td>
                    </tr>
                )
            })}
        </>
    )
}