
import { useEffect, useState } from "react"
import { Container } from "../../components/Container"
import { CustomersList } from "../../components/CustomersList"
import { Title } from "../../components/Title"
import { MainTemplate } from "../../templates/MainTemplate"
import styles from "./Clientes.module.css"
import { useNavigate } from "react-router"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, ListFilterIcon, PlusIcon, SearchIcon } from "lucide-react"
import { Messages } from "../../components/Messages"
import { deleteCustomer, getCustomers, type Customer } from "../../services/customersApi"
import { CompleteCustomer } from "../../components/CompleteCustomer"
import { MediaQueryCustomerList } from "../../components/MediaQueryCustomerList"

export function Clientes() {
    const navigate = useNavigate();

    const [ isMobile, setIsMobile ] = useState(false);

    const [ customers, setCustomers ] = useState<Customer[]>([])
    const [ loading, setLoading ] = useState(true)
    const [ activeFilter, setActiveFilter ] = useState("Date");

    const [ pageNumber, setPageNumber ] = useState(0)
    const [ ablePages, setAblePages ] = useState(1)

    const [ nameIsDown, setNameIsDown ] = useState(true);
    const [ phoneIsDown, setPhoneIsDown] = useState(true);
    const [ emailIsDown, setEmailIsDownIsDown ] = useState(true);
    const [ concluedOrderIsDown, setConcluedOrderIsDown ] = useState(true);

    const [ showCustomer, setShowCustomer ] = useState(false)
    const [ customer, setCustomer ] =  useState<Customer>()
    
    // Título e Mídia Query
    useEffect(() => {
        document.title = "Clientes - Comanda"
        loadCustomers()

        // Telas menores de 1050px (Mobile)
        const mediaQueryMobile = window.matchMedia("(max-width: 1600px)")
        setIsMobile(mediaQueryMobile.matches)

        const handleResizeMobile = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches)
        }

        mediaQueryMobile.addEventListener("change", handleResizeMobile)

        return () => {
            mediaQueryMobile.removeEventListener("change", handleResizeMobile)
        }
    },[])

    // Rodapé das páginas
    useEffect(() => {
        if ( customers.length <= 1) setAblePages(1)
        else {
            const numberOfPages = Math.ceil(customers.length / 15)
            setAblePages(numberOfPages)
        }
    },[customers, setAblePages])

    const loadCustomers = async () => {
        try{
            const customers = await getCustomers()
            setCustomers(customers)
        } catch(error) {
            console.log(`Erro ao buscar clientes`, error)
            Messages.error("Erro ao buscar clientes")
        } finally {
            setLoading(false)
        }
    }

    const pagesList = (page: number) => {
        const groupsList = []

        const jump = 15
        for (let i = 0; i < customers.length; i += jump) {
            groupsList.push(customers.slice(i, i + jump))
        }
        return groupsList[page]
    }

    const removeCustomer = async (filteredCustomer: Customer) => {
        setPageNumber(0)

        try {
            if (!filteredCustomer._id) {
                console.log("❌ Produto sem _id:", filteredCustomer);
                return 
            }  

            await deleteCustomer(filteredCustomer._id)

            setCustomers(prevCustomers => prevCustomers.filter(customer => 
                filteredCustomer._id !== customer._id
            ))
            Messages.success("Cliente excluído com sucesso")
        } catch(error) {
            console.log(`Não foi possível excluir o cliente ${filteredCustomer._id}:`, error)
            Messages.error("Erro ao excluir cliente")
        }
    }

    const handleChange = async (input: string) => {
        const currentCustomers = await getCustomers()

        if (input && input.trim() === "") {
            setCustomers(currentCustomers)
        } else {
            const normalizeText = (text: string) =>(
                text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            )

            const filteredCustomers = currentCustomers.filter(customer => (
                normalizeText(customer.name.toLowerCase())
                .includes(normalizeText(input.toLowerCase()))
                || customer.phone.includes(input)
            ))

            setCustomers(filteredCustomers)
        }
    }

    const thHandleClick = (th: string) => {
        switch(th) {
            case "Name": {
                if (nameIsDown){
                    const sortedList = [...customers].sort((a, b) => 
                        a.name.localeCompare(b.name)
                    )
                    setCustomers(sortedList)
                    setNameIsDown(false)

                    setPhoneIsDown(true)
                    setEmailIsDownIsDown(true)
                    setConcluedOrderIsDown(true)
                } else {
                    const sortedList = [...customers].sort((a, b) => 
                        b.name.localeCompare(a.name)
                    )
                    setCustomers(sortedList)
                    setNameIsDown(true)
                } 
                break
            }
            case "Phone": {
                if (phoneIsDown){
                    const sortedList = [...customers].sort((a, b) => 
                        a.phone.localeCompare(b.phone)
                    )
                    setCustomers(sortedList)
                    setPhoneIsDown(false)

                    setNameIsDown(true)
                    setConcluedOrderIsDown(true)
                    setEmailIsDownIsDown(true)
                } else {
                    const sortedList = [...customers].sort((a, b) => 
                        b.phone.localeCompare(a.phone)
                    )
                    setCustomers(sortedList)
                    setPhoneIsDown(true)
                } 
                break
            }
            case "Email": {
                if (emailIsDown){
                    const sortedList = [...customers].sort((a, b) => 
                        a.email!.localeCompare(b.email!)
                    )
                    setCustomers(sortedList)
                    setEmailIsDownIsDown(false)

                    setNameIsDown(true)
                    setPhoneIsDown(true)
                    setConcluedOrderIsDown(true)
                } else {
                    const sortedList = [...customers].sort((a, b) => 
                        b.email!.localeCompare(a.email!)
                    )
                    setCustomers(sortedList)
                    setEmailIsDownIsDown(true)
                } 
                break
            }
            case "ConcluedOrder": {
                if (concluedOrderIsDown){
                    const sortedList = [...customers].sort((a, b) => 
                        Number(a.pendingOrders) - Number(b.pendingOrders)
                    )
                    setCustomers(sortedList)
                    setConcluedOrderIsDown(false)

                    setNameIsDown(true)
                    setPhoneIsDown(true)
                    setEmailIsDownIsDown(true)
                } else {
                    const sortedList = [...customers].sort((a, b) => 
                        Number(b.pendingOrders) - Number(a.pendingOrders)
                    )
                    setCustomers(sortedList)
                    setConcluedOrderIsDown(true)
                } 
                break 
            }              
        }
    }

    const handleClickClass = (isDown: boolean) => {
        return isDown ? `${styles.icon}` : `${styles.icon} ${styles.isUp}`
    }

    const handleClickCustomer = (customer: Customer) => {
        setShowCustomer(true)
        setCustomer(customer)
    } 

    const handleMobileFilterClick = (filterType: string) => {
        thHandleClick(filterType)
        setActiveFilter(filterType)
    }
    
    const handlePages = () => {
        const pages = []

        for (let i = 1; i <= ablePages; i++) {
            pages.push(i)
        }

        document.querySelector("main")?.scroll({top: 0, behavior: "smooth"})
        console.log("pageNumber:", pageNumber)

        // Não tem mais de 5
        if (ablePages < 5) {
            return (
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

        // Está nas 3 últimas páginas
        else if (pageNumber + 1 > ablePages - 3) {
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
                    {pages.slice(ablePages - 5, ablePages).map((page, index) => ( 
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

        document.querySelector("main")?.scroll({top: 0, behavior: "smooth"})
    }


    if (loading) {
        return (
            <MainTemplate>
                <Container>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        Carregando clientes...
                    </div>
                </Container>
            </MainTemplate>
        );
    }

    if (isMobile){
        return(
            <MainTemplate>
                <Container>
                    {showCustomer && (
                        <CompleteCustomer 
                            customer={customer!}
                            removeCustomer={removeCustomer}
                            setShowCustomer={setShowCustomer}
                        />
                    )}

                    <div className={styles.header}>
                        <Title title={"Clientes"} subtitle={"Cadastro de Clientes"} />
                        <button 
                            onClick={() => navigate("/clientes/criar")}
                            className={styles.mobileAddButton}
                        >
                            <PlusIcon/>
                        </button>
                    </div>

                    <div className={styles.searchCustomer}>
                        <SearchIcon className={styles.searchIcon} />
                        <input 
                            onChange={e => handleChange(e.target.value)}
                            placeholder="Buscar cliente"
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
                                <button onClick={() => {handleMobileFilterClick("Phone")}}>
                                    Celular
                                    <ChevronDownIcon
                                        className={handleClickClass(phoneIsDown)}
                                        style={{
                                            opacity: activeFilter === "Phone" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </button>
                                <button onClick={() => {handleMobileFilterClick("Email")}}>
                                    E-mail
                                    <ChevronDownIcon
                                        className={handleClickClass(emailIsDown)}
                                        style={{
                                            opacity: activeFilter === "Email" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </button>
                                <button onClick={() => {handleMobileFilterClick("ConcluedOrder")}}>
                                    Pedidos Concluídos
                                    <ChevronDownIcon
                                        className={handleClickClass(concluedOrderIsDown)}
                                        style={{
                                            opacity: activeFilter === "ConcluedOrder" ? 1 : 0,
                                            pointerEvents: 'none'
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className={styles.MobileList}>
                            <MediaQueryCustomerList
                                customersList={customers}
                                handleClickCustomer={handleClickCustomer}
                            />
                        </div>
                    </div>
                </Container>
            </MainTemplate>   
        )
    }

    return(
        <MainTemplate>
            <Container>
                {showCustomer && (
                    <CompleteCustomer 
                        customer={customer!}
                        removeCustomer={removeCustomer}
                        setShowCustomer={setShowCustomer}
                    />
                )}

                <div className={styles.header}>
                    <Title title={"Clientes"} subtitle={"Cadastro de Clientes"} />
                    <button onClick={() => navigate("/clientes/criar")}>
                        <PlusIcon/> Adicionar Cliente
                    </button>
                </div>

                <div className={styles.searchCustomer}>
                    <SearchIcon className={styles.searchIcon} />
                    <input 
                        onChange={e => handleChange(e.target.value)}
                        placeholder="Buscar cliente"
                    />
                </div>

                <div className={styles.customersTable}>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => {thHandleClick("Name")}}>
                                    Nome 
                                    <ChevronDownIcon className={handleClickClass(nameIsDown)}/>
                                </th>
                                <th onClick={() => thHandleClick("Phone")}>
                                    Celular 
                                    <ChevronDownIcon className={handleClickClass(phoneIsDown)}/>
                                </th>
                                <th onClick={() => thHandleClick("Email")}>
                                    E-mail 
                                    <ChevronDownIcon className={handleClickClass(emailIsDown)}/>
                                </th>
                                <th 
                                    onClick={() => thHandleClick("ConcluedOrder")} 
                                    style={{ textAlign: 'center'}}
                                >
                                    Pedidos Concluídos 
                                    <ChevronDownIcon 
                                        className={handleClickClass(concluedOrderIsDown)}
                                    />
                                </th>
                                <th></th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {customers.length > 0 ? (
                                <CustomersList 
                                    handleClickCustomer={handleClickCustomer}
                                    pageNumber={pageNumber}
                                    pagesList={pagesList}
                                />   
                            ) : (
                                <tr>
                                    <td className={styles.noCustomers}>
                                        <p>Sem Clientes disponíveis</p>
                                    </td>
                                </tr>
                            )}
                                                        
                        </tbody>
                    </table>
                </div>

                {customers.length > 15 && (
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
            </Container>
        </MainTemplate>   
    )
}