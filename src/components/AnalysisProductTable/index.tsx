import { useEffect, useState } from "react";
import styles from "./AnalysisProductTable.module.css"
import type { AnalysisProductList } from "../../pages/Analises";

type AnalysisProductTableProps = {
    handleShowProducts: (open: boolean) => void
    products: AnalysisProductList[]
}

export function AnalisysProductTable({ handleShowProducts, products } : AnalysisProductTableProps) {
    const [ isMobile, setIsMobile ] = useState(false);

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

    useEffect(() => {
        document.title = "Análises - Comanda"

        // Telas menores de 1050px (Mobile)
        const mediaQueryMobile = window.matchMedia("(max-width: 1050px)")
        setIsMobile(mediaQueryMobile.matches)

        const handleResizeMobile = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches)
        }

        mediaQueryMobile.addEventListener("change", handleResizeMobile)

        return () => {
            mediaQueryMobile.removeEventListener("change", handleResizeMobile)
        }
    },[])
    
    if(isMobile){
        return(
            <>
                <div className={styles.overlay}></div>
                <div className={styles.productTable}>
                    <div className={styles.buttonbox}>
                        <h2>Resumo de Produtos</h2>
                        <button
                            className={styles.backButton}
                            onClick={() => handleShowProducts(false)}
                        >
                            Voltar
                        </button>
                    </div>

                    <>
                        {products.map((product, index) => {
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

                                    {index < products.length - 1 ? <hr /> : ""}
                                </div>
                            )
                        })}
                    </>
                </div>
            </>
        )
    }
    
    return (
        <>
            <div className={styles.overlay}></div>
            <div className={styles.productTable}>
                <div className={styles.buttonbox}>
                    <h2>Resumo de Produtos</h2>
                    <button
                        className={styles.backButton}
                        onClick={() => handleShowProducts(false)}
                    >
                        Voltar
                    </button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Posição</th>
                            <th>Produto</th>
                            <th>Valor</th>
                            <th>Quantidade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr>
                                {Object.entries(p).map(([k, v]) => {
                                    if (k === "totalValue") {
                                        return <td key={k}>R$ {Number(v).toFixed(2).replace(".",",")}</td>
                                    } else {
                                        return <td key={k}>{v}</td>
                                    }
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

