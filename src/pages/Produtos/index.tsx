import { Container } from "../../components/Container";
import { Title } from "../../components/Title";
import { MainTemplate } from "../../templates/MainTemplate";

import styles from "./Produtos.module.css"
import { ProductsList } from "../../components/ProductsList";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PlusIcon, SearchIcon } from "lucide-react";
import { Messages } from "../../components/Messages";
import { deleteProduct, getProducts } from "../../services/productsApi";
import type { Product } from "../../services/productsApi";

export function Produtos() {
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(true);
    const [ products, setProducts ] = useState<Product[]>([])

    useEffect(() => {
        document.title = "Produtos - Comanda"
        loadProducts()
    },[])

    const loadProducts = async () => {
        try{
            setLoading(true)
            const data = await getProducts()
            setProducts(data)
        } catch(error){
            console.log("Erro ao carregar os produtos:", error)
            Messages.error("Erro ao carregar os produtos")
        } finally {
            setLoading(false)
        }
    } 

    const removeOrder = async (filteredProduct: Product) => {
        try{
            if (!filteredProduct._id) {
                console.log("❌ Produto sem _id:", filteredProduct);
                return 
            }
            await deleteProduct(filteredProduct._id)

            Messages.success("Produto excluído com sucesso")
        } catch(error) {
            console.log("Erro ao excluir os produtos:", error)
            Messages.error("Erro ao excluir os produtos")
        }

        setProducts(products.filter(product => product._id !== filteredProduct._id))
    }

    const handleChange = async (productName: string) => {
        const currentProducts = await getProducts()

        if (productName && productName.trim() === "") {
            setProducts(currentProducts)
        } else {
            const normalizeText = (text: string) =>(
                text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            )

            const filteredProducts = currentProducts.filter(product => (
                normalizeText(product.product.toLowerCase())
                .includes(normalizeText(productName.toLowerCase()))
            ))

            setProducts(filteredProducts)
        }
    }
    

    if (loading) {
        return (
            <MainTemplate>
                <Container>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        Carregando produtos...
                    </div>
                </Container>
            </MainTemplate>
        );
    }

    return(
       <MainTemplate>
            <Container>
                <div className={styles.header}>
                    <Title title="Produtos" subtitle="Gerenciamento de dados dos produtos"/>
                    <button onClick={() => navigate("/produtos/criar")}>
                        <PlusIcon/> Adicionar Produto
                    </button>
                </div>

                <div className={styles.searchProduct}>
                    <SearchIcon className={styles.searchIcon} />
                    <input 
                        onChange={e => handleChange(e.target.value)}
                        placeholder="Buscar produto"
                    />
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
                            {products.length > 0 ? (
                                <ProductsList 
                                    productsList={products}
                                    deleteProduct = {removeOrder}
                                />
                            ): (
                                <tr>
                                    <td className={styles.noProducts}>
                                        <p>Sem Produtos disponíveis</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Container>
       </MainTemplate>
    )
}