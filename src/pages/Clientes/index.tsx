
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
    const navigate = useNavigate();

    type Customer = {
        id: number,
        name: string,
        cpfCnpj: string,
        phone: string,
        email: string,
        pendingOrders: boolean,
        road?: string,
        num?: string,
        neighborhood?: string, 
        city?: string,
        state?: string,
        cep?: string,
        obs: string
    }


    useEffect(() => {
        document.title = "Clientes - Comanda"
    },[])

     
    const newCustomers = [
        {
            id: 1,
            name: "Maria Silva",
            cpfCnpj: "123.456.789-01", 
            phone: "(11) 99999-1111",
            email: "maria.silva@email.com",
            pendingOrders: false,
            road: "R. EXEMPLO 1",
            num: "100",
            neighborhood: "Bairro 1", 
            city: "Curitiba",
            state: "PR", 
            cep: "80000-000", 
            obs: "Cliente antigo, prefere retirada."
        },
        {
            id: 2, 
            name: "João Santos",
            cpfCnpj: "987.654.321-09", 
            phone: "(11) 98888-2222",
            email: "joao.santos@email.com",
            pendingOrders: true,
            road: "R. EXEMPLO 2",
            num: "200",
            neighborhood: "Bairro 2", 
            city: "Curitiba",
            state: "PR",
            cep: "81000-000",
            obs: "Ligar 30 minutos antes de entregar."
        },
        {
            id: 3,
            name: "Ana Costa",
            cpfCnpj: "11.222.333/0001-44", 
            phone: "(11) 97777-3333",
            email: "ana.costa@email.com",
            pendingOrders: true,
            road: "R. EXEMPLO 3",
            num: "300",
            neighborhood: "Bairro 3", 
            city: "Curitiba",
            state: "PR",
            cep: "82000-000",
            obs: "Empresa de eventos, grande volume de pedidos."
        },
        {
            id: 4,
            name: "Carlos Oliveira",
            cpfCnpj: "456.789.123-45", 
            phone: "(11) 96666-4444",
            email: "carlos.oliveira@email.com",
            pendingOrders: false,
            road: "R. EXEMPLO 4",
            num: "400",
            neighborhood: "Bairro 4", 
            city: "Curitiba",
            state: "PR",
            cep: "83000-000",
            obs: "Novo cliente."
        },
        {
            id: 5,
            name: "Fernanda Lima",
            cpfCnpj: "555.444.333-22", 
            phone: "(11) 95555-5555",
            email: "fernanda.lima@email.com",
            pendingOrders: false,
            road: "R. EXEMPLO 5",
            num: "500",
            neighborhood: "Bairro 5", 
            city: "Curitiba",
            state: "PR",
            cep: "84000-000",
            obs: "Não ligar antes das 10h."
        }
    ];

    const getCustomers = () => {
        const currentCustomersString = localStorage.getItem("customers")
        const currentCustomers = currentCustomersString 
            ? JSON.parse(currentCustomersString)
            : localStorage.setItem("customers", JSON.stringify(newCustomers))

        return currentCustomers
    }

    const [customers, setCustomers ] = useState(getCustomers())

    const removeCustomer = (filteredCustomer: Customer) => {
        const currentCustomers = [ ...customers ]
        
        const newCustomers = currentCustomers.filter(customer => 
            filteredCustomer.id !== customer.id
        )

        setCustomers(newCustomers)
        localStorage.setItem("customers", JSON.stringify(newCustomers))

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