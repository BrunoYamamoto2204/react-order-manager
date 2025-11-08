import { useEffect, useRef, useState } from "react";
import { getProducts, type Product } from "../../services/productsApi";

import styles from "./ProductSearch.module.css"
import { SearchIcon } from "lucide-react";
import type { OrderProduct } from "../../pages/Pedidos/createPedido";


type ProductSearchProps = {
    productName: string
    onChangeName: (name: string) => void
    setProduct: (product: OrderProduct | undefined) => void
    placeholder: string
}

export function ProductSearch({ 
    productName,
    onChangeName, 
    setProduct, 
    placeholder
} : ProductSearchProps
) {
    const [ products, setProducts ] = useState<Product[]>([]) 
    const [ filteredProducts, setFilteredProducts ] = useState<Product[]>([]) 
    const [ showSuggestions, setShowSuggestions ] = useState(false) 
    const [ loading, setLoading ] = useState(true) 

    const dropDownRef = useRef<HTMLInputElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        loadProducts()

        const handleSuggestions = (event: MouseEvent) => {
            if (
                dropDownRef.current && 
                !dropDownRef.current.contains(event.target as Node) 
            ){
                setShowSuggestions(false)
            }
        }

        document.addEventListener("mousedown", handleSuggestions)
    },[])

    const loadProducts = async () => {
        try{
            setProducts(await getProducts())
        } catch(error) {
            console.log("[500] - Erro ao buscar produtos: ", error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (name: string) => {
        onChangeName(name)

        if (name.trim() === ""){
            setShowSuggestions(false)
            setFilteredProducts([])
            setProduct(undefined)
            return 
        }

        const normalizeText = (text: string) =>
            text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

        setFilteredProducts(products.filter(product => (
            normalizeText(product.product).toLowerCase()
                .includes(normalizeText(name).toLowerCase())
        )))

        const matchProduct = products.find(product => (
            normalizeText(product.product).toLowerCase() === normalizeText(name).toLowerCase()
        ))

        // Captura o product pela escrita manual do nome do produto 
        if(matchProduct && matchProduct._id) {
            const formattedProduct = {
                uniqueId: Date.now(),
                productId: matchProduct._id,
                product: matchProduct.product,
                price: matchProduct.price.toString(),
                quantity: 1,
                category: matchProduct.category,
                unit: matchProduct.unit
            }
            setProduct(formattedProduct)
        } else{
            setProduct(undefined)
        }

        setShowSuggestions(true)
    }

    // Captura o product pela escolha da recomendação 
    const choseProduct = (product: Product) => {
        if (!product._id) return 

        const formattedProduct = {
            uniqueId: Date.now(),
            productId: product._id.toString(),
            product: product.product,
            price: product.price.toString(),
            quantity: 1,
            category: product.category,
            unit: product.unit
        }

        onChangeName(product.product)
        setProduct(formattedProduct)
        setShowSuggestions(false)
    }

    return (
        <> 
            <SearchIcon className={styles.searchIcon} />
            <input
                id="nome"
                ref={inputRef}
                autoComplete="off"
                value={productName}
                onChange={(e) => handleChange(e.target.value)}
                placeholder={placeholder}
                className={styles.input}
            />

            {showSuggestions && (
                <div className={styles.suggestions} ref={dropDownRef}>
                    {loading ? (
                        <div>Carregando...</div>
                    ) : (filteredProducts.length > 0 
                        ? (filteredProducts.map(product => (
                                <button
                                    key={product._id} 
                                    onClick={() => {choseProduct(product)}}
                                    className={styles.divChoseItem}
                                >
                                    <div className={styles.choseItem}>
                                        {product.product} ({product.unit}) - 
                                        R$ {product.price.toFixed(2)}
                                    </div>
                                </button>
                            ))) 
                        : (
                            <div className={styles.choseItem}>
                                Nenhum produto encontrado
                            </div>
                        )
                    )}
                </div>
            )}
        </>
    )
}