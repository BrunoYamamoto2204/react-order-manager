
import styles from "../../pages/Produtos/Produtos.module.css"
import type { Product } from "../../services/productsApi";

type MediaQueryProductListProps = {
    handleClickproduct: (product: Product) => void
    pageNumber: number
    pagesList: (page: number) => Product[] 
}

export function MediaQueryProductList({ 
    handleClickproduct,
    pageNumber,
    pagesList
} : MediaQueryProductListProps) {   
    return (
        <>
            {pagesList(pageNumber)?.map((product, index) => {
                return (
                    <div key={`${product.product}_${index}`} className={styles.mobileOrderBox}>
                        <div className={styles.mobileProductHeader}>
                            <div className={styles.mobileNameProduct}>
                                <p>{product.product}</p>
                                <label>
                                    R$ {product.price.toFixed(2).replace(".",",")} / {product.unit}
                                </label>
                            </div>
                            <div>
                                <span className={styles.category}>{product.category}</span>
                            </div>
                        </div>

                        <div className={styles.seeProduct}>
                            <p onClick={() => handleClickproduct(product)}>Ver Produto</p>
                        </div>
                    </div>
                )
            })}
        </>
    )
}