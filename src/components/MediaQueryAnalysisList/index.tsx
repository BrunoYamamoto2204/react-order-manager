import type { AnalysisProductList } from "../../pages/Analises"
import styles from "../../pages/Analises/Analises.module.css"

type MediaQueryAnalysisListProps = {
    productsList: AnalysisProductList[]
}

export function MediaQueryAnalysisList({ productsList } : MediaQueryAnalysisListProps) {
    const valueFormat = (value: number) => `R$ ${value.toFixed(2).replace(".",",")}`
    const unitFormat = (quantityToFormat: string) => {
        const unit = quantityToFormat.split(" ")[1]

        switch(unit){
            case "UN":
                return quantityToFormat.split(" ")[0]
            case "KG":
                return quantityToFormat
            case "g":
                return quantityToFormat
        }
    }
    
    return (
        <>
            {productsList.map((product, index) => {
                return (
                    <div className={styles.productInfo}>
                        <h3 className={styles.productTitle}>
                            <label>{product.position}º</label>
                            {product.productName}
                        </h3>
                        <div className={styles.quantityAndValue}>
                            <div className={styles.quantityAndValueBox}>
                                <label>Valor Total</label>
                                <p>{valueFormat(product.totalValue)} </p>
                            </div>
                            <div className={styles.quantityAndValueBox}>
                                <label>Quantidade Vendida</label>
                                <p style={{textAlign:"end"}}>
                                    {unitFormat(product.totalQuantity)} 
                                </p>
                            </div>
                        </div>

                        {index < productsList.length - 1 ? <hr /> : ""}
                    </div>
                )
            })}
        </>
    )
}
