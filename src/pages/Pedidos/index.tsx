import { Container } from "../../components/Container";
import { MainTemplate } from "../../templates/MainTemplate";

// import styles from "../../components/OrdersList/OrdersList.module.css"
import styles from "./Pedidos.module.css"
import { OrdersList } from "../../components/OrdersList";
import { Title } from "../../components/Title";

export function Pedidos() {
    const pedidos = [
        {
            nome: "Cliente 1",
            data: "31/08/2025",
            produtos: [
                "1Kg Bolo",
                "30 Brigadeiros",
                "40 Coxinhas",
                "20 Esfihas",
                "1 Torta Doce",
                "1Kg Mousse",
                "30 Brigadeiros",
                "40 Risoles Carne"
            ],
            valor: "R$ 399,59",
            status: "Pendente"
        },
        {
            nome: "Cliente 2",
            data: "30/08/2025",
            produtos: [
                "1Kg Torta",
                "30 Dois Amores",
                "20 Esfihas",
                "1 Torta Doce"
            ],
            valor: "R$ 299,59",
            status: "Pendente"
        },
        {
            nome: "Cliente 3",
            data: "29/08/2025",
            produtos: [
                "1Kg Mousse",
                "30 Brigadeiros",
                "40 Risoles Carne"
            ],
            valor: "R$ 199,59",
            status: "Concluído"
        }
    ];

    return (
        <MainTemplate>
            <Container>
                <div className={styles.header}>
                    <Title title="Pedidos" subtitle="Confira o histórico de pedidos"/>
                    <button>Adicionar Pedido</button>

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
                            </tr>
                        </thead>
                        
                        <tbody>
                            <OrdersList orders={pedidos}/>                                
                        </tbody>
                    </table>
                </div>
            </Container>
        </MainTemplate>
    )
}