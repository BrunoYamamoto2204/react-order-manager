import styles from "./AnalysisProductTable.module.css"

type AnalysisProductTableProps = {
    handleShowProducts: (open: boolean) => void
}

export function AnalisysProductTable({ handleShowProducts } : AnalysisProductTableProps) {
    const productList = [
        { posicao: 1, produto: "Brigadeiro", valor: 2543.43, quantidade: 852 },
        { posicao: 2, produto: "Coxinha", valor: 2243.43, quantidade: 772 },
        { posicao: 3, produto: "Risoles", valor: 2032.42, quantidade: 692 },
        { posicao: 4, produto: "Quibe", valor: 1832.12, quantidade: 641 },
        { posicao: 5, produto: "Beijinho", valor: 1621.88, quantidade: 589 }
    ];


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
                    {productList.map(p => (
                        <tr>
                            {Object.entries(p).map(([k, v]) => {
                                return <td key={k}>{v}</td>
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

