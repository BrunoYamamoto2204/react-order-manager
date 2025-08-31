import { useState } from "react";
import styles from "../../pages/Pedidos/Pedidos.module.css"

type ProductListProps = {
    orders: object[]
}

export function OrdersList({ orders } : ProductListProps) {
    const [showAll, setShowAll] = useState(false);
    
    // Junta a lista de produtos em 1 <ul> (pronto para inserir dentro de <td>)
    const orderProducts = (products : string[]) =>{
        const list = showAll ? products : products.slice(0,4)
        const showButton = showAll ? "Ver menos..." : "Ver mais..."

        const formatList = list.map((p, i) => {
            return <li key={i} className={styles.liList}>{p}</li>
        })

        if (products.length > 4){
            formatList.push(
                <li className={styles.seeMore}>
                    <button onClick={() => setShowAll(!showAll)}>{showButton}</button>
                </li>
            )
        }
        
        return (
            <ul>{formatList}</ul>
        )
    }
    
    // Transforma todas as chaves em <td>
    const buildOrder = (order : object) => {
        const tdOrder = Object.entries(order).map(([k, v]) => {
            // Produtos: toda a lista <ul> em um td
            if (k !== "produtos") {
                return <td>{v}</td>
            } else{
                return <td>{orderProducts(v)}</td>
            }
        })

        return tdOrder
    }

    // Junta todos os grupos de <td> de cada pedido em um <tr>
    const buildAllOrders = ( orderList : object[]) => {
        return orderList.map((p, i) => {
            return <tr key={i}>{buildOrder(p)}</tr>
        })
    }

    return buildAllOrders(orders)
}
    