import { ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, EllipsisVerticalIcon, FilterIcon, SearchIcon, TrendingDownIcon, TrendingUpIcon, Wallet2Icon } from "lucide-react"
import { Container } from "../../components/Container"
import { Title } from "../../components/Title"
import { MainTemplate } from "../../templates/MainTemplate"
import styles from "./Financeiro.module.css"
import CustomDatePicker from "../../components/CustomDatePicker"
import { useEffect, useRef, useState } from "react"
import { formatDate, formatStringDateTime } from "../../utils/format-date"
import { getOrders, type Order } from "../../services/ordersApi"
import { getIncomesExpenses, type Financial } from "../../services/financialApi"
import { useNavigate } from "react-router"

export function Financeiro () {  
    const navigate = useNavigate()

    const formatDateString = (date: Date) => {
        return date.toLocaleDateString("sv-SE");
    }

    const [ currentTransactions, setCurrentTransactions ] = useState<Financial[]>([])
    const [ filteredTransactions, setFilteredTransactions ] = useState<Financial[]>([])

    const today = new Date()
    today.setDate(today.getDate())
    const firstDay = new Date(today)
    firstDay.setDate(1)

    const [ comparison, setComparison ] = useState<React.ReactNode[]>([])

    const [ startDate, setStartDate ] = useState(formatDateString(firstDay))
    const [ endDate, setEndDate ] = useState(formatDateString(today))  
    const [ orders, setOrders ] = useState<Order[]>([]) 

    const [ pageNumber, setPageNumber ] = useState(0)
    const [ ablePages, setAblePages ] = useState(1)

    const [ expenseButton, setExpenseButton ] = useState(false)
    const [ revenueButton, setRevenueButton ] = useState(false)

    const [ openOptionsId, setOpenOptionsId ] = useState<string | number | null>(null)

    const inputRef = useRef<HTMLDivElement>(null)

    // Carrega as transações
    useEffect(() => {
        const getTransactionsData = async () => {
            try {
                const data = await getIncomesExpenses(); 
                setCurrentTransactions(data);
            } catch(error) {
                console.error("Erro ao carregar transações:", error);
            }
        }

        getTransactionsData()
    },[])

    // Quando clicado fora das opções
    useEffect(() => {
        const handleClickRef = (event: MouseEvent) => {
            if (
                inputRef.current && 
                !inputRef.current.contains(event.target as Node) 
            ) {
                setOpenOptionsId(null)
            }
        }

        document.addEventListener("mousedown", handleClickRef)
    },[])

    // Atualiza as transações filtradas quando mudam os botões
    useEffect(() => {
        let filtered = currentTransactions

        if (expenseButton) {
            filtered = currentTransactions.filter(t => t.category === "Despesa")
        }
        else if (revenueButton) {
            filtered = currentTransactions.filter(t => t.category === "Receita")
        }

        setFilteredTransactions(filtered)
        setAblePages(Math.ceil(filtered.length / 4)) 
        setPageNumber(0)
    }, [currentTransactions, expenseButton, revenueButton])


    // Define os pedidos pelo periodo
    useEffect(() => {
        const loadOrders = async () => {
            const ordersData = await getOrders()

            const filteredOrders = ordersData.filter(order => {
                const orderDateStr = formatStringDateTime(order.date)
                return orderDateStr >= startDate && orderDateStr <= endDate
            })

            setOrders(filteredOrders)
        }

        loadOrders()
    },[endDate, startDate])
    
    // Estatísticas de comparação com o mês anterior
    useEffect(() => {
        const lastMonthComparison = async () => {
            const ordersData = await getOrders() 

            const today = new Date()
            today.setDate(today.getDate())
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)

            const lastMonthFirstDay = new Date(
                today.getFullYear(),
                today.getMonth() - 1,
                1
            )
            const lastMonthLastDay = new Date(
                today.getFullYear(),
                today.getMonth(),
                0
            )

            // Receita - Mês atual
            const filteredCurrentOrders = ordersData.filter(order => {
                const orderDateStr = formatStringDateTime(order.date)
                return (
                    orderDateStr >= formatDateString(firstDay) && 
                    orderDateStr <= formatDateString(lastDay)
                )
            })

            // Receita - Mês anterior
            const filteredLastOrders = ordersData.filter(order => {
                const orderDateStr = formatStringDateTime(order.date)
                return (
                    orderDateStr >= formatDateString(lastMonthFirstDay) && 
                    orderDateStr <= formatDateString(lastMonthLastDay)
                )
            })

            // Total do atual
            const currentTotal = filteredCurrentOrders.reduce((total, order) => 
                total += Number(order.value.split(" ")[1])
            , 0) + 1

            // Total do anterior
            const lastMonthTotal = filteredLastOrders.reduce((total, order) => 
                total += Number(order.value.split(" ")[1])
            , 0)
            
            const buildComparisionValue = (
                icon: React.ReactElement, 
                value: number,
                color: string,
                text: string
            ) => { 
                const roundedValue = Math.abs(value) < 0.01 ? 0 : value

                return (
                    <label 
                        className={styles.comparisionValue}
                        style={{color: color}}
                    >
                        {icon}
                        {roundedValue.toFixed(1)} % {text}
                    </label>
                )
            }

            let revenueComparision

            // ---------------- Receita ---------------- //
            // Mês atual melhor
            if (currentTotal >= lastMonthTotal) {                
                const revenueValue = lastMonthTotal === 0 ? 0 : (
                    ((currentTotal - lastMonthTotal) / lastMonthTotal) * 100
                )

                revenueComparision = buildComparisionValue(
                    <TrendingUpIcon/>, 
                    revenueValue,
                    "var(--primary)",
                    "em relação ao mês anterior"
                )
            }

            // Mês passado melhor
            else if(lastMonthTotal > currentTotal) {
                const revenueValue = currentTotal === 0 ? 0 : (
                    ((lastMonthTotal - currentTotal) / currentTotal) * 100
                )

                revenueComparision = buildComparisionValue(
                    <TrendingDownIcon/>, 
                    revenueValue,
                    "var(--error)",
                    "este mês"
                )
            }

            else {                
                revenueComparision = buildComparisionValue(
                    <TrendingUpIcon/>,
                    0,
                    "white",
                    "em relação ao mês anterior"
                )
            }
            // ---------------------------------------- //

            return [
                buildComparisionValue(
                    <TrendingDownIcon/>, 
                    1, 
                    "var(--error)",
                    "em relação ao mês anterior"
                ),
                revenueComparision,
                buildComparisionValue(
                    <TrendingDownIcon/>, 
                    0.5, 
                    "var(--error)",
                    "em relação ao mês anterior"
                )
            ]
        }

        const loadComparison = async () => {
            const result = await lastMonthComparison()
            setComparison(result)
        }

        loadComparison()
    }, [startDate, endDate, firstDay])

    //  ---- Valores Gerais ---- /
    const revenueTotal = orders.reduce((total, order) => {
        const formattedValue = Number(order.value.split(" ")[1])
        return total += formattedValue
    }, 0)
    // revenueTotal = 41072

    const expenseValue = 10000
    const resultValue = revenueTotal - expenseValue
    
    const info = [
        { 
            title: "Saldo Total", 
            value: resultValue, 
            icon: <Wallet2Icon />, 
            color: "var(--info)", 
        },
        { 
            title: "Receita Total", 
            value: revenueTotal, 
            icon: <ArrowUpIcon/>, 
            color: "var(--primary)" , 
        },
        { 
            title: "Despesa Total", 
            value: expenseValue, 
            icon: <ArrowDownIcon />, 
            color: "var(--error)" , 
        }
    ]
    //  ----------------------- /

    const createSummaryContainer = (
        title: string, 
        value: number, 
        icon: React.ReactNode,
        color: string,
    ) => {
        let comparisionValue

        if (title === "Saldo Total") {
            comparisionValue = comparison[0]
        }
        else if (title === "Receita Total") {
            comparisionValue = comparison[1]
        }
        else {
            comparisionValue = comparison[2]
        }

        return (
            <div className={styles.summaryContainer}>
                <>
                    <div>
                        <h3>{title}</h3>
                        <p>R$ {value.toFixed(2)}</p>
                        {comparisionValue}
                    </div>
                    <label>
                        <span
                            className={styles.iconWrapper}
                            style={{ backgroundColor: color }}
                        >
                            {icon}
                        </span>
                    </label>
                </>
            </div>
        )
    }

    const handleChangePages = (direction: string) => {
        if (direction === "back") {
            const current = pageNumber - 1
            if (current < 0) return 
            else setPageNumber(prev => prev -= 1)
        } else {
            const current = pageNumber + 1
            if (current >= ablePages) return 
            setPageNumber(prev => prev += 1)
        }
    }

    const handlePages = () => {
        const pages = []

        for (let i = 1; i <= ablePages; i++) {
            pages.push(i)
        }

        // Não tem mais de 5
        if (ablePages <= 4) {
            return(
                <>
                    <button
                        type="button"
                        onClick={() => handleChangePages("back")}
                    >
                        <ChevronLeftIcon />
                    </button>
                    {pages.map((page, index) => (
                        <p 
                            key={`${index}_${page}`}
                            onClick={() => setPageNumber(page - 1)}
                            className={page - 1 === pageNumber ? styles.activePage : ""}
                        >
                            {page}
                        </p>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleChangePages("front")}
                    >
                        <ChevronRightIcon />
                    </button>
                </>
            )
        }

        // Está nas 3 primeiras páginas
        else if (pageNumber + 1 < 4) {
            return (
                <>
                    <button 
                        type="button"
                        onClick={() => handleChangePages("back")}
                    >
                        <ChevronLeftIcon />
                    </button>
                    {pages.slice(0, 5).map((page, index) => ( 
                        <p 
                            key={`${index}_${page}`}
                            onClick={() => setPageNumber(page - 1)}
                            className={page - 1 === pageNumber ? styles.activePage : ""}
                        >
                            {page}
                        </p>
                    ))}
                    <button 
                        type="button"
                        onClick={() => setPageNumber(ablePages)}
                    >
                        ...
                    </button>
                    <button 
                        type="button"
                        onClick={() => handleChangePages("front")}
                    >
                        <ChevronRightIcon />
                    </button>
                </>
            )
        }

        // Está nas 3 últimas páginas
        else if(pageNumber + 1 > ablePages - 3) {
            return (
                <>
                    <button 
                        type="button"
                        onClick={() => handleChangePages("back")}
                    >
                        <ChevronLeftIcon />
                    </button>
                    <button 
                        type="button"
                        onClick={() => setPageNumber(0)}
                    >
                        ...
                    </button>
                </>
            )
        }

        else{
            return (
                <>
                    <button 
                        type="button"
                        onClick={() => handleChangePages("back")}
                    >
                        <ChevronLeftIcon />
                    </button>
                    <button 
                        type="button"
                        onClick={() => setPageNumber(0)}
                    >
                        ...
                    </button>
                    {pages.slice(pageNumber - 2, pageNumber + 3).map((page, index) => ( 
                        <p 
                            key={`${index}_${page}`}
                            onClick={() => setPageNumber(page - 1)}
                            className={page - 1 === pageNumber ? styles.activePage : ""}
                        >
                            {page}
                    </p>
                    ))}
                    <button 
                        type="button"
                        onClick={() => setPageNumber(ablePages - 1)}
                    >
                        ...
                    </button>
                    <button 
                        type="button"
                        onClick={() => handleChangePages("front")}
                    >
                        <ChevronRightIcon />
                    </button>
                </>
            )
        }
    }

    const pagesList = (page: number) => {
        const groupsList = []
        const jump = 4 

        for (let p = 0; p <= filteredTransactions.length; p += jump){
            groupsList.push(filteredTransactions.slice(p, p + jump))
        }
        return groupsList[page]
    }

    return (
        <MainTemplate>
            <Container>
                <div className={styles.header}>
                    <Title 
                        title="Financeiro"
                        subtitle="Gerencie o seu financeiro e controle suas receitas e gastos"
                    />
                    <div className={styles.addButton}>
                        <button
                            onClick={() => navigate("/financeiro/criar")}
                        >
                            + Criar conta
                        </button>
                    </div>
                </div>  

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

                <div className={styles.summary}>
                    {
                        info.map(c => createSummaryContainer(
                            c.title, c.value, c.icon, c.color
                        ))
                    }
                </div>

                <div className={styles.incomesExpensesContainer}>
                    <div className={styles.incomesExpensesHeader}>
                        <div className={styles.searchInput}>
                            <SearchIcon className={styles.searchIcon} />
                            <input
                                placeholder="Buscar trasação...."
                            />
                        </div>
                        <button
                            onClick={() => {
                                setRevenueButton(true)
                                setExpenseButton(false)
                            }}
                            disabled={revenueButton}
                            className={styles.revenueButton}
                        >
                            Receitas
                        </button>
                        <button
                            onClick={() => {
                                setRevenueButton(false)
                                setExpenseButton(true)
                            }}
                            disabled={expenseButton}
                            className={styles.expenseButton}
                        >
                            Despesas
                        </button>
                        <button
                            onClick={() => {
                                setRevenueButton(false)
                                setExpenseButton(false)
                            }}
                        >
                            Todos os Tipos
                        </button>
                        <div className={styles.filterOption}>
                            <FilterIcon/>
                        </div>
                    </div>

                    <div className={styles.incomesExpensesMain}>
                        <table>
                            <thead>
                                <tr>
                                    <th>DATA</th>
                                    <th>DESCRIÇÃO</th>
                                    <th>CATEGORIA</th>
                                    <th>CONTA</th>
                                    <th>VALOR</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagesList(pageNumber).map((incExp, index) => (
                                    <tr key={`${incExp.description}_${index}`}>
                                        <td>{incExp.date}</td>
                                        <td>{incExp.description}</td>
                                        <td
                                            className={incExp.category === "Receita" 
                                                ? styles.revenueCategory 
                                                : styles.expenseCategory
                                            }
                                        >
                                            <p>{incExp.category}</p>
                                        </td>
                                        <td>{incExp.account}</td>
                                        {
                                            incExp.category === "Receita" ? ( 
                                                <td className={styles.revenueValue }>
                                                    + R$ {incExp.value}
                                                </td> 
                                            ) : (
                                                <td className={styles.expenseValue }>
                                                    - R$ {incExp.value}
                                                </td> 
                                            )
                                        }
                                        <td>
                                            <div className={styles.optionsContainer} ref={inputRef}>
                                                <EllipsisVerticalIcon 
                                                    onClick={() => setOpenOptionsId(
                                                        openOptionsId === index ? null : index
                                                    )}
                                                />
                                                {openOptionsId === index && (
                                                    <div className={styles.options}>
                                                        <button>Editar</button>
                                                        <button>Excluir</button>
                                                    </div>  
                                                )}
                                            </div>
                                        </td>
                                    </tr>   
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredTransactions.length > 4 && (
                        <div className={styles.pagesContainer}>
                            <div className={styles.pagesHeader}>
                                <h3>Acesse mais Produtos: </h3>
                                <label>Página {pageNumber + 1} de {ablePages}</label>
                            </div>
                            
                            <div className={styles.pagesList}>
                                {handlePages()}
                            </div>
                        </div>
                    )}
                </div>
                
            </Container>
        </MainTemplate>
    )
}
