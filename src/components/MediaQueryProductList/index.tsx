
import styles from "../../pages/Produtos/Produtos.module.css"
import type { Product } from "../../services/productsApi";

type MediaQueryProductListProps = {
    productsList: Product[]
    handleClickproduct: (product: Product) => void
    
}

export function MediaQueryProductList({ productsList, handleClickproduct } : MediaQueryProductListProps) {   
    return (
        <>
            {productsList.map((product, index) => {
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