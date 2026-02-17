import { useNavigate } from "react-router";
import styles from "./CompleteTransaction.module.css"
import { ArrowLeftIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteConfirm } from "../DeleteConfirm";
import type { Financial } from "../../services/financialApi";
import { formatDate } from "../../utils/format-date";

type CompleteTransactionProps = {
    transaction: Financial
    removeTransaction: (filteredproduct: Financial)  => void
    setShowTransaction: (show: boolean)  => void
}

export function CompleteTransaction({ 
    transaction, 
    removeTransaction, 
    setShowTransaction 
} : CompleteTransactionProps) {
    const navigate = useNavigate();

    const [ isMobile, setIsMobile ] = useState(false)
    
    // MediaQuery
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

    const checkType = () => {
        if(transaction.category === "Despesa") {
            return `${styles.transactionType} ${styles.transactionTypeIncome}`
        } else {
            return `${styles.transactionType} ${styles.transactionTypeRevenue}`
        }
    }

    const valueString = `R$ ${transaction.value.toFixed(2).replace(".", ",")}`
    const deleteClass = isMobile ? styles.mobileDelete : styles.del
                                
    return(
        <>
            {confirmDelete && (
                <DeleteConfirm 
                    name="Produto"
                    setOpenConfirm={setConfirmDelete}
                    removeRegister={removeTransaction}
                    register={transaction}
                    setShowRegister={setShowTransaction}
                />
            )}

            <div className={styles.product}>
                {isMobile ? (
                    <div className={styles.header}>
                        {isMobile ? (
                            <>
                                <h2>Conta</h2>
                                <label>#{transaction._id}</label>
                            </>
                        ) : (
                            <h2>Conta #{transaction._id}</h2>
                        )}
                        
                        <div className={styles.buttonBoxMQ}>
                            <button
                                className={`${styles.button} ${styles.editButton}`}
                                onClick={() => navigate(`/financeiro/editar/${transaction._id}`)}
                            >
                                <PencilIcon/> Editar
                            </button>
                            <button
                                className={`${styles.button} ${styles.backButton}`}
                                onClick={() => setShowTransaction(false)}
                            >
                                <ArrowLeftIcon/> Voltar
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.header}>
                        <div className={styles.backButtonBox}>
                            <button
                                className={`${styles.button} ${styles.backButton}`}
                                onClick={() => setShowTransaction(false)}
                            >
                                <ArrowLeftIcon/> Voltar
                            </button>
                            <h2>Conta #{transaction._id}</h2>
                        </div>
                        <button
                            className={`${styles.button} ${styles.editButton}`}
                            onClick={() => navigate(`/financeiro/editar/${transaction._id}`)}
                        >
                            <PencilIcon/> Editar
                        </button>
                    </div>
                )}
                
                {isMobile && (
                    <div className={`${styles.infoBox} ${styles.typeBoxMQ}`}>
                        <h3>Tipo da Conta</h3>
                        <p
                            className={checkType()}
                        >
                            <span>•</span> {transaction.category}
                        </p>
                    </div>
                )}

                <div className={styles.productInfo}>
                    {/* Informacoes do pedido (Primeiro bloco) */}
                    <div className={styles.details}>
                        <div className={styles.infoBox}>
                            <h3 style={{marginBottom:"2rem"}}>Informações da Conta </h3>
                            <hr />
                            <div className={styles.infoLine}>
                                {titleAndValue("Data", formatDate(transaction.date))}
                            </div>
                            {isMobile ? (
                                <>
                                    <div className={styles.infoLine} style={{marginTop:"2rem"}}>
                                        {titleAndValue("Conta", transaction.description)}
                                    </div>
                                    <div className={styles.infoLine} style={{marginTop:"2rem"}}>
                                        {titleAndValue("Valor", valueString) }
                                    </div>
                                </>
                            ) : (
                                <div className={styles.infoLine} style={{marginTop:"3rem"}}>
                                    {titleAndValue("Conta", transaction.description)}
                                    {titleAndValue("Valor", valueString) }
                                </div>
                            )}
                            
                        </div>
                    </div>

                    {/* Informacoes do pedido (Segundo bloco) */}
                    <div className={styles.accountAndDelBox}>
                        {/* Tipo da conta */}
                        {!isMobile && (
                            <div className={styles.infoBox}>
                                <h3>Tipo da Conta</h3>
                                <p
                                    className={checkType()}
                                >
                                    <span>•</span> {transaction.category}
                                </p>
                            </div>
                        )}
                        {/* Conta bancária */}
                        <div className={styles.infoBox}>
                            <div className={styles.account}>
                                <h3>Conta bancária</h3>
                                <p>{transaction.account}</p>
                            </div>
                        </div>
                        {/* Excluir */}
                        <div className={styles.infoBox}>
                            <div className={deleteClass}>
                                <h3>Excluir conta?</h3>
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