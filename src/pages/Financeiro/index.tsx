import { ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, EllipsisVerticalIcon, FilterIcon, SearchIcon, TrendingDownIcon, TrendingUpIcon, Wallet2Icon } from "lucide-react"
import { Container } from "../../components/Container"
import { Title } from "../../components/Title"
import { MainTemplate } from "../../templates/MainTemplate"
import styles from "./Financeiro.module.css"
import CustomDatePicker from "../../components/CustomDatePicker"
import { useEffect, useMemo, useState } from "react"
import { formatDate, formatStringDateTime } from "../../utils/format-date"
import { getOrders, type Order } from "../../services/ordersApi"
import { deleteIncomeExpense, getIncomesExpenses, type Financial } from "../../services/financialApi"
import { useNavigate } from "react-router"
import { Messages } from "../../components/Messages"
import { DeleteConfirm } from "../../components/DeleteConfirm"

export function Financeiro () {  
    const navigate = useNavigate()

    const formatDateString = (date: Date) => {
        return date.toLocaleDateString("sv-SE");
    }

    const [ currentTransactions, setCurrentTransactions ] = useState<Financial[]>([])
    const [ filteredTransactions, setFilteredTransactions ] = useState<Financial[]>([])

    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const [ startDate, setStartDate ] = useState(formatDateString(firstDayOfMonth))
    const [ endDate, setEndDate ] = useState(formatDateString(lastDayOfMonth))  
    const [ orders, setOrders ] = useState<Order[]>([]) 

    const [ pageNumber, setPageNumber ] = useState(0)
    const [ ablePages, setAblePages ] = useState(1)

    const [ expenseButton, setExpenseButton ] = useState(false)
    const [ revenueButton, setRevenueButton ] = useState(false)

    const [ openOptionsId, setOpenOptionsId ] = useState<string | number | null>(null)

    const [ confirmDelete, setConfirmDelete ] = useState(false)
    const [ idToDeleteTransaction, setIdToDeleteTransaction ] = useState("")

    // Carrega as transações
    useEffect(() => {
        document.title = "Contas - Comanda"

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
            const target = event.target as HTMLElement;

            // Verifica se o clique NÃO foi dentro de um container de opções
            if (!target.closest(`.${styles.optionsContainer}`)) {
                setOpenOptionsId(null);
            }
        };

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


    // Atualiza os valores, segundo o período
    useEffect(() => {
        const loadFilteredOrders = async () => {
            const ordersData = await getOrders()

            const filteredOrders = ordersData.filter(order => {
                const orderDateStr = formatStringDateTime(order.date)
                return orderDateStr >= startDate 
                    && orderDateStr <= endDate
            })

            setOrders(filteredOrders)
        }

        const loadFilteredTransactions = async () => {
            const transactionsData = await getIncomesExpenses()

            const filteredOrders = transactionsData.filter(transaction => {
                const transactionDateStr = transaction.date
                return transactionDateStr >= startDate 
                    && transactionDateStr <= endDate
            })

            setCurrentTransactions(filteredOrders)
        }

        loadFilteredOrders()
        loadFilteredTransactions()
    },[endDate, startDate])
    
    //  ---- Receita Total ---- /
    const ordersRevenue = orders.reduce((total, order) => {
        const formattedValue = Number(order.value.split(" ")[1])
        return total += formattedValue
    }, 0)

    const manualRevenue = currentTransactions.reduce((total, transaction) => 
        transaction.category === "Receita" ? total += transaction.value : total
    , 0)

    const revenueTotal = useMemo(() => {
        return ordersRevenue + manualRevenue
    }, [manualRevenue, ordersRevenue])
    
    //  ---- Despesa Total ---- /
    const expenseValue = useMemo(() => {
        return currentTransactions.reduce((total, transaction) => 
            transaction.category === "Despesa" ? total += transaction.value : total
        , 0)
    }, [currentTransactions])

    // Verifica o valor mais caro das despesas
    const mostExpensiveExpense = currentTransactions.length > 0
        ? Math.max(...currentTransactions
            .filter(t => t.category === "Despesa")
            .map(t => t.value)
        )
        : 0
    
    // Atribui a despesa com o maior valor
    const mostExpensiveExpenseObject = currentTransactions.find(
        t => t.category === "Despesa" && t.value === mostExpensiveExpense
    )

    //  ---- Saldo Total ---- /
    const resultValue = revenueTotal - expenseValue

    const profitMargin = useMemo(() => {
        const profit = (resultValue / revenueTotal) * 100

        if (!profit) return 0
        else return profit
    },[resultValue, revenueTotal])
    
    const info = [
        { 
            title: "Saldo Total", 
            value: resultValue, 
            icon: <Wallet2Icon />, 
            color: "var(--info)", 
            extraInfo: resultValue > 0 
                ? (
                    <div className={styles.totalExtraInfo}>
                        <p className={styles.goodExtraInfo}>
                            Lucro: 
                            <label><TrendingUpIcon/> {profitMargin.toFixed(2)}%</label>
                        </p> 
                    </div>
                ) : (
                    <div className={styles.totalExtraInfo}> 
                        <p className={styles.badExtraInfo}>
                            Lucro: 
                            <label><TrendingDownIcon/> {profitMargin.toFixed(2)}%</label>
                        </p>
                    </div>
                ),
            resultIcon: resultValue > 0 
                ? <TrendingUpIcon style={{color:"var(--primary)"}}/> 
                : <TrendingDownIcon style={{color:"var(--error)"}}/>
        },
        { 
            title: "Receita Total", 
            value: revenueTotal, 
            icon: <ArrowUpIcon/>, 
            color: "var(--primary)",
            extraInfo: 
                <div className={styles.revenueExtraInfo}>
                    <p>
                        Pedidos: 
                        <label className={styles.revenueExtraText}>
                            R${ordersRevenue.toFixed(2)}
                        </label>
                    </p>
                    <p className={styles.revenueInfo}>
                        Transações adicionais: 
                        <label className={styles.revenueExtraText}>
                            R${manualRevenue.toFixed(2)}
                        </label>
                    </p>
                </div>
        },
        { 
            title: "Despesa Total", 
            value: expenseValue, 
            icon: <ArrowDownIcon />, 
            color: "var(--error)",
            extraInfo: 
                <div className={styles.expenseExtraInfo}>
                    <p>
                        Maior Gasto: 
                        <label>
                            {mostExpensiveExpenseObject?.description} 
                        </label>
                        <label className={styles.expenseInfoValue}>
                            R${mostExpensiveExpenseObject?.value}
                        </label>
                    </p>
                </div>
        }
    ]
    //  ----------------------- /

    const createSummaryContainer = (
        title: string, 
        value: number, 
        icon: React.ReactNode,
        color: string,
        extraInfo: React.ReactNode,
        resultIcon?: React.ReactNode
    ) => {
        return (
            <div className={styles.summaryContainer}>
                <>
                    <div>
                        <h3>{title}</h3>
                        {
                            title === "Saldo Total" 
                                ? <p className={styles.resultText}>
                                    {resultIcon} R$ {value.toFixed(2)}
                                  </p>
                                : <p>R$ {value.toFixed(2)}</p>
                            
                        }
                        <hr />
                        {extraInfo}
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

    const removeTransaction = async (id: string) => {
        try {
            if (!id) {
                console.log("❌ Transação sem _id:")
                return 
            }

            await deleteIncomeExpense(id)

            setCurrentTransactions(prev => 
                prev.filter(transaction => transaction._id !== id)
            )

            Messages.success("Transação excluída com sucesso")
            setConfirmDelete(false)
        } catch(error) {
            console.log("Erro ao excluir transação:", error)
            Messages.error("Erro ao excluir a transação")
        }
    }

    const handleDelete = (id: string) => {
        setConfirmDelete(true)
        setIdToDeleteTransaction(id)
    }

    return (
        <MainTemplate>
            <Container>
                {confirmDelete && (
                    <DeleteConfirm 
                        name="Transação" 
                        setOpenConfirm={setConfirmDelete}
                        removeRegister={removeTransaction}
                        register={idToDeleteTransaction}
                        setShowRegister={setConfirmDelete} // Mesma função do setOpenConfirm
                    />
                )}

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
                            c.title, c.value, c.icon, c.color, c.extraInfo, c.resultIcon
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
                                {filteredTransactions.length > 0 ? 
                                    (
                                        pagesList(pageNumber).map((incExp, index) => (
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
                                                    <div className={styles.optionsContainer}>
                                                        <EllipsisVerticalIcon 
                                                            onClick={() => setOpenOptionsId(
                                                                openOptionsId === index ? null : index
                                                            )}
                                                        />
                                                        {openOptionsId === index && (
                                                            <div className={styles.options}>
                                                                <button
                                                                    onClick={() => 
                                                                        navigate(
                                                                            `/financeiro/editar/${incExp._id}`
                                                                        )
                                                                    }
                                                                >Editar</button>
                                                                <button
                                                                    onClick={
                                                                        () => handleDelete(
                                                                            incExp._id!
                                                                        )}
                                                                >
                                                                    Excluir
                                                                </button>
                                                            </div>  
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>   
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6}
                                                className={styles.noRegister}
                                            >
                                                Sem contas disponíveis
                                            </td>
                                        </tr>
                                    ) 
                                }
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
