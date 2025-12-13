import { useEffect, useState } from "react"
import styles from "./ExportContainer.module.css"
import { BikeIcon, ChevronDownIcon, ClipboardListIcon, Container, DownloadIcon, FileTextIcon, LogsIcon, TriangleAlertIcon } from "lucide-react"
import { getProductTypes, type ProductType } from "../../services/productTypeApi"
import { Messages } from "../Messages"
import type { Order } from "../../services/ordersApi"
import { MainTemplate } from "../../templates/MainTemplate"
import { ExportToExcel } from "../ExportToExcel"

type ExportContainerProps = {
    setOpenExport: (open: boolean) => void
    orders: Order[]
}

export function ExportContainer({ setOpenExport, orders }: ExportContainerProps) {

    const [ exportList, setExportList ] = useState<Order[]>([]) 

    const [ exportOptions, setExportOptions ] = useState(false) 
    const [ categoryChoiceOpen, setCategoryChoiceOpen ] = useState(false)
    const [ categoryChoiceValue, setCategoryChoiceValue ] = useState("Escolha uma opção")

    const [ loading, setLoading ] = useState(false);
    const [ exporting, setExporting ] = useState(false);
    
    const [ categories, setCategories ] = useState<ProductType[]>([])

    const [ isActive, setIsActive ] = useState("All")

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getProductTypes()
                setCategories(data)
            } catch(error) {
                console.log("Erro ao carregar as categorias:", error)
                Messages.error("Erro ao carregar os categorias")
            } finally {
                setLoading(false)
            }
        }

        loadCategories()

        setExportList(orders)
    }, [orders])

    useEffect(() => {
        console.log(exportList)
    }, [exportList])

    const deliveryCount = orders.filter(order => order.isDelivery)
    const pendingCount = orders.filter(order => order.status === "Pendente")

    const statusOrders = (status: string) => {
        if (status === "Pendente") setExportList(orders.filter(o => o.status === "Pendente"))
        else if (status === "Concluído") setExportList(orders.filter(o => o.status === "Concluído"))
        else setExportList(orders.filter(o => o.status === "Cancelado"))
    }

    const deliveryOrders = (isDelivery: boolean) => { 
        if (isDelivery) setExportList(orders.filter(order => order.isDelivery))
        else setExportList(orders.filter(order => order.isDelivery === false))
    }

    const categoryOrders = (categoryName: string) => {
        setExportList(
            orders.filter(order => 
                order.products.some(p => p.category === categoryName)
            ).map(order => ({
                ...order,
                products: order.products.filter(p => p.category === categoryName),
                productsStrings: order.products
                    .filter(p => p.category === categoryName)
                    .map(p => `${p.quantity} ${p.unit} ${p.product}`)
            }))
        )
    }

    const selectChoice = (choice: string) => {
        setCategoryChoiceValue(choice)
        setCategoryChoiceOpen(false)
    }

    const choiceValues = (labelName: string, list: React.ReactElement) => {
        return(
             <div className={styles.categoryValueChoice}>
                <label>{labelName}</label>
                <button 
                    type="button"
                    className={`${styles.dropbtn} ${categoryChoiceOpen ? styles.open : ""}`}
                    onClick={() => setCategoryChoiceOpen(!categoryChoiceOpen)}
                >
                    {categoryChoiceValue}
                    <ChevronDownIcon/>
                </button>
                <div 
                    className={`${styles.dropdownContent} 
                        ${categoryChoiceOpen ? styles.open : ""}
                    `}
                >
                    {list}
                </div>
            </div>
        )
    }

    const chooseCategoryValue = () => {
        if (isActive === "Category") {
            return (
               choiceValues("Selecione a categoria:", 
               <>
                    {categories.map(category => 
                        <a onClick={() => { 
                            selectChoice(category.name) 
                            categoryOrders(category.name)
                        }}>
                            {category.name}
                        </a>
                    )}  
                </>
               )
            )
        }

        if (isActive === "Delivery") {
            return (
                choiceValues("Tipo de Pedido:", 
                <>
                    <a onClick={() => { 
                        selectChoice("Apenas Entregas")
                        deliveryOrders(true)
                    }}>
                        Apenas Entregas
                    </a>
                    <a onClick={() => {
                        selectChoice("Apenas Retiradas")
                        deliveryOrders(false)
                    }}>
                        Apenas Retiradas
                    </a>
                </>
               )
            )
        }

        if (isActive === "Status") {
            return (
                choiceValues("Status do Pedido:", 
                <>
                    <a onClick={() =>{ 
                        selectChoice("Pendente")
                        statusOrders("Pendente")
                    }}>
                        Pendente
                    </a>
                    <a onClick={() => {
                        selectChoice("Concluído")
                        statusOrders("Concluído")
                    }}>
                        Concluído
                    </a>
                    <a onClick={() => {
                        selectChoice("Cancelado")
                        statusOrders("Cancelado")
                    }}>
                        Cancelado
                    </a>
                </>
               )
            )
        }
    }

    const handleExportExcel = async () => {
        try {
            setExporting(true)
            Messages.dismiss()

            // Nenhum pedido no período ou nenhum pedido na categoria
            if (orders.length === 0 || 
                categoryChoiceValue !== "Escolha uma opção" && exportList.length === 0
            ) {
                Messages.error("Nenhum pedido disponível para exportar");
                setExporting(false);
                return;
            }
            
            // Não selecionou valores do tipo 
            if (isActive === "Category" || isActive === "Delivery" || isActive === "Status") {
                if (exportList.length === 0) {
                    Messages.error("Selecione uma opção antes de exportar");
                    setExporting(false);
                    return;
                }
            }

            // Função de exportação do Excel 
            await ExportToExcel(
                exportList, 
                isActive,
                categoryChoiceValue !== "Escolha uma opção" ? categoryChoiceValue : undefined
            );

            setIsActive("All")
            setExportList(orders)

            Messages.success(`${exportList.length} pedido(s) exportado(s) com sucesso!`);
            setExportOptions(false);

        } catch (error) {
            console.error("Erro ao exportar:", error);
            Messages.error("Erro ao gerar arquivo Excel");
        } finally {
            setExporting(false)
        }
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
        <>  
            {exportOptions && (
                <div className={styles.exportOptionsDiv}>
                    <div className={styles.exportOptionsDivContent}>

                        <div className={styles.exportOptionsDivHeader}>
                            <h3 >
                                <FileTextIcon style={{color:"var(--primary)"}}/> 
                                Configurar Exportação
                            </h3>
                            <p
                                onClick={() => setExportOptions(false)}
                            >
                                x
                            </p>
                        </div>

                        {/* Tipo de Exportação */}
                        <div className={styles.exportOptionsDivBody}>
                            <h4>Selecione o tipo de exportação: </h4>

                            <div className={styles.exportOptionsChoiceContainer}>
                                <div 
                                    className={`${styles.exportOptionsChoice} ${
                                        isActive === "All" ? styles.isActive : ""}
                                    `}
                                    onClick={() => {
                                        setIsActive("All")
                                        setCategoryChoiceValue("Escolha uma opção")
                                        setExportList(orders)
                                    }}
                                >
                                    <p>Todos os Pedidos</p>
                                    <label>Exportar Tudo</label>
                                </div>

                                <div 
                                    className={`${styles.exportOptionsChoice} ${
                                        isActive === "Category" ? styles.isActive : ""
                                    }`}
                                    onClick={() => {
                                        setIsActive("Category")
                                        setCategoryChoiceValue("Escolha uma opção")
                                        setExportList([])
                                    }}
                                >
                                    <p>Por Categoria</p>
                                    <label>Filtrar Produtos</label>
                                </div>

                                <div 
                                    className={`${styles.exportOptionsChoice} ${
                                        isActive === "Delivery"? styles.isActive : ""}
                                    `}
                                    onClick={() => {
                                        setIsActive("Delivery")
                                        setCategoryChoiceValue("Escolha uma opção")
                                        setExportList([])
                                    }}
                                >
                                    <p>Por Entrega</p>
                                    <label>Entrega/Retiradas</label>
                                </div>

                                <div 
                                    className={`${styles.exportOptionsChoice} ${
                                        isActive === "Status"? styles.isActive : ""}
                                    `}
                                    onClick={() => {
                                        setIsActive("Status")
                                        setCategoryChoiceValue("Escolha uma opção")
                                        setExportList([])
                                    }}
                                >
                                    <p>Por Status</p>
                                    <label>Pendente/Concluído</label>
                                </div>
                            </div>

                            {chooseCategoryValue()}
                        </div>

                        {/* Aviso de Quantidade de Exportação */}
                        <div className={styles.exportInfo}>
                             <h4>Preview da exportação</h4>
                             <p>{exportList.length} pedido(s) serão exportados</p>
                        </div>

                        <div className={styles.exportButtons}>
                            <button 
                                type="button"
                                className={styles.cancelButton}
                                onClick={() => setExportOptions(false)}
                                disabled={exporting}
                            >
                                Cancelar
                            </button>
                            <button 
                                type="button"
                                className={styles.sendButton}
                                disabled={exporting}
                                onClick={handleExportExcel}
                            >
                                {exporting ? ( 
                                    <>Exportando...</> 
                                ) : (
                                    <><DownloadIcon/> Exportar Excel</>
                                )}
                                
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.overlay}></div>
            <div className={styles.exportDiv}>
                <div className={styles.headerExportDiv}>
                    <h2>Exportar Pedidos para Excel</h2>
                    <button onClick={() => setOpenExport(false)}>Fechar</button>
                </div>

                <button 
                    className={styles.exportButton}
                    onClick={() => setExportOptions(true)}
                >
                    <DownloadIcon/> Exportar Pedidos
                </button>

                <h3>Pedidos Disponíveis: {orders.length}</h3>

                <div className={styles.orderInfoContainer}>
                    <div className={styles.orderInfoBox}>
                        <label> Total de Pedidos <ClipboardListIcon/></label>
                        <p>{orders.length}</p>
                    </div>

                    <div className={styles.orderInfoBox}>
                        <label>Categorias <LogsIcon/></label>
                        <p>{categories.length}</p>
                    </div>

                    <div className={styles.orderInfoBox}>
                        <label>Entregas <BikeIcon/></label>
                        <p>{deliveryCount.length}</p>
                    </div>

                    <div className={styles.orderInfoBox}>
                        <label>Pendentes <TriangleAlertIcon/></label>
                        <p>{pendingCount.length}</p>
                    </div>
                </div>
            </div>
        </>
    )
}