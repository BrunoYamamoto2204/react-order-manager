import { Container } from "../../components/Container";
import { Title } from "../../components/Title";
import { MainTemplate } from "../../templates/MainTemplate";

import styles from "./Produtos.module.css"
import { ProductsList } from "../../components/ProductsList";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PlusIcon } from "lucide-react";
import { Messages } from "../../components/Messages";

export function Produtos() {
    type Product = {
        id: number,
        product: string
        price: number
        category: string
        unit: string,
        description: string
    }

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Produtos - Comanda"
    },[])

    const initialProducts: Product[] = [
        { id: 1, product: "Brigadeiro", price: 1.99, category: "Docinho", unit: "UN",description: "" },
        { id: 2, product: "Beijinho", price: 1.99, category: "Docinho", unit: "UN",description: "" },
        { id: 3, product: "Coxinha", price: 4.50, category: "Salgado", unit: "UN",description: "" },
        { id: 4, product: "Quibe", price: 4.00, category: "Salgado", unit: "UN",description: "" },
        { id: 5, product: "Bolo Chocolate", price: 25.00, category: "Bolo", unit: "KG",description: "" },
        { id: 6, product: "Bolo Cenoura", price: 22.00, category: "Bolo", unit: "KG",description: "" },
        { id: 7, product: "Torta de Limão", price: 30.00, category: "Torta", unit: "UN",description: "" },
        { id: 8, product: "Mousse Chocolate", price: 35.00, category: "Sobremesa", unit: "KG",description: "" },
        { id: 9, product: "Empada Frango", price: 6.00, category: "Salgado", unit: "UN",description: "" },
    ];

    const getProducts = () => {
        const currentProductsString = localStorage.getItem("products")

        const products = currentProductsString 
            ? JSON.parse(currentProductsString) 
            : localStorage.setItem("products", JSON.stringify(initialProducts))
        
        return products
    }   

    const deleteProduct = (filteredProduct: Product) => {
        const currentProducts = [ ...products ]
        const newProductList = currentProducts.filter(product => 
            filteredProduct.id !== product.id
        )
        
        localStorage.setItem("products", JSON.stringify(newProductList))
        setProducts(newProductList)

        Messages.dismiss()
        Messages.success("Produto excluído com sucesso")
    }

    const [ products, setProducts ] = useState<Product[]>(getProducts())

    return(
       <MainTemplate>
            <Container>
                <div className={styles.header}>
                    <Title title="Produtos" subtitle="Gerenciamento de dados dos produtos"/>
                    <button onClick={() => navigate("/produtos/criar")}>
                        <PlusIcon/> Adicionar Produto
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
                            <ProductsList 
                                productsList={products}
                                deleteProduct = {deleteProduct}
                            />
                        </tbody>
                    </table>
                </div>
            </Container>
       </MainTemplate>
    )
}