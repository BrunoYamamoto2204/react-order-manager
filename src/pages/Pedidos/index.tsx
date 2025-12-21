import { Container } from "../../components/Container";
import { MainTemplate } from "../../templates/MainTemplate";
import { getOrders, deleteOrder, getOrderById } from "../../services/ordersApi"
import type { Order } from "../../services/ordersApi"

// import styles from "../../components/OrdersList/OrdersList.module.css"
import styles from "./Pedidos.module.css"
import { OrdersList } from "../../components/OrdersList";
import { Title } from "../../components/Title";
import { useEffect, useState } from "react";
import { CalendarIcon, ChevronDownIcon, DownloadIcon, FilterIcon, ListFilterIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Messages } from "../../components/Messages";
import { getProductById, updateProduct } from "../../services/productsApi";
import { formatDate, formatStringDateTime } from "../../utils/format-date";
import { CompleteOrder } from "../../components/CompleteOrder";
import { MediaQueryOrderList } from "../../components/MediaQueryOrderList";
import CustomDatePicker from "../../components/CustomDatePicker";
import { ExportContainer } from "../../components/ExportContainer";
import { getCustomerById } from "../../services/customersApi";

export function Pedidos() {
    const navigate = useNavigate();

    const [ isTablet, setIsTablet ] = useState(false);
    const [ isMobile, setIsMobile ] = useState(false);

    const [ orders, setOrders ] = useState<Order[]>([]);
    const [ allOrders, setAllOrders ] = useState<Order[]>([]);
    const [ loading, setLoading ] = useState(true);
    const [ activeFilter, setActiveFilter ] = useState("Date");
    
    const [ nameIsDown, setNameIsDown ] = useState(true);
    const [ dateIsDown, setDateIsDown] = useState(true);
    const [ deliveryIsDown, setDeliveryIsDown ] = useState(true);
    const [ productsIsDown, setProductsIsDown ] = useState(true);
    const [ valueIsDown, setValueIsDown ] = useState(true);
    const [ statusIsDown, setStatusIsDown ] = useState(true);

    const [ showOrder, setShowOrder ] = useState(false)
    const [ order, setOrder ] =  useState<Order>()

    const [ openDateFilter, setOpenDateFilter ] = useState(false)
    const [ mobileOpenDateFilter, setMobileOpenDateFilter ] = useState(false)
    
    const [ openExport, setOpenExport ] = useState(false);

    // Converte p/ string
    const formatDateString = (date : Date) => {
        return date.toLocaleDateString('sv-SE');
    }

    // Data em tipo Date
    const today = new Date()
    today.setDate(today.getDate());
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    
    const firstDay = new Date(today)
    firstDay.setDate(1)

    // Data em String 
    const [ startDate, setStartDate ] = useState(formatDateString(firstDay))
    const [ endDate, setEndDate ] = useState(formatDateString(lastDay))  

    useEffect(() => {
        // Telas menores de 1650px (Tablet)
        const mediaQueryTablet = window.matchMedia("(max-width: 1650px)")
        setIsTablet(mediaQueryTablet.matches) 

        // Telas menores de 1050px (Mobile)
        const mediaQueryMobile = window.matchMedia("(max-width: 1050px)")
        setIsMobile(mediaQueryMobile.matches)

        const handleResizeTablet = (e: MediaQueryListEvent) => {
            setIsTablet(e.matches)
        }
        const handleResizeMobile = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches)
        }

        mediaQueryMobile.addEventListener("change", handleResizeMobile)
        mediaQueryTablet.addEventListener("change", handleResizeTablet)

        return () => {
            mediaQueryMobile.removeEventListener("change", handleResizeMobile)
            mediaQueryTablet.removeEventListener('change', handleResizeTablet)
        }
    },[])

    useEffect(() => {
        document.title = "Pedidos - Comanda"
        loadOrders()
        
    },[])

    useEffect(() => {
        const filtered = allOrders.filter(o => {
            const orderDate = formatStringDateTime(o.date);
            return orderDate >= startDate && orderDate <= endDate;
        })

        setOrders(filtered)
    }, [allOrders, endDate, startDate])

    const loadOrders = async () => {
        try{
            setLoading(true)
            const data = await getOrders()
            const initialSortedData = data.sort((a, b) => {
                const dateTimeA = `${formatStringDateTime(a.date)} ${a.time}`; 
                const dateTimeB = `${formatStringDateTime(b.date)} ${b.time}`; 
                return dateTimeB.localeCompare(dateTimeA);
            })

            setOrders(initialSortedData)
            setAllOrders(initialSortedData)
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

            // Atualiza a quantidade no produto específico 
            for (const product of orderProducts) {
                const productById = await getProductById(product.productId)
                await updateProduct(
                    product.productId, 
                    {...productById, quantity: productById.quantity -= product.quantity})
            }

            // Atualiza a lista local
            setOrders(prev => prev.filter(order => order._id !== filteredOrder._id))
            setAllOrders(prev => prev.filter(order => order._id !== filteredOrder._id))

            Messages.success("Pedido excluido")
        } catch (error) {
            console.log("[-] Erro ao remover pedido!", error)
            Messages.error("Não foi possível remover o pedido")
        }
    }

    const searchCustomer = async (id: string) => await getCustomerById(id)

    const handleChange = async (searchOrder: string) => {
        if (!searchOrder || searchOrder.trim() === "") {
            setOrders(allOrders);
            return;
        }

        const normalizeText = (text: string) =>
            text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        const ordersWithCustomerData = await Promise.all (
            allOrders.map(async order => {
                try {
                    const customer = await searchCustomer(order.customerId!)
                    return {...order, phone: customer.phone}
                } catch(e) {
                    console.log("Erro ao buscar número do cliente:", e)
                    return {...order, phone: ""} 
                }
            })
        )

        const filteredOrders = ordersWithCustomerData.filter((order) => {
            const formattedDate = formatStringDateTime(order.date);
            const matchDate = formattedDate >= startDate && formattedDate <= endDate;
            const matchName = normalizeText(order.name.toLowerCase())
                .includes(normalizeText(searchOrder.toLowerCase()));
            
            const matchPhone = order.phone.includes(searchOrder);

            return matchDate && (matchName || matchPhone);
        });

        setOrders(filteredOrders);
    };

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
        setShowOrder(true)
        setOrder(order)
    }   

    const handleMobileFilterClick = (filterType: string) => {
        thHandleClick(filterType)
        setActiveFilter(filterType)
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

    if(isMobile) {
        return(
            <MainTemplate>
                <Container>
                    {showOrder && (
                        <CompleteOrder
                            order={order!}
                            removeOrders={removeOrder}
                            setShowOrder={setShowOrder}
                        />
                    )}

                    {openExport && (
                        <ExportContainer 
                            setOpenExport={setOpenExport}
                            orders={orders}
                        />
                    )}

                    {openDateFilter && (
                        <>
                            <div className={styles.overlay} onClick={() => setOpenDateFilter(false)}>
                                <div 
                                    className={styles.dateFilter} 
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <h3>Escolha a data</h3>
                                    <div className={styles.calendarBox}>
                                        <div className={styles.startDate} >
                                            <div>
                                                <CustomDatePicker
                                                    displayValue={formatDate}
                                                    value={startDate}
                                                    onChange={setStartDate}
                                                    placeholder="Selecione a data inicial"
                                                    dateName = "Data Inicial"
                                                    maxDate={endDate} // Data inicial não pode ser depois da final
                                                />
                                            </div>
                                        </div>
                                        <p>até</p>
                                        <div className={styles.startDate} >
                                            <div>
                                                <CustomDatePicker
                                                    displayValue={formatDate}
                                                    value={endDate}
                                                    onChange={setEndDate}
                                                    placeholder="Selecione a data final"
                                                    dateName = "Data Final"
                                                    minDate={startDate} // Data final não pode ser antes da inicial
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        className={styles.calendarButton}
                                        onClick={() => setOpenDateFilter(false)}
                                    >
                                        Fechar 
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    <div className={styles.header}>
                        <Title title="Pedidos" subtitle="Confira o histórico de pedidos"/>
                        <div className={styles.mobileButtons}>
                            <button
                                onClick={() => navigate("/pedidos/novo")}
                                className={styles.mobileAddButton}
                            >
                                <PlusIcon/>
                            </button>
                            <button className={styles.buttonHeader}
                                onClick={() => setOpenExport(true)}
                            >
                                <DownloadIcon/>
                            </button>
                        </div>
                    </div>

                    <div className={styles.searchOrder}>
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
                                <button onClick={() => {handleMobileFilterClick("Name")}}>
                                    Nome
                                    <ChevronDownIcon
                                        className={handleClickClass(nameIsDown)}
                                        style={{
                                            opacity: activeFilter === "Name" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </button>
                                <button onClick={() => {handleMobileFilterClick("Date")}}>
                                    Horário | Data
                                    <ChevronDownIcon
                                        className={handleClickClass(dateIsDown)}
                                        style={{
                                            opacity: activeFilter === "Date" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </button>
                                <button onClick={() => {handleMobileFilterClick("Products")}}>
                                    Produtos
                                    <ChevronDownIcon
                                        className={handleClickClass(productsIsDown)}
                                        style={{
                                            opacity: activeFilter === "Products" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </button>
                                <button onClick={() => {handleMobileFilterClick("Delivery")}}>
                                    Entrega
                                    <ChevronDownIcon
                                        className={handleClickClass(deliveryIsDown)}
                                        style={{
                                            opacity: activeFilter === "Delivery" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </button>
                                <button onClick={() => {handleMobileFilterClick("Value")}}>
                                    Valor
                                    <ChevronDownIcon
                                        className={handleClickClass(valueIsDown)}
                                        style={{
                                            opacity: activeFilter === "Value" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </button>
                                <button onClick={() => {handleMobileFilterClick("Status")}}>
                                    Status
                                    <ChevronDownIcon
                                        className={handleClickClass(statusIsDown)}
                                        style={{
                                            opacity: activeFilter === "Status" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className={styles.periodFilter}>
                        <div className={styles.filterAndDate}>
                            <div 
                                className={styles.filteredDate}
                                onClick={() => setMobileOpenDateFilter(!mobileOpenDateFilter)}
                            >
                                <p><ListFilterIcon/> Filtrar Data:</p>
                                <p><ChevronDownIcon/></p>
                            </div>

                            {mobileOpenDateFilter && (
                                <label 
                                    className={styles.filteredDateValue} 
                                    onClick={() =>  setOpenDateFilter(true)}
                                >
                                    {`${formatDate(startDate)} - ${formatDate(endDate)}`}
                                </label>
                            )}
                            
                        </div>
                        {mobileOpenDateFilter && (
                            <p 
                                className={styles.cleanFilter} 
                                onClick={() => {
                                    setStartDate(formatDateString(firstDay))
                                    setEndDate(formatDateString(today))
                                }}
                            >
                                Limpar Filtro
                            </p>
                        )}
                    </div>
                    
                    <div>
                        <div className={styles.MobileList}>
                            <MediaQueryOrderList
                                ordersList={orders}
                                handleClickOrder={handleClickOrder}
                                setOrders={setOrders}
                            />
                        </div>
                    </div>
                </Container>
            </MainTemplate>
        )
    }

    if (isTablet) {
        return(
            <MainTemplate>
                <Container>
                    {showOrder && (
                        <CompleteOrder 
                            order={order!}
                            removeOrders={removeOrder}
                            setShowOrder={setShowOrder}
                        />
                    )}

                    {openExport && (
                        <ExportContainer 
                            setOpenExport={setOpenExport}
                            orders={orders}
                        />
                    )}

                    {openDateFilter && (
                        <>
                            <div className={styles.overlay} onClick={() => setOpenDateFilter(false)}>
                                <div 
                                    className={styles.dateFilter} 
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <h3>Escolha a data</h3>
                                    <div className={styles.calendarBox}>
                                        <div className={styles.startDate} >
                                            <div>
                                                <CustomDatePicker
                                                    displayValue={formatDate}
                                                    value={startDate}
                                                    onChange={setStartDate}
                                                    placeholder="Selecione a data inicial"
                                                    dateName = "Data Inicial"
                                                    maxDate={endDate} // Data inicial não pode ser depois da final
                                                />
                                            </div>
                                        </div>
                                        <p>até</p>
                                        <div className={styles.startDate} >
                                            <div>
                                                <CustomDatePicker
                                                    displayValue={formatDate}
                                                    value={endDate}
                                                    onChange={setEndDate}
                                                    placeholder="Selecione a data final"
                                                    dateName = "Data Final"
                                                    minDate={startDate} // Data final não pode ser antes da inicial
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        className={styles.calendarButton}
                                        onClick={() => setOpenDateFilter(false)}
                                    >
                                        Fechar 
                                    </button>
                                </div>
                            </div>
                        </>
                    )}

                    <div className={styles.header}>
                        <Title title="Pedidos" subtitle="Confira o histórico de pedidos"/>
                        <div className={styles.headerButtons}>
                            <button 
                                className={styles.filterDateButton}
                                onClick={() => setOpenDateFilter(true)}
                            >
                                <CalendarIcon/> Filtrar Horário
                            </button>
                            <button onClick={() => navigate("/pedidos/novo")}>
                                <PlusIcon/> Adicionar Pedido
                            </button>
                            <button className={styles.buttonHeader}
                                onClick={() => setOpenExport(true)}
                            >
                                <DownloadIcon/> 
                            </button>
                        </div>
                    </div>
                    <div className={styles.searchOrder}>
                        <SearchIcon className={styles.searchIcon} />
                        <input 
                            onChange={e => handleChange(e.target.value)}
                            placeholder="Buscar produto"
                        />

                        <div className={styles.mobileFilterBox}>
                            <div className={styles.filterButton}>
                                <FilterIcon/> 
                                Filtrar
                            </div>
                            <div className={styles.dropDownFilter}>
                                <button onClick={() => {handleMobileFilterClick("Name")}}>
                                    Nome 
                                    <ChevronDownIcon 
                                        className={handleClickClass(nameIsDown)}
                                        style={{ 
                                            opacity: activeFilter === "Name" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </button>
                                <button onClick={() => {handleMobileFilterClick("Date")}}>
                                    Horário | Data
                                    <ChevronDownIcon 
                                        className={handleClickClass(dateIsDown)}
                                        style={{ 
                                            opacity: activeFilter === "Date" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    /> 
                                </button>
                                <button onClick={() => {handleMobileFilterClick("Products")}}>
                                    Produtos 
                                    <ChevronDownIcon 
                                        className={handleClickClass(productsIsDown)}
                                        style={{ 
                                            opacity: activeFilter === "Products" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    /> 
                                </button>

                                <button onClick={() => {handleMobileFilterClick("Delivery")}}>
                                    Entrega 
                                    <ChevronDownIcon 
                                        className={handleClickClass(deliveryIsDown)}
                                        style={{ 
                                            opacity: activeFilter === "Delivery" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    /> 
                                </button>

                                <button onClick={() => {handleMobileFilterClick("Value")}}>
                                    Valor 
                                    <ChevronDownIcon 
                                        className={handleClickClass(valueIsDown)}
                                        style={{ 
                                            opacity: activeFilter === "Value" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </button>

                                <button onClick={() => {handleMobileFilterClick("Status")}}>
                                    Status
                                    <ChevronDownIcon 
                                        className={handleClickClass(statusIsDown)}
                                        style={{ 
                                            opacity: activeFilter === "Status" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </button>
                            </div>
                        </div>  
                    </div>
                    
                    <div className={styles.periodFilter}>
                        <div className={styles.filterAndDate}>
                            <p className={styles.filteredDate}>
                                <ListFilterIcon/> Filtro Ativo: 
                            </p>
                            <label className={styles.filteredDateValue}>
                                {`${formatDate(startDate)} - ${formatDate(endDate)}`}
                            </label>
                        </div>
                        <p 
                            className={styles.cleanFilter} 
                            onClick={() => {
                                setStartDate(formatDateString(firstDay))
                                setEndDate(formatDateString(today))
                            }}
                        >
                            Limpar Filtro
                        </p>
                    </div>

                    <div>
                        <div className={styles.MobileList}>
                            <MediaQueryOrderList 
                                ordersList={orders}
                                handleClickOrder={handleClickOrder}
                                setOrders={setOrders}
                            />
                        </div>
                    </div>
                </Container>
            </MainTemplate>
        )
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

                {openDateFilter && (
                    <>
                        <div className={styles.overlay} onClick={() => setOpenDateFilter(false)}>
                            <div 
                                className={styles.dateFilter} 
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3>Escolha a data</h3>
                                <div className={styles.calendarBox}>
                                    <div className={styles.startDate} >
                                        <div>
                                            <CustomDatePicker
                                                displayValue={formatDate}
                                                value={startDate}
                                                onChange={setStartDate}
                                                placeholder="Selecione a data inicial"
                                                dateName = "Data Inicial"
                                                maxDate={endDate} // Data inicial não pode ser depois da final
                                            />
                                        </div>
                                    </div>
                                    <p>até</p>
                                    <div className={styles.startDate} >
                                        <div>
                                            <CustomDatePicker
                                                displayValue={formatDate}
                                                value={endDate}
                                                onChange={setEndDate}
                                                placeholder="Selecione a data final"
                                                dateName = "Data Final"
                                                minDate={startDate} // Data final não pode ser antes da inicial
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    type="button"
                                    className={styles.calendarButton}
                                    onClick={() => setOpenDateFilter(false)}
                                >
                                    Fechar 
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {openExport && (
                    <ExportContainer 
                        setOpenExport={setOpenExport}
                        orders={orders}
                    />
                )}

                <div className={styles.header}>
                    <Title title="Pedidos" subtitle="Confira o histórico de pedidos"/>
                    <div className={styles.headerButtons}>
                        <button 
                            className={styles.filterDateButton}
                            onClick={() => setOpenDateFilter(true)}
                        >
                            <CalendarIcon/> Filtrar Horário
                        </button>
                        <button onClick={() => navigate("/pedidos/novo")}>
                            <PlusIcon/> Adicionar Pedido
                        </button>
                        <button className={styles.buttonHeader}
                            onClick={() => setOpenExport(true)}
                        >
                            <DownloadIcon/> 
                        </button>
                    </div>
                </div>

                <div className={styles.searchOrder}>
                    <SearchIcon className={styles.searchIcon} />
                    <input 
                        onChange={e => handleChange(e.target.value)}
                        placeholder="Buscar pedido"
                    />
                </div>

                <div className={styles.periodFilter}>
                    <div className={styles.filterAndDate}>
                        <p className={styles.filteredDate}>
                            <ListFilterIcon/> Filtro Ativo: 
                        </p>
                        <label className={styles.filteredDateValue}>
                            {`${formatDate(startDate)} - ${formatDate(endDate)}`}
                        </label>
                    </div>
                    <p 
                        className={styles.cleanFilter} 
                        onClick={() => {
                            setStartDate(formatDateString(firstDay))
                            setEndDate(formatDateString(today))
                        }}
                    >
                        Limpar Filtro
                    </p>
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
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                <OrdersList 
                                    ordersList={orders}
                                    handleClickOrder={handleClickOrder}
                                    setOrders={setOrders}
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