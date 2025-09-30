
import { useEffect } from "react"
import { Container } from "../../components/Container"
import { CustomersList } from "../../components/CustomersList"
import { Title } from "../../components/Title"
import { MainTemplate } from "../../templates/MainTemplate"
import styles from "./Clientes.module.css"



export function Clientes() {
    useEffect(() => {
        document.title = "Clientes - Comanda"
    },[])

    const clientes = {
        1: {
            nome: "Maria Silva",
            celular: "(11) 99999-1111",
            email: "maria.silva@email.com",
            pedidosPendentes: 2,
        },
        2: {
            nome: "João Santos",
            celular: "(11) 98888-2222",
            email: "joao.santos@email.com",
            pedidosPendentes: 1,
        },
        3: {
            nome: "Ana Costa",
            celular: "(11) 97777-3333",
            email: "ana.costa@email.com",
            pedidosPendentes: 3,
        },
        4: {
            nome: "Carlos Oliveira",
            celular: "(11) 96666-4444",
            email: "carlos.oliveira@email.com",
            pedidosPendentes: 0,
        },
        5: {
            nome: "Fernanda Lima",
            celular: "(11) 95555-5555",
            email: "fernanda.lima@email.com",
            pedidosPendentes: 1,
        }
    };

    return(
        <MainTemplate>
            <Container>
                <div className={styles.header}>
                    <Title title={"Clientes"} subtitle={"Cadastro de Clientes"} />
                    <button>Adicionar Cliente</button>
                </div>

                <div className={styles.customersTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Celular</th>
                                <th>E-mail</th>
                                <th style={{ textAlign: 'center'}}>Pedidos Pendentes</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            <CustomersList customersList={clientes}/>                               
                        </tbody>
                    </table>
                </div>
            </Container>
        </MainTemplate>   
    )
}