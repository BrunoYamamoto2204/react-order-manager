import { ArrowDownIcon, ArrowUpIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, EllipsisVerticalIcon, ListFilterIcon, MenuIcon, PlusIcon, SearchIcon, TrendingDownIcon, TrendingUpIcon, Wallet2Icon } from "lucide-react"
import { Container } from "../../components/Container"
import { Title } from "../../components/Title"
import { MainTemplate } from "../../templates/MainTemplate"
import styles from "./Financeiro.module.css"
import CustomDatePicker from "../../components/CustomDatePicker"
import { useEffect, useMemo, useState } from "react"
import { formatDate, formatMobileDate, formatStringDateTime } from "../../utils/format-date"
import { getOrders, type Order } from "../../services/ordersApi"
import { deleteIncomeExpense, getIncomesExpenses, type Financial } from "../../services/financialApi"
import { useNavigate } from "react-router"
import { Messages } from "../../components/Messages"
import { CompleteTransaction } from "../../components/CompleteTransaction"

export function Financeiro () {  
    const navigate = useNavigate()

    const formatDateString = (date: Date) => {
        return date.toLocaleDateString("sv-SE");
    }

    const [ isMobile, setIsMobile ] = useState(false)
    const [ isTablet, setIsTablet ] = useState(false);

    const [ openDateFilter, setOpenDateFilter ] = useState(false)
    const [ mobileOpenDateFilter, setMobileOpenDateFilter ] = useState(false)

    // Contas filtradas por data
    const [ currentTransactions, setCurrentTransactions ] = useState<Financial[]>([])
    // Contas filtradas por parametros
    const [ filteredTransactions, setFilteredTransactions ] = useState<Financial[]>([])

    const [ showTransaction, setShowTransaction ] = useState(false)
    const [ transaction, setTransaction ] =  useState<Financial>()

    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)

    const [ startDate, setStartDate ] = useState(formatDateString(firstDayOfMonth))
    const [ endDate, setEndDate ] = useState(formatDateString(lastDayOfMonth))  
    const [ orders, setOrders ] = useState<Order[]>([]) 

    const [ pageNumber, setPageNumber ] = useState(0)
    const [ ablePages, setAblePages ] = useState(1)

    const [ searchInput, setSearchInput ] = useState("")
    const [ expenseButton, setExpenseButton ] = useState(false)
    const [ revenueButton, setRevenueButton ] = useState(false)

    // const [ confirmDelete, setConfirmDelete ] = useState(false)
    // const [ idToDeleteTransaction, setIdToDeleteTransaction ] = useState("")

    useEffect(() => {
        document.title = "Contas - Comanda"

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

    // Atualiza as transações filtradas quando mudam os botões
    useEffect(() => {
        let filtered = currentTransactions
    
        // 1 - Valida qual está selecionada
        if (expenseButton) {
            filtered = currentTransactions.filter(t => t.category === "Despesa")
        } else if (revenueButton) {
            filtered = currentTransactions.filter(t => t.category === "Receita")
        }

        // 2 - Valida correspondencia com a barra de buscar
        if (searchInput.trim() != ""){
            filtered = filtered.filter(t => 
                t.description.toLowerCase().includes(searchInput.toLowerCase())
                || t.value.toFixed(2).includes(searchInput)
            )
        }

        setFilteredTransactions(filtered)
        setAblePages(Math.ceil(filtered.length / 4)) 
        setPageNumber(0)
    }, [currentTransactions, expenseButton, revenueButton, searchInput])


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
                ? ( isTablet ? (
                        <p className={`${styles.totalExtraInfoMQ} ${styles.goodExtraInfoMQ}`}>
                            Lucro:
                            <TrendingUpIcon/>
                        </p>
                    ) : ( 
                        <div className={styles.totalExtraInfo}>
                            <p className={styles.goodExtraInfo}>
                                Lucro: 
                                <label><TrendingUpIcon/> {profitMargin.toFixed(2)}%</label>
                            </p> 
                        </div>
                    )
                ) : ( isTablet ? (
                        <div>
                            <p className={`${styles.totalExtraInfoMQ} ${styles.badExtraInfoMQ}`}>
                                <TrendingDownIcon/>Lucro {profitMargin.toFixed(2)}%
                            </p>
                        </div>
                    ) : (
                        <div className={styles.totalExtraInfo}> 
                            <p className={styles.badExtraInfo}>
                                Lucro: 
                                <label><TrendingDownIcon/> {profitMargin.toFixed(2)}%</label>
                            </p>
                        </div>
                    )
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
                            R$ {ordersRevenue.toFixed(2)}
                        </label>
                    </p>
                    <p className={styles.revenueInfo}>
                        Transações adicionais: 
                        <label className={styles.revenueExtraText}>
                            R$ {manualRevenue.toFixed(2)}
                        </label>
                    </p>
                </div>,
            resultIcon: <ArrowUpIcon />
        },
        { 
            title: "Despesa Total", 
            value: expenseValue, 
            icon: <ArrowDownIcon />, 
            color: "var(--error)",
            extraInfo: 
                <div className={styles.expenseExtraInfo}>
                    <p>
                        {isTablet ? (
                            <div className={styles.expenseExtraInfoMQ}>
                                Maior Gasto: 
                                <label>
                                    {mostExpensiveExpenseObject?.description} 
                                </label>
                            </div>
                        ) : (
                            <>
                                Maior Gasto: 
                                <label>
                                    {mostExpensiveExpenseObject?.description} 
                                </label>
                            </>
                            )
                        }
                        
                        <label className={styles.expenseInfoValue}>
                            R${mostExpensiveExpenseObject?.value}
                        </label>
                    </p>
                </div>,
            resultIcon: <ArrowDownIcon />
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
        let iconStyle;
        
        if (title === "Receita Total") {
            iconStyle = <div className={`${styles.iconBox} ${styles.iconBoxRevenue}`}>
                {resultIcon}
            </div>
        } else if (title === "Despesa Total") {
            iconStyle = <div className={`${styles.iconBox} ${styles.iconBoxIncome}`}>
                {resultIcon}
            </div>
        }

        if (isTablet) {
            return (
                <div>
                    <div className={`${styles.summaryContainerMQ} 
                        ${title === "Saldo Total" && styles.summaryMainContainerMQ}`}>
                        { 
                            title === "Saldo Total"
                                ? ( 
                                    <div className={styles.totalheaderCardMQ}>
                                        <h3>{title}</h3>
                                        <p className={styles.resultText}>
                                            R$ {value.toFixed(2)}
                                        </p>
                                        {extraInfo}
                                    </div>
                                ) : (
                                    <>
                                        <div className={styles.headerCardContainerMQ}>
                                            {iconStyle}
                                            <div className={styles.headerCardMQ}>
                                                <label>{title}</label>
                                                <p>R$ {value.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <hr />
                                        {extraInfo}
                                    </>
                                )
                            }
                    </div>
                </div>
            )
        } else {
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

    const handleClickTransaction = (transaction: Financial) => {
        setShowTransaction(true)
        setTransaction(transaction)
    }  

    const removeTransaction = async(filteredTransaction: Financial) => {
        setPageNumber(0)

        try {
            if (!filteredTransaction._id) {
                console.log("❌ Transação sem _id:", filteredTransaction);
                return
            }

            await deleteIncomeExpense(filteredTransaction._id)
            Messages.success("Transação excluída com sucesso")
        } catch(error){
            console.log("Erro ao excluir transação: ", error)
            Messages.error("Erro ao excluir transação")
        }

        setFilteredTransactions(prev => prev.filter(t => t._id != filteredTransaction._id))
    }

    return (
        <MainTemplate>
            <Container>
                {/* MediaQuery: Tela de seleção de data */}
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

                {showTransaction && (
                    <CompleteTransaction 
                        transaction={transaction!}
                        removeTransaction={removeTransaction}
                        setShowTransaction={setShowTransaction}
                    />
                )}

                <div className={styles.header}>
                    <Title 
                        title="Financeiro"
                        subtitle="Gerencie o seu financeiro e controle suas receitas e gastos"
                    />
                    
                        {isMobile ? (
                            <div className={styles.mobileButtons}>
                            <button
                                onClick={() => navigate("/financeiro/criar")}
                                className={styles.mobileAddButton}
                            >
                                <PlusIcon/>
                            </button>
                        </div>
                        ) : (
                            <div className={styles.addButton}>
                            <button
                                onClick={() => navigate("/financeiro/criar")}
                                className={styles.mobileAddButton}
                            >
                                + Criar conta
                            </button>
                            </div>
                        )}
                        
                    
                </div>  
                
                {/* Filtro de data */}
                <div className={styles.analysisDate}>
                    {isMobile ? (
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
                                        setStartDate(startDate)
                                        setEndDate(endDate)
                                    }}
                                >
                                    Limpar Filtro
                                </p>
                            )}
                        </div>
                    ) : (
                        <>
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
                        </>
                    )}
                    
                </div>

                {/* Cards resumo */}
                <div className={styles.summary}>
                    {
                        info.map(c => createSummaryContainer(
                            c.title, c.value, c.icon, c.color, c.extraInfo, c.resultIcon
                        ))
                    }
                </div>
                
                {/* Contas */}
                <div className={styles.incomesExpensesContainer}>
                    {/* Opcoes de filtro */}
                    <div className={styles.incomesExpensesHeader}>
                        <div className={styles.searchInput}>
                            <SearchIcon className={styles.searchIcon} />
                            <input
                                onChange={e => setSearchInput(e.target.value)}
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
                            <ArrowUpIcon /> Receitas
                        </button>
                        <button
                            onClick={() => {
                                setRevenueButton(false)
                                setExpenseButton(true)
                            }}
                            disabled={expenseButton}
                            className={styles.expenseButton}
                        >
                            <ArrowDownIcon /> Despesas
                        </button>
                        <button
                            onClick={() => {
                                setRevenueButton(false)
                                setExpenseButton(false)
                            }}
                            className={styles.allButton}
                        >
                            <MenuIcon /> Todos os Tipos
                        </button>
                        {/* {isMobile ? (
                            <div className={styles.filterOption}>
                                <p><FilterIcon/> Filtro Avançado</p>
                            </div>
                        ) : (
                            <div className={styles.filterOption}>
                                <FilterIcon/>
                            </div>
                        )} */}
                        
                    </div>
                    
                    {/* Lista de contas */}
                    {isMobile ? (
                        <div className={styles.incomesExpensesMainMQ}>
                            {filteredTransactions.length > 0 ? (
                                pagesList(pageNumber).map((incExp, index) => (
                                    <div 
                                        className={styles.transactionContainerMQ} 
                                        key={`${index}_${incExp.description}`}
                                        onClick={() => handleClickTransaction(incExp)}
                                    >   
                                        <div
                                            className={styles.dateTypeMQ}
                                        >
                                            <p className={styles.dateMQ}>
                                                {formatMobileDate(incExp.date)}
                                            </p>
                                            <p
                                                className={incExp.category === "Receita"
                                                    ? `${styles.typeMQ} ${styles.revenueTypeMQ}` 
                                                    : `${styles.typeMQ} ${styles.incomeTypeMQ}`}
                                            >
                                                {incExp.category}
                                            </p>
                                        </div>
                                        
                                        <div className={styles.categoryAccountMQ}>
                                            <p
                                                className={incExp.category === "Receita"
                                                    ? styles.revenueTypeIconMQ
                                                    : styles.incomeTypeIconMQ}
                                            >
                                                {incExp.category === "Despesa" ? (
                                                    <ArrowDownIcon />
                                                ) : (
                                                    <ArrowUpIcon />
                                                ) }
                                            </p>
                                            <div className={styles.accountMQ}>
                                                <p>{incExp.description}</p>
                                                <label>{incExp.account}</label>
                                            </div>
                                        </div>

                                        <p className={styles.valueMQ}>
                                            R$ {incExp.value.toFixed(2).replace(".",",")}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p>
                                    Sem contas disponíveis
                                </p>
                            )}
                        </div>
                    ) : (
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
                                                                onClick={() => handleClickTransaction(incExp)}
                                                            />
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
                    )}
                    

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
