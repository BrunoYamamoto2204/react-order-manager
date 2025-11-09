type analysisListProps = {
    productsList: object[]
}

export function AnalysisList({ productsList } : analysisListProps) {
    const allProducts = (products : object[]) => {
        return products.map((p, i) => {
            return <tr key={i}>{tdProduct(p)}</tr>
        })
    }

    // Passa todos os <td> para o <tr>
    const tdProduct = (product : object) => {
        return Object.entries(product).map(([k, v]) => { 
            if (k === "totalValue") return <td key={k}>R$ {v.toFixed(2).replace(".",",")}</td>
            else return <td key={k}>{v}</td>
        })
    }

    return (
        allProducts(productsList)
    )
}
