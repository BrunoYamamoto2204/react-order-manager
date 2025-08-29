import { useState } from "react";
import { Container } from "../../components/Container";
import { MainTemplate } from "../../templates/MainTemplate";

import styles from "./Pedidos.module.css"

export function Pedidos() {
    const [showAll, setShowAll] = useState(false);

    const product1 = [
        "1Kg Bolo",
        "30 Brigadeiros",
        "40 Coxinhas",
        "20 Esfihas",
        "1 Torta Doce",
        "1Kg Mousse",
        "30 Brigadeiros",
        "40 Risoles Carne"
    ];
    const product2 = [
        "1Kg Torta",
        "30 Dois Amores",
        "20 Esfihas",
        "1 Torta Doce",
    ];
    const product3 = [
        "1Kg Mousse",
        "30 Brigadeiros",
        "40 Risoles Carne",
    ];

    const productList = (products : string[]) => {
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
        
        return <ul>{formatList}</ul>
    }

    return (
        <MainTemplate>
            <Container>
                <div className={styles.titles}>
                    <h1>Pedidos</h1>
                    <h2>Confira o histórico de pedidos</h2>
                </div>

                <div className={styles.orderTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Data</th>
                                <th>Produtos</th>
                                <th>Valor</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            <tr>
                                <td>Cliente 1</td>
                                <td>31/08/2025</td>
                                <td>
                                    {productList(product1)}
                                </td>
                                <td>R$ 399,59</td>
                                <td>Pendente</td>
                            </tr>
                            <tr>
                                <td>Cliente 2</td>
                                <td>30/08/2025</td>
                                <td>
                                    {productList(product2)}
                                </td>
                                <td>R$ 299,59</td>
                                <td>Pendente</td>
                            </tr>
                            <tr>
                                <td>Cliente 3</td>
                                <td>29/08/2025</td>
                                <td>
                                    {product3.map((p, i) =>
                                        <li key={i}> {p}</li>
                                    )}
                                </td>
                                <td>R$ 199,59</td>
                                <td>Pendente</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Container>
        </MainTemplate>
    )
}