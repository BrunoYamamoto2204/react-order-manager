import { Container } from "../../components/Container";
import { MainTemplate } from "../../templates/MainTemplate";
import { getOrders, deleteOrder, getOrderById } from "../../services/ordersApi"
import type { Order } from "../../services/ordersApi"

// import styles from "../../components/OrdersList/OrdersList.module.css"
import styles from "./Pedidos.module.css"
import { OrdersList } from "../../components/OrdersList";
import { Title } from "../../components/Title";
import { useEffect, useState } from "react";
import { ChevronDownIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Messages } from "../../components/Messages";
import { getProductById, updateProduct } from "../../services/productsApi";
import { formatStringDateTime } from "../../utils/format-date";
import { CompleteOrder } from "../../components/CompleteOrder";

export function Pedidos() {
    const navigate = useNavigate();
    const [ orders, setOrders ] = useState<Order[]>([]);
    const [ loading, setLoading ] = useState(true);
    
    const [ nameIsDown, setNameIsDown ] = useState(true);
    const [ dateIsDown, setDateIsDown] = useState(true);
    const [ deliveryIsDown, setDeliveryIsDown ] = useState(true);
    const [ productsIsDown, setProductsIsDown ] = useState(true);
    const [ valueIsDown, setValueIsDown ] = useState(true);
    const [ statusIsDown, setStatusIsDown ] = useState(true);

    const [ showOrder, setShowOrder ] = useState(false)
    const [ order, setOrder ] =  useState<Order>()

    useEffect(() => {
        document.title = "Pedidos - Comanda"
        loadOrders()
    },[])

    const loadOrders = async () => {
        try{
            setLoading(true)
            const data = await getOrders()
            setOrders(data.sort((a, b) => {
                const dateTimeA = `${formatStringDateTime(a.date)} ${a.time}`; 
                const dateTimeB = `${formatStringDateTime(b.date)} ${b.time}`; 
                return dateTimeB.localeCompare(dateTimeA);
            }))
        } catch (error) {
            console.error('[-] Erro ao carregar pedidos:', error);
            Messages.error("Erro ao carregar pedidos");
        } finally {
            setLoading(false)
        }
    }

    const removeOrder = async (filteredOrder: Order) => {
        try {
            if(!filteredOrder._id) {
                console.log("❌ Pedido sem _id:", filteredOrder);
                return;
            };
            const orderProducts = (await getOrderById(filteredOrder._id)).products
            await deleteOrder(filteredOrder._id);

            for (const product of orderProducts) {
                const productById = await getProductById(product.productId)
                await updateProduct(
                    product.productId, 
                    {...productById, quantity: productById.quantity -= product.quantity})
            }

            setOrders(orders.filter(order => order._id !== filteredOrder._id))
            Messages.success("Pedido excluido")
        } catch (error) {
            console.log("[-] Erro ao remover pedido!", error)
            Messages.error("Não foi possível remover o pedido")
        }
    }

    const handleChange = async (customerName: string) => {
        const currentOrders = await getOrders()

        if (customerName && customerName.trim() === "") {
            setOrders(currentOrders)
        } else {
            const normalizeText = (text: string) =>(
                text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            )

            const filteredOrders = currentOrders.filter(order => (
                normalizeText(order.name.toLowerCase())
                .includes(normalizeText(customerName.toLowerCase()))
            ))

            setOrders(filteredOrders)
        }
    }

    const thHandleClick = (th: string) => {
        switch(th) {
            case "Name": {
                if (nameIsDown){
                    const sortedList = [...orders].sort((a, b) => 
                        a.name.localeCompare(b.name)
                    )
                    setOrders(sortedList)
                    setNameIsDown(false)

                    setDateIsDown(true)
                    setProductsIsDown(true)
                    setValueIsDown(true)
                    setStatusIsDown(true)
                    setDeliveryIsDown(true)
                    
                } else {
                    const sortedList = [...orders].sort((a, b) => 
                        b.name.localeCompare(a.name)
                    )
                    setOrders(sortedList)
                    setNameIsDown(true)
                } 
                break
            }
            case "Date": {
                if (dateIsDown){
                    const sortedList = [...orders].sort((a, b) => {
                        const dateTimeA = `${formatStringDateTime(a.date)} ${a.time}`; 
                        const dateTimeB = `${formatStringDateTime(b.date)} ${b.time}`; 
                        return dateTimeA.localeCompare(dateTimeB);
                    })
                    setOrders(sortedList)
                    setDateIsDown(false)

                    setNameIsDown(true)
                    setValueIsDown(true)
                    setProductsIsDown(true)
                    setStatusIsDown(true)
                    setDeliveryIsDown(true)
                    
                } else {
                    const sortedList = [...orders].sort((a, b) => {
                        const dateTimeA = `${formatStringDateTime(a.date)} ${a.time}`; 
                        const dateTimeB = `${formatStringDateTime(b.date)} ${b.time}`; 
                        return dateTimeB.localeCompare(dateTimeA);
                    })
                    setOrders(sortedList)
                    setDateIsDown(true)
                } 
                break
            }
            case "Products": {
                if (productsIsDown){
                    const sortedList = [...orders].sort((a, b) => 
                        a.products.length - b.products.length
                    )
                    setOrders(sortedList)
                    setProductsIsDown(false)

                    setNameIsDown(true)
                    setDateIsDown(true)
                    setValueIsDown(true)
                    setStatusIsDown(true)
                    setDeliveryIsDown(true)
                } else {
                    const sortedList = [...orders].sort((a, b) => 
                        b.products.length - a.products.length
                    )
                    setOrders(sortedList)
                    setProductsIsDown(true)
                } 
                break
            }
            case "Delivery": {
                if (deliveryIsDown){
                    const sortedList = [...orders].sort((a, b) => 
                        Number(b.isDelivery) - Number(a.isDelivery)
                    )
                    setOrders(sortedList)
                    setDeliveryIsDown(false)

                    setNameIsDown(true)
                    setDateIsDown(true)
                    setValueIsDown(true)
                    setProductsIsDown(true)
                    setStatusIsDown(true)
                } else {
                    const sortedList = [...orders].sort((a, b) => 
                        Number(a.isDelivery) - Number(b.isDelivery)
                    )
                    setOrders(sortedList)
                    setDeliveryIsDown(true)
                } 
                break
            }
            case "Value": {
                if (valueIsDown){
                    const sortedList = [...orders].sort((a, b) => {
                        const priceA = Number(a.value.split(" ")[1])
                        const priceB = Number(b.value.split(" ")[1])

                        return priceB - priceA
                    })
                    setOrders(sortedList)
                    setValueIsDown(false)

                    setNameIsDown(true)
                    setDateIsDown(true)
                    setProductsIsDown(true)
                    setStatusIsDown(true)
                    setDeliveryIsDown(true)
                    
                } else {
                    const sortedList = [...orders].sort((a, b) => {
                        const priceA = Number(a.value.split(" ")[1])
                        const priceB = Number(b.value.split(" ")[1])

                        return priceA - priceB
                    })
                    setOrders(sortedList)
                    setValueIsDown(true)
                } 
                break 
            }   
            case "Status": {
                if (statusIsDown){
                    const sortedList = [...orders].sort((a, b) => 
                        a.status.localeCompare(b.status)
                    )
                    setOrders(sortedList)
                    setStatusIsDown(false)

                    setNameIsDown(true)
                    setDateIsDown(true)
                    setProductsIsDown(true)
                    setValueIsDown(true)
                    setDeliveryIsDown(true)
                } else {
                    const sortedList = [...orders].sort((a, b) => 
                        b.status.localeCompare(a.status)
                    )
                    setOrders(sortedList)
                    setStatusIsDown(true)
                } 
                break 
            }                
        }
    }

    const handleClickClass = (isDown: boolean) => {
        return isDown ? `${styles.icon}` : `${styles.icon} ${styles.isUp}`
    }

    const handleClickOrder = (order: Order) => {
        setShowOrder(!showOrder)
        setOrder(order)
    }   

    if (loading) {
        return (
            <MainTemplate>
                <Container>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        Carregando pedidos...
                    </div>
                </Container>
            </MainTemplate>
        );
    }

    return (
        <MainTemplate>
            <Container>
                {showOrder && (
                    <CompleteOrder 
                        order={order!}
                        removeOrders={removeOrder}
                        setShowOrder={setShowOrder}
                    />
                )}

                <div className={styles.header}>
                    <Title title="Pedidos" subtitle="Confira o histórico de pedidos"/>
                    <button onClick={() => navigate("/pedidos/novo")}>
                        <PlusIcon/> Adicionar Pedido
                    </button>
                </div>

                <div className={styles.searchOrder}>
                    <SearchIcon className={styles.searchIcon} />
                    <input 
                        onChange={e => handleChange(e.target.value)}
                        placeholder="Buscar produto"
                    />
                </div>

                <div className={styles.orderTable}>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => thHandleClick("Name")}>
                                    Nome 
                                    <ChevronDownIcon className={handleClickClass(nameIsDown)}/>
                                </th>
                                <th onClick={() => thHandleClick("Date")}>
                                    Horário | Data 
                                    <ChevronDownIcon className={handleClickClass(dateIsDown)}/>
                                </th>
                                <th onClick={() => thHandleClick("Products")}>
                                    Produtos 
                                    <ChevronDownIcon className={handleClickClass(productsIsDown)}/>
                                </th>
                                <th onClick={() => thHandleClick("Delivery")}>
                                    Entrega 
                                    <ChevronDownIcon className={handleClickClass(deliveryIsDown)}/>
                                </th>
                                <th onClick={() => thHandleClick("Value")}>
                                    Valor 
                                    <ChevronDownIcon className={handleClickClass(valueIsDown)}/>
                                </th>
                                <th onClick={() => thHandleClick("Status")}>
                                    Status 
                                    <ChevronDownIcon className={handleClickClass(statusIsDown)}/>
                                </th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                <OrdersList 
                                    ordersList={orders}
                                    handleClickOrder={handleClickOrder}
                                />
                            ) : (
                                <tr>
                                    <td className={styles.noOrders}>
                                        <p>Sem Pedidos disponíveis</p>
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