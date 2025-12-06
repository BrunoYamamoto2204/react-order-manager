import { useNavigate } from "react-router";
import styles from "./CompleteCustomer.module.css"
import { ArrowLeftIcon, BanIcon, CheckIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteConfirm } from "../DeleteConfirm";
import { type Customer } from "../../services/customersApi";
import { getOrders } from "../../services/ordersApi";

type CompleteCustomerProps = {
    customer: Customer
    removeCustomer: (filteredCustomer: Customer)  => void
    setShowCustomer: (show: boolean)  => void
}

export function CompleteCustomer({ 
    customer, 
    removeCustomer, 
    setShowCustomer 
} : CompleteCustomerProps) {
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
    const [ pendingQuantity, setPendingQuantity ] = useState(0)

    useEffect(() => {
        const loadPendingOrders = async () => {
            const ordersData = await getOrders()
            setPendingQuantity(ordersData.reduce((total, order) => {
                if (order.customerId === customer._id) total += 1 
                return total
            }, 0))
        }

        loadPendingOrders()
    },[customer._id])

    const titleAndValue = (title: string, value: string) => {
        return (
            <div style={{marginBottom:"2rem"}}>
                <label className={styles.titleAndValue}>{title}</label>
                <p className={styles.sectionTitleValue}>{value}</p>
            </div>
        )
    }

    const handlePendingOrders = () => {
        if (!customer.pendingOrders || pendingQuantity === 0) {
            return( 
                <p className={`${styles.havePendingOrders} ${styles.noPendingOrders}`}>
                    <CheckIcon /> Sem pendentes
                </p>
            )
        }
        else {
            return( 
                <p className={`${styles.havePendingOrders} ${styles.pendingOrders}`}>
                    <BanIcon/> {pendingQuantity} pedido(s) pendente(s)
                </p>
            )
        }
    }

    const handleAddress = () => {
        if (
            customer.road === "" && 
            customer.num === "" && 
            customer.neighborhood === "" && 
            customer.city === "" 
        ) {
            return <label>Sem Endereço</label>
        } else {
            return (
                <div className={styles.infoLine}>
                    {customer.road 
                        ? titleAndValue("Rua", customer.road) 
                        : titleAndValue("Rua", "-")
                    }
                    {customer.num 
                        ? titleAndValue("Número", customer.num) 
                        : titleAndValue("Número", "-")
                    }
                    {customer.neighborhood 
                        ? titleAndValue("Bairro", customer.neighborhood) 
                        : titleAndValue("Bairro", "-")
                    }
                    {customer.city 
                        ? titleAndValue("Cidade", customer.city) 
                        : titleAndValue("Cidade", "-")
                    }
                </div>
            )
        }
    }

    if(isMobile) {
        return(
            <>
                {confirmDelete && (
                    <DeleteConfirm 
                        name="Cliente"
                        setOpenConfirm={setConfirmDelete}
                        removeRegister={removeCustomer}
                        register={customer}
                        setShowRegister={setShowCustomer}
                    />
                )}

                <div className={styles.customer}>
                    <div className={styles.header}>
                        <div className={styles.backButtonBox}>
                            <h2>Cliente</h2>
                            <h3>#{customer._id}</h3>
                            <div className={styles.mobileHeaderButtons}>
                                <button
                                    className={`${styles.button} ${styles.backButton}`}
                                    onClick={() => setShowCustomer(false)}
                                >
                                    <ArrowLeftIcon/> Voltar
                                </button>

                                <button
                                    className={`${styles.button} ${styles.editButton}`}
                                    onClick={() => navigate(`/clientes/editar/${customer._id}`)}
                                >
                                    <PencilIcon/> Editar
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.customerInfo}>
                        <div className={styles.details}>
                            <div className={styles.infoBox}>
                                <h3>Informações do Cliente </h3>
                                <hr />
                                <div className={styles.infoLine}>
                                    {titleAndValue("Nome Completo", customer.name)}
                                    {titleAndValue("Número", customer.phone.toString())}
                                    {titleAndValue("E-mail", customer.email)}
                                    {titleAndValue("CPF/CNPJ", customer.cpfCnpj)}
                                </div>
                                <h3 style={{marginTop:"5rem"}}>
                                    Endereço 
                                </h3>
                                <hr />
                                {handleAddress()}
                            </div>
                        </div>

                        <div className={styles.obsBox}>
                            {/* Pendentes */}
                            <div className={styles.infoBox}>
                                <div>
                                    <h3>Pedidos Pendentes</h3>
                                    {handlePendingOrders()}
                                </div>
                            </div>
                            {/* Observações */}
                            <div className={styles.infoBox}>
                                <div className={styles.obs}>
                                    <h3>Observações</h3>
                                    <p>{customer.obs ? customer.obs : "Sem observações "}</p>
                                </div>
                            </div>

                            {/* Excluir */}
                            <div className={styles.infoBox}>
                                <div className={styles.obs}>
                                    <h3>Excluir cliente?</h3>
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
        <div className={styles.customer}>
            {confirmDelete && (
                <DeleteConfirm 
                    name="Cliente"
                    setOpenConfirm={setConfirmDelete}
                    removeRegister={removeCustomer}
                    register={customer}
                    setShowRegister={setShowCustomer}
                />
            )}

            <div className={styles.header}>
                <div className={styles.backButtonBox}>
                    <button
                        className={`${styles.button} ${styles.backButton}`}
                        onClick={() => setShowCustomer(false)}
                    >
                        <ArrowLeftIcon/> Voltar
                    </button>
                    <h2>Cliente #{customer._id}</h2>
                </div>
                <button
                    className={`${styles.button} ${styles.editButton}`}
                    onClick={() => navigate(`/clientes/editar/${customer._id}`)}
                >
                    <PencilIcon/> Editar
                </button>
            </div>

            <div className={styles.customerInfo}>
                <div className={styles.details}>
                    <div className={styles.infoBox}>
                        <h3>Informações do Cliente </h3>
                        <hr />
                        <div className={styles.infoLine}>
                            {titleAndValue("Nome Completo", customer.name)}
                            {titleAndValue("Número", customer.phone.toString())}
                            {titleAndValue("E-mail", customer.email)}
                            {titleAndValue("CPF/CNPJ", customer.cpfCnpj)}
                        </div>
                        <h3 style={{marginTop:"5rem"}}>
                            Endereço 
                        </h3>
                        <hr />
                        {handleAddress()}
                    </div>
                </div>

                <div className={styles.obsBox}>
                    {/* Pendentes */}
                    <div className={styles.infoBox}>
                        <div>
                            <h3>Pedidos Pendentes</h3>
                            {handlePendingOrders()}
                        </div>
                    </div>
                    {/* Observações */}
                    <div className={styles.infoBox}>
                        <div className={styles.obs}>
                            <h3>Observações</h3>
                            <p>{customer.obs ? customer.obs : "Sem observações "}</p>
                        </div>
                    </div>

                    {/* Excluir */}
                    <div className={styles.infoBox}>
                        <div className={styles.obs}>
                            <h3>Excluir cliente?</h3>
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
    )
}