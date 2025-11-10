
import { useEffect, useState } from "react"
import { Container } from "../../components/Container"
import { CustomersList } from "../../components/CustomersList"
import { Title } from "../../components/Title"
import { MainTemplate } from "../../templates/MainTemplate"
import styles from "./Clientes.module.css"
import { useNavigate } from "react-router"
import { ChevronDownIcon, PlusIcon, SearchIcon } from "lucide-react"
import { Messages } from "../../components/Messages"
import { deleteCustomer, getCustomers, type Customer } from "../../services/customersApi"

export function Clientes() {
    const navigate = useNavigate();
    const [ customers, setCustomers ] = useState<Customer[]>([])
    const [ loading, setLoading ] = useState(true)

    const [ nameIsDown, setNameIsDown ] = useState(true);
    const [ phoneIsDown, setPhoneIsDown] = useState(true);
    const [ emailIsDown, setEmailIsDownIsDown ] = useState(true);
    const [ concluedOrderIsDown, setConcluedOrderIsDown ] = useState(true);
    
    useEffect(() => {
        document.title = "Clientes - Comanda"
        loadCustomers()
    },[])

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

    const removeCustomer = async (filteredCustomer: Customer) => {
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

    const handleChange = async (customerName: string) => {
        const currentCustomers = await getCustomers()

        if (customerName && customerName.trim() === "") {
            setCustomers(currentCustomers)
        } else {
            const normalizeText = (text: string) =>(
                text.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            )

            const filteredCustomers = currentCustomers.filter(customer => (
                normalizeText(customer.name.toLowerCase())
                .includes(normalizeText(customerName.toLowerCase()))
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
                        a.email.localeCompare(b.email)
                    )
                    setCustomers(sortedList)
                    setEmailIsDownIsDown(false)

                    setNameIsDown(true)
                    setPhoneIsDown(true)
                    setConcluedOrderIsDown(true)
                } else {
                    const sortedList = [...customers].sort((a, b) => 
                        b.email.localeCompare(a.email)
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

    return(
        <MainTemplate>
            <Container>
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
                                <th>Ações</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {customers.length > 0 ? (
                                <CustomersList 
                                    customersList={customers}
                                    removeCustomer={removeCustomer}
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
            </Container>
        </MainTemplate>   
    )
}