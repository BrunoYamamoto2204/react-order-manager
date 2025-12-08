import { useNavigate } from "react-router";
import styles from "./CompleteProduct.module.css"
import { ArrowLeftIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteConfirm } from "../DeleteConfirm";
import type { Product } from "../../services/productsApi";

type CompleteProductProps = {
    product: Product
    removeProduct: (filteredproduct: Product)  => void
    setShowProduct: (show: boolean)  => void
}

export function CompleteProduct({ product, removeProduct, setShowProduct } : CompleteProductProps) {
    const navigate = useNavigate();

    const [ isMobile, setIsMobile ] = useState(false)
    
    useEffect(() => {
        const mainElement = document.querySelector("main")
        if (mainElement) {
            mainElement.scroll({ top: 0, behavior: "smooth" })
        }

        const mediaQueryMobile = window.matchMedia("(max-width: 1050px)")
        setIsMobile(mediaQueryMobile.matches)

        const handleMobile = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches)
        }

        mediaQueryMobile.addEventListener("change", handleMobile)
        return () => {
            mediaQueryMobile.removeEventListener("change", handleMobile)
        }
    }, [])

    const [ confirmDelete, setConfirmDelete ] = useState(false)

    const titleAndValue = (title: string, value: string) => {
        return (
            <div>
                <label className={styles.titleAndValue}>{title}</label>
                <p className={styles.sectionTitleValue}>{value}</p>
            </div>
        )
    }

    const valueString = `R$ ${product.price.toFixed(2)}`

    if (isMobile) {
        return(
            <>
                {confirmDelete && (
                    <DeleteConfirm 
                        name="Produto"
                        setOpenConfirm={setConfirmDelete}
                        removeRegister={removeProduct}
                        register={product}
                        setShowRegister={setShowProduct}
                    />
                )}

                <div className={styles.product}>
                    <div className={styles.header}>
                        <div className={styles.backButtonBox}>
                            <h2>Produto</h2>
                            <h3>#{product._id}</h3>
                            <div className={styles.mobileHeaderButtons}>
                                <button
                                    className={`${styles.button} ${styles.backButton}`}
                                    onClick={() => setShowProduct(false)}
                                >
                                    <ArrowLeftIcon/> Voltar
                                </button>
                                <button
                                    className={`${styles.button} ${styles.editButton}`}
                                    onClick={() => navigate(`/produtos/editar/${product._id}`)}
                                >
                                    <PencilIcon/> Editar
                                </button>
                            </div>
                            
                        </div>
                        
                    </div>

                    <div className={styles.productInfo}>
                        <div className={styles.details}>
                            <div className={styles.infoBox}>
                                <h3 style={{marginBottom:"2rem"}}>Informações do Produto </h3>
                                <hr />
                                <div className={styles.infoLine}>
                                    {titleAndValue("Produto", product.product)}
                                    {titleAndValue("Preço", valueString)}
                                </div>
                                <div className={styles.infoLine} style={{marginTop:"3rem"}}>
                                    {titleAndValue("Tipo", product.unit)}
                                    {titleAndValue("Categoria", product.category)}
                                </div>
                            </div>
                        </div>

                        <div className={styles.obsBox}>
                            {/* Total vendido */}
                            <div className={styles.infoBox}>
                                {titleAndValue("Total Vendido", product.quantity.toString())}
                            </div>
                            {/* Observações */}
                            <div className={styles.infoBox}>
                                <div className={styles.obs}>
                                    <h3>Observações</h3>
                                    <p>{product.description ? product.description : "Sem Descrição "}</p>
                                </div>
                            </div>
                            {/* Excluir */}
                            <div className={styles.infoBox}>
                                <div className={styles.mobileDelete}>
                                    <h3>Excluir produto?</h3>
                                    <button 
                                        type="button" 
                                        className={`${styles.button} ${styles.deleteButton}`}
                                        onClick={() => setConfirmDelete(true)}
                                        style={{marginTop:"2rem"}}
                                    >
                                        <Trash2Icon /> Excluir
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return(
        <>
            {confirmDelete && (
                <DeleteConfirm 
                    name="Produto"
                    setOpenConfirm={setConfirmDelete}
                    removeRegister={removeProduct}
                    register={product}
                    setShowRegister={setShowProduct}
                />
            )}

            <div className={styles.product}>
                <div className={styles.header}>
                    <div className={styles.backButtonBox}>
                        <button
                            className={`${styles.button} ${styles.backButton}`}
                            onClick={() => setShowProduct(false)}
                        >
                            <ArrowLeftIcon/> Voltar
                        </button>
                        <h2>Produto #{product._id}</h2>
                    </div>
                    <button
                        className={`${styles.button} ${styles.editButton}`}
                        onClick={() => navigate(`/produtos/editar/${product._id}`)}
                    >
                        <PencilIcon/> Editar
                    </button>
                </div>

                <div className={styles.productInfo}>
                    <div className={styles.details}>
                        <div className={styles.infoBox}>
                            <h3 style={{marginBottom:"2rem"}}>Informações do Produto </h3>
                            <hr />
                            <div className={styles.infoLine}>
                                {titleAndValue("Produto", product.product)}
                                {titleAndValue("Preço", valueString)}
                            </div>
                            <div className={styles.infoLine} style={{marginTop:"3rem"}}>
                                {titleAndValue("Tipo", product.unit)}
                                {titleAndValue("Categoria", product.category)}
                            </div>
                        </div>
                    </div>

                    <div className={styles.obsBox}>
                        {/* Total vendido */}
                        <div className={styles.infoBox}>
                            {titleAndValue("Total Vendido", product.quantity.toString())}
                        </div>
                        {/* Observações */}
                        <div className={styles.infoBox}>
                            <div className={styles.obs}>
                                <h3>Observações</h3>
                                <p>{product.description ? product.description : "Sem Descrição "}</p>
                            </div>
                        </div>
                        {/* Excluir */}
                        <div className={styles.infoBox}>
                            <div className={styles.obs}>
                                <h3>Excluir produto?</h3>
                                <button 
                                    type="button" 
                                    className={`${styles.button} ${styles.deleteButton}`}
                                    onClick={() => setConfirmDelete(true)}
                                    style={{marginTop:"2rem"}}
                                >
                                    <Trash2Icon /> Excluir
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}