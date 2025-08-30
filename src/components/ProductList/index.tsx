import { useState } from "react";
import styles from "./ProductList.module.css"

type ProductListProps = {
    products: string[]
}

export function ProductList({ products } : ProductListProps) {
    const [showAll, setShowAll] = useState(false);
    
    const list = showAll ? products : products.slice(0,4)
    const showButton = showAll ? "Ver menos..." : "Ver mais..."

    const formatList = list.map((p, i) => {
        return <li key={i} className={styles.liList}>{p}</li>
    })

    if (products.length > 4){
        formatList.push(<div className={styles.seeMore}>
            <li><button onClick={() => setShowAll(!showAll)}>{showButton}</button></li>
        </div>)
    }
    
    return (
        <ul>
            {formatList}
        </ul>
    )
    
}
    