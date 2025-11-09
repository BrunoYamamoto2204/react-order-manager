import styles from "./AnalysisProductTable.module.css"

type AnalysisProductTableProps = {
    handleShowProducts: (open: boolean) => void
    products: object[]
}

export function AnalisysProductTable({ handleShowProducts, products } : AnalysisProductTableProps) {
    return (
        <div className={styles.productTable}>
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
                                    return <td key={k}>R$ {v.toFixed(2).replace(".",",")}</td>
                                } else {
                                    return <td key={k}>{v}</td>
                                }
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <button 
                className={styles.backButton}
                onClick={() => handleShowProducts(false)}
            >
                Voltar
            </button>
        </div>
    )
}

