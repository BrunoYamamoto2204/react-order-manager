import { Container } from "../../components/Container";
import { MainTemplate } from "../../templates/MainTemplate";
import { getOrders, deleteOrder } from "../../services/ordersApi"
import type { Order } from "../../services/ordersApi"

// import styles from "../../components/OrdersList/OrdersList.module.css"
import styles from "./Pedidos.module.css"
import { OrdersList } from "../../components/OrdersList";
import { Title } from "../../components/Title";
import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Messages } from "../../components/Messages";

export function Pedidos() {
    const navigate = useNavigate();
    const [ orders, setOrders ] = useState<Order[]>([]);
    const [ loading, setLoading ] = useState(true);
    
    useEffect(() => {
        document.title = "Pedidos - Comanda"
        loadOrders()
    },[])

    const loadOrders = async () => {
        try{
            setLoading(true)
            const data = await getOrders()
            setOrders(data)
        } catch (error) {
            console.error('[-] Erro ao carregar pedidos:', error);
            Messages.error("Erro ao carregar pedidos");
        } finally {
            setLoading(false)
        }
    }

    const removeOrder = async (filteredOrder: Order) => {
        try {
            if(!filteredOrder._id) {
                console.log("❌ Pedido sem _id:", filteredOrder);
                return;
            };
            await deleteOrder(filteredOrder._id);

            setOrders(orders.filter(order => order._id !== filteredOrder._id))
            Messages.success("Pedido excluido")
        } catch (error) {
            console.log("[-] Erro ao remover pedido!", error)
            Messages.error("Não foi possível remover o pedido")
        }
    }

    if (loading) {
        return (
            <MainTemplate>
                <Container>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        Carregando pedidos...
                    </div>
                </Container>
            </MainTemplate>
        );
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
                            {orders.length > 0 ? (
                                <OrdersList 
                                    ordersList={orders}
                                    removeOrders={removeOrder}
                                />
                            ) : (
                                <tr>
                                    <td className={styles.noOrders}>
                                        <p>Sem Pedidos disponíveis</p>
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