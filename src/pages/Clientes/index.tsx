
import { useEffect, useState } from "react"
import { Container } from "../../components/Container"
import { CustomersList } from "../../components/CustomersList"
import { Title } from "../../components/Title"
import { MainTemplate } from "../../templates/MainTemplate"
import styles from "./Clientes.module.css"
import { useNavigate } from "react-router"
import { PlusIcon } from "lucide-react"
import { Messages } from "../../components/Messages"
import { deleteCustomer, getCustomers, type Customer } from "../../services/customersApi"

export function Clientes() {
    const navigate = useNavigate();
    const [ customers, setCustomers ] = useState<Customer[]>([])
    const [ loading, setLoading ] = useState(true)
    
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

                <div className={styles.customersTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Celular</th>
                                <th>E-mail</th>
                                <th style={{ textAlign: 'center'}}>Pedidos Concluídos</th>
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
                                        <p>Sem Produtos disponíveis</p>
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