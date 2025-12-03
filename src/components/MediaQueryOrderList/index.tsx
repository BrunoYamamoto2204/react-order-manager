import { useEffect, useState } from "react"
import styles from "../../pages/Pedidos/Pedidos.module.css"
import { updateOrder, type Order } from "../../services/ordersApi"
import { getCustomerById, updateCustomer } from "../../services/customersApi"
import { BikeIcon } from "lucide-react"
import { StatusSelectList } from "../StatusSelectList/indes"

type MediaQueryOrderListProps = {
    ordersList: Order[],
    handleClickOrder: (order: Order) => void
    setOrders: (newOrder: Order[]) => void
}

const OrderProducts = ({ productsStrings }: { productsStrings: string[] }) => {

    const [ showAll, setShowAll ] = useState(false);
    const list = showAll ? productsStrings : productsStrings.slice(0,3)
    const showButton = showAll ? "Ver menos..." : "Ver mais..."

    // A lista de produtos
    const formatList = list.map((p, i) => {
        return <li key={i} className={styles.liList}>{p}</li>
    })

    // Botão de Ver Mais/Ver Menos 
    if (productsStrings.length > 3){
        formatList.push(
            <li key="show" className={styles.seeMore}>
                <button onClick={() => setShowAll(!showAll)}>{showButton}</button>
            </li>
        )
    }
    
    return (
        <ul>{formatList}</ul>
    )
}

export function MediaQueryOrderList({ 
    ordersList, 
    handleClickOrder, 
    setOrders 
} : MediaQueryOrderListProps){
    const [ list, setList ] = useState<Order[]>()
    const [ isMobile, setIsMobile ] = useState(false) 

    useEffect(() => {
        const mediaQueryMobile = window.matchMedia("(max-width: 1050px)")
        setIsMobile(mediaQueryMobile.matches)

        const handleMobile = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches)
        }

        mediaQueryMobile.addEventListener("change", handleMobile)
        return () => {
            mediaQueryMobile.removeEventListener("change", handleMobile)
        }
    },[])

    useEffect(() => {
        setList([ ...ordersList ])
    }, [ordersList])

    const statusStyle = (status : string) => {
        if (status === "Pendente"){
            return styles.pending
        } 
        else if (status === "Concluído"){
            return styles.completed
        }
        else{
            return styles.canceled
        }
    }

    const changeStatus = async (order: Order, status: string, customerId: string) => { 
         if (!order._id) {
            console.error("Pedido sem _id");
            return;
        }

        // Realiza a atualização de status no pedido [NO MONGO DB]
        const updatedOrder = { ...order, status };
        await updateOrder(order._id, updatedOrder); 

        // Realiza a atualização de status no pedido [NA LISTA LOCAL]
        const updatedList = list?.map(o => 
            o._id === order._id ? updatedOrder : o
        ) || []

        setOrders(updatedList)
        setList(updatedList);  

        // Atualiza o noPending do cliente, se houver cadastro
        if (customerId) {
            const hasOtherPendingOrders = updatedList.some(o => 
                o.customerId === customerId &&
                o.status === "Pendente" 
            )

            const stillPending = status === "Pendente" || hasOtherPendingOrders;

            const customer = await getCustomerById(customerId) 
            await updateCustomer(customerId, {
                ...customer,
                pendingOrders: stillPending
            })
        }
    }

    const deliveryInf = (isDelivery: boolean) => {
        if (isDelivery) {
            return (
                <div className={styles.mobileDelivery}>
                    <BikeIcon/> Entrega
                </div>
            )
        } else {
            return  (
                <p className={styles.mobileDeliveryNa}>
                    N/A
                </p>
            )
        }
    }

    return(
        <div className={styles.mobileOrderContainer}>
            {list?.map((order, index) => 
                <div key={`${order.name}_${index}`} className={styles.mobileOrderBox}>
                    <div className={styles.mobileBoxHeader}>
                        <div>
                            <h3>
                                {order.name}
                            </h3>
                            <div className={styles.mobileBoxTime}>
                                <label style={{color:"var(--primary-light)"}}>
                                    {order.time}
                                </label> 
                                <label> - </label>
                                {order.date}
                            </div>
                        </div>

                        <div className={styles.seeOrder}>
                            <p onClick={() => handleClickOrder(order)}>Ver Pedido</p>
                        </div>
                    </div>
                    
                    <div className={styles.mobileBoxProducts}>
                        <OrderProducts productsStrings={order.productsStrings} />
                    </div>

                    {isMobile ? (
                        <div className={styles.mobileBoxInfo}>
                            <div className={styles.infoFooter}>
                                <div className={`${styles.status} ${statusStyle(order.status)}`}>
                                    <StatusSelectList
                                        customerId={order.customerId ? order.customerId : ""}
                                        status={order.status}
                                        changeStatus={changeStatus}
                                        order={order}
                                    />
                                </div>
                                <p>{deliveryInf(order.isDelivery)}</p>
                            </div>
                            <p style={{fontSize: "2.2rem"}}>{order.value}</p>
                        </div>
                    ) : (  
                        <div className={styles.mobileBoxInfo}>
                            <div className={styles.infoFooter}>
                                <div className={`${styles.status} ${statusStyle(order.status)}`}>
                                    <StatusSelectList
                                        customerId={order.customerId ? order.customerId : ""}
                                        status={order.status}
                                        changeStatus={changeStatus}
                                        order={order}
                                    />
                                </div>
                                {deliveryInf(order.isDelivery)}
                            </div>
                            <p style={{fontSize: "2.5rem"}}>{order.value}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}