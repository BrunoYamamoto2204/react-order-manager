import { Edit2Icon, TrashIcon } from "lucide-react"
import styles from "../../pages/Produtos/Produtos.module.css"

type ProductsListProps = {
    productsList: object[]
}

export function ProductsList({ productsList } : ProductsListProps) {
    const allProducts = (products : object[]) => {
        return products.map((p, i) => {
            // Futuramente mudar a key p/ o id do produto
            return <tr key={i}>{tdProduct(p)}</tr> 
        })
    }
    
    const tdProduct = (product : object) => {
        const valuesList = Object.entries(product).map(([k, v]) => {
            let displayValue;
            let classCategory;

            if (typeof(v) === "number"){
                displayValue = `R$ ${v.toFixed(2).replace(".",",")}`;
            }
            else if (k === "categoria") {
                classCategory = styles.categoryColumn
                displayValue = <span className={styles.category}>{v}</span>
            }
            else {
                displayValue = v
            }

            return <td key={k} className={classCategory}>{displayValue}</td>
        })

        valuesList.push(
            <td key="actions"> 
                <div className={styles.actions}>
                    <a className={styles.editIcon} href=""><Edit2Icon /></a>
                    <a className={styles.deleteIcon} href=""><TrashIcon /></a>
                </div>
            </td>
        )

        return valuesList
    }

    return (
       allProducts(productsList)
    )
}