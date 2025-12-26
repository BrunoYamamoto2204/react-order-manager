import { useEffect, useState } from "react";
import styles from "./AnalysisProductTable.module.css"
import type { AnalysisProductList } from "../../pages/Analises";
import { ChevronUpIcon, SearchIcon } from "lucide-react";

type AnalysisProductTableProps = {
    handleShowProducts: (open: boolean) => void
    products: AnalysisProductList[]
}

export function AnalisysProductTable({ handleShowProducts, products } : AnalysisProductTableProps) {
    const [ isMobile, setIsMobile ] = useState(false);

    const [ filteredProducts, setFilteredProducts ] = useState<AnalysisProductList[]>(products);

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

    const handleChange = (input: string) => {
        if (input && input.trim() === "") {
            setFilteredProducts(products)
        }

        const normalizeText = (text: string) => (
            text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        )

        const filteredList = products.filter(product => (
            normalizeText(product.productName.toLowerCase())
                .includes(normalizeText(input).toLowerCase())
        ))

        setFilteredProducts(filteredList) 
    }
    
    if(isMobile){
        return(
            <>
                <div className={styles.overlay}></div>
                <div className={styles.productTable}>
                    <div id="summary" className={styles.buttonbox}>
                        <h2>Resumo de Produtos</h2>
                        <button
                            className={styles.backButton}
                            onClick={() => handleShowProducts(false)}
                        >
                            Voltar
                        </button>
                    </div>

                    <div className={styles.searchProduct}>
                        <SearchIcon className={styles.searchIcon} />
                        <input
                            onChange={e => handleChange(e.target.value)}
                        />
                    </div>

                    <>
                        {filteredProducts.length !== 0 ?
                            (filteredProducts.map((product, index) => {
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
                                                <p>
                                                    {unitFormat(product.totalQuantity)} 
                                                </p>
                                            </div>
                                        </div>

                                        {index < products.length - 1 ? <hr /> : ""}
                                    </div>
                                )
                            })) : (
                                <div className={styles.noProducts}>
                                    <p>Sem produtos disponíveis</p>
                                </div>
                            )
                        }
                    </>
                </div>

                <a 
                    href="#summary"
                    className={styles.backToHeaderButton}
                >
                        <ChevronUpIcon />
                </a>
            </>
        )
    }
    
    return (
        <>
            <div className={styles.overlay}></div>
            <div className={styles.productTable}>
                <div className={styles.buttonbox}>
                    <div className={styles.title}>
                        <h2>Resumo de Produtos</h2>
                        <label>Total de produtos: {products.length}</label>
                    </div>
                    <button
                        className={styles.backButton}
                        onClick={() => handleShowProducts(false)}
                    >
                        Voltar
                    </button>
                </div>

                <div className={styles.searchProduct}>
                    <SearchIcon className={styles.searchIcon} />
                    <input
                        onChange={e => handleChange(e.target.value)}
                    />
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
                        {filteredProducts.length !== 0 ? 
                            (filteredProducts.map(p => (
                                <tr>
                                    {Object.entries(p).map(([k, v]) => {
                                        if (k === "totalValue") {
                                            return <td key={k}>R$ {Number(v).toFixed(2).replace(".",",")}</td>
                                        } else {
                                            return <td key={k}>{v}</td>
                                        }
                                    })}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className={styles.noProducts}>
                                    <p>Sem Produtos disponíveis</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

