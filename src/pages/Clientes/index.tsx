
import { useEffect, useState } from "react"
import { Container } from "../../components/Container"
import { CustomersList } from "../../components/CustomersList"
import { Title } from "../../components/Title"
import { MainTemplate } from "../../templates/MainTemplate"
import styles from "./Clientes.module.css"
import { useNavigate } from "react-router"
import { PlusIcon } from "lucide-react"
import { Messages } from "../../components/Messages"



export function Clientes() {
    type Customer = {
        id: number,
        name: string,
        phone: string,
        email: string,
        pendingOrders: boolean,
    }

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Clientes - Comanda"
    },[])

    const [customers, setCustomers ] = useState([
        {
            id: 1,
            name: "Maria Silva",
            phone: "(11) 99999-1111",
            email: "maria.silva@email.com",
            pendingOrders: false,
        },
        {
            id: 2,
            name: "João Santos",
            phone: "(11) 98888-2222",
            email: "joao.santos@email.com",
            pendingOrders: true,
        },
        {
            id: 3,
            name: "Ana Costa",
            phone: "(11) 97777-3333",
            email: "ana.costa@email.com",
            pendingOrders: true,
        },
        {
            id: 4,
            name: "Carlos Oliveira",
            phone: "(11) 96666-4444",
            email: "carlos.oliveira@email.com",
            pendingOrders: false,
        },
        {
            id: 5,
            name: "Fernanda Lima",
            phone: "(11) 95555-5555",
            email: "fernanda.lima@email.com",
            pendingOrders: false,
        }
    ]);

    const removeCustomer = (filteredCustomer: Customer) => {
        const currentCustomers = [ ...customers ]
        
        const newCustomers = currentCustomers.filter(customer => 
            filteredCustomer.id !== customer.id
        )

        setCustomers(newCustomers)

        Messages.success("Cliente excluído com sucesso")
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
                            <CustomersList 
                                customersList={customers}
                                removeCustomer={removeCustomer}
                            />                               
                        </tbody>
                    </table>
                </div>
            </Container>
        </MainTemplate>   
    )
}