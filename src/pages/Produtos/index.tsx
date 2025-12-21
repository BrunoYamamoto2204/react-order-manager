import { Container } from "../../components/Container";
import { Title } from "../../components/Title";
import { MainTemplate } from "../../templates/MainTemplate";

import styles from "./Produtos.module.css"
import { ProductsList } from "../../components/ProductsList";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ListFilterIcon, PlusIcon, SearchIcon } from "lucide-react";
import { Messages } from "../../components/Messages";
import { deleteProduct, getProducts } from "../../services/productsApi";
import type { Product } from "../../services/productsApi";
import { CompleteProduct } from "../../components/CompleteProduct";
import { MediaQueryProductList } from "../../components/MediaQueryProductList";

export function Produtos() {
    const navigate = useNavigate();

    const [ isMobile, setIsMobile ] = useState(false);

    const [ loading, setLoading ] = useState(true);
    const [ products, setProducts ] = useState<Product[]>([])
    const [ activeFilter, setActiveFilter ] = useState("Date");

    const [ pageNumber, setPageNumber ] = useState(0)
    const [ ablePages, setAblePages ] = useState(1)

    const [ nameIsDown, setNameIsDown ] = useState(true);
    const [ categoryIsDown, setCategoryIsDown] = useState(true);
    const [ unitIsDown, setUnitIsDown ] = useState(true);
    const [ priceIsDown, setPriceIsDown ] = useState(true);

    const [ showProduct, setShowProduct ] = useState(false)
    const [ product, setProduct ] =  useState<Product>()

    useEffect(() => {
        document.title = "Produtos - Comanda"
        loadProducts()

        // Telas menores de 1050px (Mobile)
        const mediaQueryMobile = window.matchMedia("(max-width: 1350px)")
        setIsMobile(mediaQueryMobile.matches)

        const handleResizeMobile = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches)
        }

        mediaQueryMobile.addEventListener("change", handleResizeMobile)

        return () => {
            mediaQueryMobile.removeEventListener("change", handleResizeMobile)
        }
    },[])

    useEffect(() => {
        if ( products.length <= 1) setAblePages(1)
        else {
            const numberOfPages = Math.ceil(products.length / 15)
            setAblePages(numberOfPages)
        }
    },[products, setAblePages])
    

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

    const pagesList = (page: number) => {
        const groupsList = []

        const jump = 15
        for (let i = 0; i < products.length; i += jump) {
            groupsList.push(products.slice(i, i + jump))
        }

        return groupsList[page]
    }

    const removeProduct = async (filteredProduct: Product) => {
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
        setPageNumber(0)
        const currentProducts = (await getProducts()).sort((a, b) => a.price - b.price )

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
        setPageNumber(0)

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

    const handleClickproduct = (product: Product) => {
        setShowProduct(true)
        setProduct(product)
    }   
    
    const handleMobileFilterClick = (filterType: string) => {
        thHandleClick(filterType)
        setActiveFilter(filterType)
    }

    const handlePages = () => {
        const pages = []

        for (let i = 1; i <= ablePages; i++) {
            pages.push(i)
        }

        return (
            <>
                {pages.map((page, index) =>( 
                    <p 
                        key={`${index}_${page}`}
                        onClick={() => setPageNumber(page - 1)}
                        className={index === pageNumber ? styles.activePage : ""}
                    >
                        {page}
                    </p>)
                )}
            </>
        )
    }

    const handleChangePages = (direction: string) => {
        if (direction === "back") {
            const current = pageNumber - 1
            if (current < 0) return 
            else setPageNumber(prev => prev -= 1)
        } else {
            const current = pageNumber + 1
            if (current >= ablePages) return 
            setPageNumber(prev => prev += 1)
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

    if (isMobile) {
        return(
            <MainTemplate>
                <Container>
                    {showProduct && (
                        <CompleteProduct 
                            product={product!}
                            removeProduct={removeProduct}
                            setShowProduct={setShowProduct}
                        />
                    )}

                    <div className={styles.header}>
                        <Title title="Produtos" subtitle="Gerenciamento de dados dos produtos"/>
                        <button 
                            onClick={() => navigate("/produtos/criar")}
                            className={styles.mobileAddButton}
                        >
                            <PlusIcon/>
                        </button>
                    </div>

                    <div className={styles.searchProduct}>
                        <SearchIcon className={styles.searchIcon} />
                        <input 
                            onChange={e => handleChange(e.target.value)}
                            placeholder="Buscar produto"
                        />

                        <div className={styles.mobileFilterBox}>
                            <div className={styles.filterButton}>
                                <ListFilterIcon/>
                            </div>
                            <div className={styles.dropDownFilter}>
                                <button onClick={() => {handleMobileFilterClick("Product")}}>
                                    Produto
                                    <ChevronDownIcon
                                        className={handleClickClass(nameIsDown)}
                                        style={{
                                            opacity: activeFilter === "Product" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </button>
                                <button onClick={() => {handleMobileFilterClick("Price")}}>
                                    Preço
                                    <ChevronDownIcon
                                        className={handleClickClass(priceIsDown)}
                                        style={{
                                            opacity: activeFilter === "Price" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </button>
                                <button onClick={() => {handleMobileFilterClick("Category")}}>
                                    Categoria
                                    <ChevronDownIcon
                                        className={handleClickClass(categoryIsDown)}
                                        style={{
                                            opacity: activeFilter === "Category" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </button>
                                <button onClick={() => {handleMobileFilterClick("Unit")}}>
                                    Unidade
                                    <ChevronDownIcon
                                        className={handleClickClass(unitIsDown)}
                                        style={{
                                            opacity: activeFilter === "Unit" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className={styles.MobileList}>
                            <MediaQueryProductList
                                productsList={products}
                                handleClickproduct={handleClickproduct}
                            />
                        </div>
                    </div>
                </Container>
            </MainTemplate>
        )
    }

    return(
       <MainTemplate>
            <Container>
                {showProduct && (
                    <CompleteProduct 
                        product={product!}
                        removeProduct={removeProduct}
                        setShowProduct={setShowProduct}
                    />
                )}

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
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                <ProductsList 
                                    handleClickproduct={handleClickproduct}
                                    pageNumber={pageNumber}
                                    pagesList={pagesList}
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
                
                {products.length > 15 && (
                    <div className={styles.pagesContainer}>
                    <h3>Acesse mais Produtos</h3>
                    <div className={styles.pagesList}>
                        <button 
                            type="button"
                            onClick={() => handleChangePages("back")}
                        >
                            <ChevronLeftIcon />
                        </button>
                        {handlePages()}
                        <button 
                            type="button"
                            onClick={() => handleChangePages("front")}
                        >
                            <ChevronRightIcon />
                        </button>
                    </div>
                </div>
                )}
                
            </Container>
       </MainTemplate>
    )
}