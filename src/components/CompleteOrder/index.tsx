import { useNavigate } from "react-router";
import styles from "./CompleteOrder.module.css"
import { ArrowLeftIcon, PencilIcon, Trash2Icon } from "lucide-react";
import type { Order } from "../../services/ordersApi";
import { useEffect, useState } from "react";
import { DeleteConfirm } from "../DeleteConfirm";

type CompleteOrderProps = {
    order: Order
    removeOrders: (filteredOrder: Order)  => void
    setShowOrder: (show: boolean)  => void
}

export function CompleteOrder({ order, removeOrders, setShowOrder } : CompleteOrderProps) {
    const navigate = useNavigate();

    useEffect(() => {
        const mainElement = document.querySelector("main")
        if (mainElement) {
            mainElement.scroll({ top: 0, behavior: "smooth" })
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

    const haveDiscount = (discount: string) => {
        if (discount === "0.00") return 
        const discountValueString = `R$ ${Number(order.discount).toFixed(2)}`

        return (
            <div className={styles.productItem}>
                <label style={{color:"var(--primary-light)"}}>Desconto</label>
                <label style={{color:"var(--primary-light)"}}>{discountValueString}</label>
            </div>
        )
    }

    const haveDeliveryFee = (isDelivery: boolean) => {
        if (!isDelivery) return

        return (
            <div className={styles.productItem}>
                <label style={{color:"var(--warning)"}}>Taxa de Entrega</label>
                <label style={{color:"var(--warning)"}}>- {order.deliveryFee}</label>
            </div>
        )
    }

    const handleStatus = (status: string) => {
        if (!order.isDelivery){
            if (status === "Pendente") {
                return( 
                    <p className={`${styles.orderStatus} ${styles.orderStatusPending}`}>
                        <span>•</span> Pendente
                    </p>
                )
            }
            else if (status === "Concluído") {
                return( 
                    <p className={`${styles.orderStatus} ${styles.orderStatusConclued}`}>
                        <span>•</span> Concluído
                    </p>
                )
            }
            else {
                return( 
                    <p className={`${styles.orderStatus} ${styles.orderStatusCanceled}`}>
                        <span>•</span> Cancelado
                    </p>
                )
            }
        } else {
            if (status === "Pendente") {
                return( 
                    <p className={`${styles.orderStatus} ${styles.orderStatusPending}`}>
                        <span>•</span> Pendente
                    </p>
                )
            }
            else if (status === "Concluído") {
                return( 
                    <p className={`${styles.orderStatus} ${styles.orderStatusConclued}`}>
                        <span>•</span> Entregue
                    </p>
                )
            }
            else {
                return( 
                    <p className={`${styles.orderStatus} ${styles.orderStatusCanceled}`}>
                        <span>•</span> Cancelado
                    </p>
                )
            }
        }
    }

    return(
        <>
            {/* <div className={styles.overlay}/> */}
            <div className={styles.order}>
                {confirmDelete && (
                    <DeleteConfirm 
                        name="Pedido"
                        setOpenConfirm={setConfirmDelete}
                        removeRegister={removeOrders}
                        register={order}
                        setShowRegister={setShowOrder}
                    />
                )}

                <div className={styles.header}>
                    <div className={styles.backButtonBox}>
                        <button
                            className={`${styles.button} ${styles.backButton}`}
                            onClick={() => setShowOrder(false)}
                        >
                            <ArrowLeftIcon/> Voltar
                        </button>
                        <h2>Pedido #{order._id}</h2>
                    </div>
                    <button
                        className={`${styles.button} ${styles.editButton}`}
                        onClick={() => navigate(`/pedidos/editar/${order._id}`)}
                    >
                        <PencilIcon/> Editar
                    </button>
                </div>

                <div className={styles.orderInfo}>
                    <div className={styles.details}>
                        <div className={styles.infoBox}>
                            <h3 style={{marginBottom:"2rem"}}>Informações do Cliente </h3>
                            {titleAndValue("Nome", order.name)}
                        </div>
                        
                        <div className={styles.infoBox}>
                            {/* Detalhes do Pedido */}
                            <h3 style={{marginBottom:"2rem"}}>Detalhes do Pedido</h3>
                            <div className={styles.detailsHeader}>
                                {titleAndValue("Data", order.date)}
                                {titleAndValue("Horário", order.time)}
                            </div>

                            <div className={styles.detailsHeader} style={{marginTop:"5rem"}}>
                                <h3>Produto</h3>
                                <h3>Subtotal</h3>
                            </div>
                            <hr />
                            {/* Lista de Produtos e preços */}
                            {order.products.map(p => {
                                const unitPriceString = `R$ ${Number(p.price)
                                    .toFixed(2).replace(".",",")
                                }`
                                const totalPrice = `R$ ${(p.quantity * Number(p.price))
                                    .toFixed(2).replace(".",",")
                                }`

                                return (
                                    <div className={styles.productItem}>
                                        <div>
                                            <label>{p.product}</label>
                                            <p>
                                                {p.quantity} x {unitPriceString}
                                            </p>
                                        </div>
                                        <label>{totalPrice}</label>
                                    </div>
                                )
                            })}
                            {haveDiscount(order.discount)}
                            {haveDeliveryFee(order.isDelivery)}
                            <hr />
                            {/* Total */}
                            <div className={styles.detailsHeader} style={{marginTop:"2rem"}}>
                                <h3>Valor Total</h3>
                                <h3>{order.value}</h3>
                            </div>         
                        </div>
                    </div>

                    <div className={styles.deliveryAndStatus}>
                        <div className={styles.infoBox}>
                            <h3>Status do Pedido</h3>
                            {handleStatus(order.status)}
                        </div>
                        <div className={styles.infoBox}>                        
                            <h3 style={{marginBottom:"2rem"}}>Detalhes de Entrega</h3>
                            <div style={{marginBottom: "3rem"}}>
                                {titleAndValue("Entrega", order.isDelivery ? "Sim" : "Não")}
                            </div>
                            <div>
                                {titleAndValue("Local de Entrega", order.deliveryAddress ? order.deliveryAddress : "-")}
                            </div>
                        </div>
                        <div className={styles.infoBox}>
                            <div className={styles.obs}>
                                <h3>Observações</h3>
                                <p>{order.obs ? order.obs : "Sem observações "}</p>
                            </div>
                        </div>
                        <div className={styles.infoBox}>
                            <div className={styles.obs}>
                                <h3>Excluir pedido?</h3>
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