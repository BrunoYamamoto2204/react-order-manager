import { Container } from "../../components/Container";
import { MainTemplate } from "../../templates/MainTemplate";

// import styles from "../../components/OrdersList/OrdersList.module.css"
import styles from "./Pedidos.module.css"
import { OrdersList } from "../../components/OrdersList";
import { Title } from "../../components/Title";
import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Messages } from "../../components/Messages";

export function Pedidos() {
    type Order = {
        id: number,
        name: string,
        date: string,
        products: string[],
        value: string,
        status: string
    }

    const navigate = useNavigate();
    
    useEffect(() => {
        document.title = "Comanda - Pedidos"
    },[])

    const [ orders, setOrders ] = useState<Order[]>([
        {
            id: 1,
            name: "Cliente 1",
            date: "31/08/2025",
            products: [
                "1Kg Bolo",
                "30 Brigadeiros",
                "40 Coxinhas",
                "20 Esfihas",
                "1 Torta Doce",
                "1Kg Mousse",
                "30 Brigadeiros",
                "40 Risoles Carne"
            ],
            value: "R$ 399,59",
            status: "Pendente"
        },
        {
            id: 2,
            name: "Cliente 2",
            date: "30/08/2025",
            products: [
                "1Kg Torta",
                "30 Dois Amores",
                "20 Esfihas",
                "1 Torta Doce"
            ],
            value: "R$ 299,59",
            status: "Pendente"
        },
        {
            id: 3,
            name: "Cliente 3",
            date: "29/08/2025",
            products: [
                "1Kg Mousse",
                "30 Brigadeiros",
                "40 Risoles Carne"
            ],
            value: "R$ 199,59",
            status: "Concluído"
        }
    ]);


    const removeOrder = (filteredOrder: Order) => {
        const currentOrders = [ ...orders ]
        const newOrders = currentOrders.filter(order => 
            filteredOrder.id !== order.id
        )

        setOrders(newOrders)
        Messages.success("Pedido Excluido")
    }

    return (
        <MainTemplate>
            <Container>
                <div className={styles.header}>
                    <Title title="Pedidos" subtitle="Confira o histórico de pedidos"/>
                    <button onClick={() => navigate("/pedidos/novo")}><PlusIcon/> Adicionar Pedido</button>

                </div>

                <div className={styles.orderTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Data</th>
                                <th>Produtos</th>
                                <th>Valor</th>
                                <th>Status</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            <OrdersList 
                                ordersList={orders}
                                removeOrders={removeOrder}
                            />                                
                        </tbody>
                    </table>
                </div>
            </Container>
        </MainTemplate>
    )
}