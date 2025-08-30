import { Edit2Icon, TrashIcon } from "lucide-react";
import { Container } from "../../components/Container";
import { Title } from "../../components/Title";
import { MainTemplate } from "../../templates/MainTemplate";

import styles from "./Produtos.module.css"

export function Produtos() {
    const produtos = [
        { produto: "Brigadeiro", preco: 1.99, categoria: "Docinho", unidade: "UN" },
        { produto: "Beijinho", preco: 1.99, categoria: "Docinho", unidade: "UN" },
        { produto: "Coxinha", preco: 4.50, categoria: "Salgado", unidade: "UN" },
        { produto: "Quibe", preco: 4.00, categoria: "Salgado", unidade: "UN" },
        { produto: "Bolo Chocolate", preco: 25.00, categoria: "Bolo", unidade: "KG" },
        { produto: "Bolo Cenoura", preco: 22.00, categoria: "Bolo", unidade: "KG" },
        { produto: "Torta de Limão", preco: 30.00, categoria: "Torta", unidade: "UN" },
        { produto: "Mousse Chocolate", preco: 35.00, categoria: "Sobremesa", unidade: "KG" },
        { produto: "Pão de Mel", preco: 5.00, categoria: "Docinho", unidade: "UN" },
        { produto: "Empada Frango", preco: 6.00, categoria: "Salgado", unidade: "UN" },
    ];

    const allProducts = (products : object[]) => {
        return products.map((p, i) => {
            return <tr key={i}>{tdProduct(p)}</tr>
        })
    }
    
    const tdProduct = (product : object) => {
        // let toCategory = 0;

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
            <td>
                <div className={styles.actions}>
                    <a className={styles.editIcon} href=""><Edit2Icon /></a>
                    <a className={styles.deleteIcon} href=""><TrashIcon /></a>
                </div>
            </td>
        )

        return valuesList
    }

    return(
       <MainTemplate>
            <Container>
                <div className={styles.header}>
                    <Title title="Produtos" subtitle="Gerenciamento de dados dos produtos"/>
                    <button>Adicionar Produto</button>
                </div>

                <div className={styles.productTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>Produto</th>
                                <th>Preço</th>
                                <th>Categoria</th>
                                <th>Unidade</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allProducts(produtos)}
                        </tbody>
                    </table>
                </div>
            </Container>
       </MainTemplate>
    )
}