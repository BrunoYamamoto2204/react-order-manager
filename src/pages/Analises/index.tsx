import { useEffect, useMemo, useRef, useState } from "react"
import { Container } from "../../components/Container"
import { Title } from "../../components/Title"
import { MainTemplate } from "../../templates/MainTemplate"
import styles from "./Analises.module.css"
import CustomDatePicker from "../../components/CustomDatePicker"
import { ChartNoAxesCombinedIcon, ChevronDownIcon, CogIcon, DollarSignIcon, ShoppingCartIcon,TrophyIcon } from "lucide-react"
import { AnalysisList } from "../../components/AnalysisList"
import { formatDate, formatStringDateTime } from "../../utils/format-date"
import { AnalisysProductTable } from "../../components/AnalysisProductTable"
import { getOrders, type Order } from "../../services/ordersApi"

type ProductQuantity = {
    productName: string
    totalValue: number
    totalQuantity: number
    orderCount: number 
    unit: string
}

export function Analises() {
    useEffect(() => {
        document.title = "Análises - Comanda"
    },[])

    // Converte p/ string
    const formatDateString = (date : Date) => {
        return date.toLocaleDateString('sv-SE');
    }

    // Data em tipo Date
    const today = new Date()
    today.setDate(today.getDate());
    const firstDay = new Date(today)
    firstDay.setDate(1)

    // Data em String 
    const [ startDate, setStartDate ] = useState(formatDateString(firstDay))
    const [ endDate, setEndDate ] = useState(formatDateString(today))  
    const [ isOpen, setIsOpen ] = useState(false)
    const [ sortType, setSortType ] = useState("Escolha uma opção")

    const [ products, setProducts ] = useState<ProductQuantity[]>([])
    const [ showProducts, setShowProducts ] = useState(false);
    const [ orders, setOrders ] = useState<Order[]>([])

    const inputRef = useRef<HTMLDivElement>(null)

    // Busca os produtos pelo período
    useEffect(() => {
        const loadOrders = async () => {
            try{
                const ordersData = await getOrders()
                
                const filteredOrders = ordersData.filter(order => {
                    const orderDateStr = formatStringDateTime(order.date)
                    return orderDateStr >= startDate && orderDateStr <= endDate
                })

                setOrders(filteredOrders)
            } catch (error) {
                console.log("Erro ao buscar produtos: ", error)
            }
        } 

        loadOrders()
    }, [startDate, endDate])
    
    useEffect(() => {
        const mainElement = document.querySelector('main');
        if (mainElement) {
            mainElement.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [showProducts])

    // Clicar fora das opções fecha
    useEffect(() => {
        const handleClickRef = (event: MouseEvent) => {
            if (
                inputRef.current && 
                !inputRef.current.contains(event.target as Node)
            ){
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickRef)
    }, [])
   
    // Define a lista de produtos em destaque 
    useEffect(() => {
        // Juntar as estatisticas de cada produto na lista dentro do período específico 
        const productsStats = (orders: Order[]) => {
            const productsMap = new Map<string, ProductQuantity>()

            orders.forEach(order => {
                order.products.forEach(product => {
                    const nameName = product.product
                    const quantity = product.quantity
                    const unit = product.unit
                    const totalValue = Number(product.price) * quantity

                    // Se o produto já estiver no Map, adicione, se não, crie um novo
                    if (productsMap.has(nameName)){
                        const currentProduct = productsMap.get(nameName)!
                        currentProduct.totalValue += totalValue
                        currentProduct.totalQuantity += quantity
                        currentProduct.orderCount += 1

                    } else {
                        productsMap.set(nameName, {
                            productName: nameName,
                            totalValue: totalValue,
                            totalQuantity: quantity,
                            orderCount: 1,
                            unit: unit
                        })
                    }
                })
            })
            return Array.from(productsMap.values())
        }

        
        const currentProducts = productsStats(orders)

        // Organiza a tabela segundo o parâmetro 
        if (sortType !== "Escolha uma opção") {
            switch (sortType) {
                case "Mais Vendido":
                    currentProducts.sort((a, b) => b.totalQuantity - a.totalQuantity)
                    break
                case "Menos Vendido":
                    currentProducts.sort((a, b) => a.totalQuantity - b.totalQuantity)
                    break
                case "Mais Lucro":
                    currentProducts.sort((a, b) => b.totalValue - a.totalValue)
                    break
                case "Menos Lucro":
                    currentProducts.sort((a, b) => a.totalValue - b.totalValue)
                    break
            }
        } else {
            currentProducts.sort((a, b) => b.totalValue - a.totalValue)
        }

        setProducts(currentProducts)
    }, [orders, sortType])

    const totalValue = () => {
        return orders.reduce((total, order) => 
            total += Number(order.value.split(" ")[1])
        , 0)
    }

    const aovValue = () => {
        return orders.length > 0 ? totalValue() / orders.length : 0
    }

    const selectOption = (option: string) => {
        setSortType(option)
        setIsOpen(!isOpen)
    }

    // Exibe a tabela 
    const productList = useMemo(() => {
        return [...products]
            .slice(0, 5)
            .map((p, k) => {
                const unit = p.unit === "UN" ? "" : ` ${p.unit}`
                return {
                    position: k + 1,
                    productName: p.productName,
                    totalValue: p.totalValue,
                    totalQuantity: p.totalQuantity + unit,
                }
            })
    }, [products])

    const allProductList = useMemo(() => {
        return [...products]
            .map((p, k) => {
                const unit = p.unit === "UN" ? "" : ` ${p.unit}`
                return {
                    position: k + 1,
                    productName: p.productName,
                    totalValue: p.totalValue,
                    totalQuantity: p.totalQuantity + unit,
                }
            })
    }, [products])

    const bestSellingProduct = products[0]

    return (
        <MainTemplate>
            <Container >
                {showProducts && (
                    <AnalisysProductTable 
                        handleShowProducts={setShowProducts}
                        products={allProductList}
                    />
                )}

                <Title 
                    title="Análises" 
                    subtitle="Analise os resultados e gere insights para o seu negócio"
                />
                <div className={styles.analysisDate}>
                    <h2>Período de análise: </h2>
                    <div className={styles.period}>
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
                        <div className={styles.midText}>até</div>
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

                {/* RESUMO DO PERÍODO */}
                <div className={styles.periodResume}>
                    <div className={styles.resumeTitle}>
                        <h2>Resumo do perído</h2>
                        <h3>Visão geral dos seus resultados de vendas.</h3>
                    </div>
                    <div className={styles.resumeContent}>
                        <div className={styles.resumeItem}>
                            <h3>Quantidade de Pedidos</h3>
                            <h4>{orders.length}</h4>
                        </div>
                        <div className={styles.resumeItem}>
                            <h3>Valor dos Pedidos</h3>
                            <h4>R$ {totalValue().toFixed(2)}</h4>
                        </div>
                        <div className={styles.resumeItem}>
                            <h3>Ticket Médio</h3>
                            <h4>R$ {aovValue().toFixed(2)}</h4>
                        </div>
                    </div>
                </div>

                <div className={styles.featuredProductStats}>
                    <div className={styles.productChoice}>
                        <h2>Destaques </h2>
                        <div className={styles.dropdown} ref={inputRef} >
                            <button
                                className={`${styles.dropbtn} ${isOpen ? styles.open : ""}`}
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {sortType}
                                <ChevronDownIcon/>
                            </button>
                        
                            <div 
                                className={`${styles.dropdownContent} ${isOpen ? styles.open : ""}`}
                            >
                                <a onClick={() => selectOption("Mais Lucro")} href="#">
                                    Mais Lucro
                                </a>
                                <a onClick={() => selectOption("Mais Vendido")} href="#">
                                    Mais Vendido
                                </a>
                                <a onClick={() => selectOption("Menos Lucro")} href="#">
                                    Menos Lucro
                                    </a>
                                <a onClick={() => selectOption("Menos Vendido")} href="#">
                                    Menos Vendido
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* DESTAQUES */}
                    <div className={styles.containersGroup}>
                        <div className={styles.featuredProduct}>
                            <h2><TrophyIcon/> Produto</h2>
                            <h3 className={styles.productName}>
                                {bestSellingProduct?.productName}
                            </h3>
                            <h4 className={styles.productSubtitle}>se destacou no período.</h4>
                        </div>
                        <div className={styles.featuredProduct}>
                            <h2><ShoppingCartIcon/> Quantidade Vendida</h2>
                            <h3 className={styles.productName}>
                                {bestSellingProduct?.totalQuantity}
                            </h3>
                            <h4 className={styles.productSubtitle}>unidades vendidas</h4>
                        </div>
                        <div className={styles.featuredProduct}>
                            <h2><DollarSignIcon/> Valor Total</h2>
                            <h3 className={styles.productName}>
                                R$ {bestSellingProduct?.totalValue.toFixed(2)}
                            </h3>
                            <h4 className={styles.productSubtitle}>em vendas no período</h4>
                        </div>
                    </div>

                    <div className={styles.gridOfTwo}>
                        <div className={styles.bestSellersContainer}>
                            <h2>
                                <ChartNoAxesCombinedIcon/>
                                Produtos em Destaque
                            </h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Posição</th>
                                        <th>Produto</th>
                                        <th>Valor</th>
                                        <th>Quantidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnalysisList productsList={productList}/>
                                </tbody>
                            </table>
                            <h3 
                                className={styles.seeMore} 
                                onClick={() => setShowProducts(true)}
                            >
                                Ver mais...
                            </h3>
                        </div>
                        <div className={styles.orderChart}>
                            <h2>
                                <CogIcon /> 
                                Em Breve
                            </h2>
                            <div className={styles.centerBox}>
                                <h2>Sessão em construção</h2>
                            </div>
                        </div>  
                    </div>
                </div>
            </Container>
        </MainTemplate>
    )
}