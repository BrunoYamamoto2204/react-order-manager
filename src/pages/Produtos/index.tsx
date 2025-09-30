import { Container } from "../../components/Container";
import { Title } from "../../components/Title";
import { MainTemplate } from "../../templates/MainTemplate";

import styles from "./Produtos.module.css"
import { ProductsList } from "../../components/ProductsList";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function Produtos() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Produtos - Comanda"
    },[])

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

    return(
       <MainTemplate>
            <Container>
                <div className={styles.header}>
                    <Title title="Produtos" subtitle="Gerenciamento de dados dos produtos"/>
                    <button onClick={() => navigate("/produtos/criar")}>
                        Adicionar Produto
                    </button>
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
                            <ProductsList productsList={produtos}/>
                        </tbody>
                    </table>
                </div>
            </Container>
       </MainTemplate>
    )
}