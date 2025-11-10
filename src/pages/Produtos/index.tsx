import { Container } from "../../components/Container";
import { Title } from "../../components/Title";
import { MainTemplate } from "../../templates/MainTemplate";

import styles from "./Produtos.module.css"
import { ProductsList } from "../../components/ProductsList";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronDownIcon, PlusIcon, SearchIcon } from "lucide-react";
import { Messages } from "../../components/Messages";
import { deleteProduct, getProducts } from "../../services/productsApi";
import type { Product } from "../../services/productsApi";

export function Produtos() {
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(true);
    const [ products, setProducts ] = useState<Product[]>([])

    const [ nameIsDown, setNameIsDown ] = useState(true);
    const [ categoryIsDown, setCategoryIsDown] = useState(true);
    const [ unitIsDown, setUnitIsDown ] = useState(true);
    const [ priceIsDown, setPriceIsDown ] = useState(true);


    useEffect(() => {
        document.title = "Produtos - Comanda"
        loadProducts()
    },[])

    const loadProducts = async () => {
        try{
            setLoading(true)
            const data = await getProducts()
            setProducts(data.sort((a, b) => a.price - b.price ))
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

    const thHandleClick = (th: string) => {
        switch(th) {
            case "Product": {
                if (nameIsDown){
                    const sortedList = [...products].sort((a, b) => 
                        a.product.localeCompare(b.product)
                    )
                    setProducts(sortedList)
                    setNameIsDown(false)

                    setPriceIsDown(true)
                    setCategoryIsDown(true)
                    setUnitIsDown(true)
                } else {
                    const sortedList = [...products].sort((a, b) => 
                        b.product.localeCompare(a.product)
                    )
                    setProducts(sortedList)
                    setNameIsDown(true)
                } 
                break
            }
            case "Price": {
                if (priceIsDown){
                    const sortedList = [...products].sort((a, b) => 
                        b.price - a.price 
                    )
                    setProducts(sortedList)
                    setPriceIsDown(false)

                    setNameIsDown(true)
                    setUnitIsDown(true)
                    setCategoryIsDown(true)
                } else {
                    const sortedList = [...products].sort((a, b) => 
                        a.price - b.price 
                    )
                    setProducts(sortedList)
                    setPriceIsDown(true)
                } 
                break
            }
            case "Category": {
                if (categoryIsDown){
                    const sortedList = [...products].sort((a, b) => 
                        a.category.localeCompare(b.category)
                    )
                    setProducts(sortedList)
                    setCategoryIsDown(false)

                    setNameIsDown(true)
                    setPriceIsDown(true)
                    setUnitIsDown(true)
                } else {
                    const sortedList = [...products].sort((a, b) => 
                        b.category.localeCompare(a.category)
                    )
                    setProducts(sortedList)
                    setCategoryIsDown(true)
                } 
                break
            }
            case "Unit": {
                if (unitIsDown){
                    const sortedList = [...products].sort((a, b) => 
                        a.unit.localeCompare(b.unit)
                    )
                    setProducts(sortedList)
                    setUnitIsDown(false)

                    setNameIsDown(true)
                    setPriceIsDown(true)
                    setCategoryIsDown(true)
                } else {
                    const sortedList = [...products].sort((a, b) => 
                        b.unit.localeCompare(a.unit)
                    )
                    setProducts(sortedList)
                    setUnitIsDown(true)
                } 
                break 
            }              
        }
    }

    const handleClickClass = (isDown: boolean) => {
        return isDown ? `${styles.icon}` : `${styles.icon} ${styles.isUp}`
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
                                <th onClick={() => thHandleClick("Product")}>
                                    Produto 
                                    <ChevronDownIcon className={handleClickClass(nameIsDown)}/>
                                </th>
                                <th onClick={() => thHandleClick("Price")}>
                                    Preço 
                                    <ChevronDownIcon className={handleClickClass(priceIsDown)}/>
                                </th>
                                <th onClick={() => thHandleClick("Category")}>
                                    Categoria 
                                    <ChevronDownIcon className={handleClickClass(categoryIsDown)}/>
                                </th>
                                <th onClick={() => thHandleClick("Unit")}>
                                    Unidade 
                                    <ChevronDownIcon className={handleClickClass(unitIsDown)}/>
                                </th>
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