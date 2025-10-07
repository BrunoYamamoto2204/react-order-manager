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
    type Product = {
        id: number,
        product: string;
        price: string;
        quantity: number;
    }

    type Order = {
        id: number,
        name: string,
        date: string,
        productsStrings: string[],
        products: Product[],
        value: string,
        discount: string,
        discountValue: string,
        discountType: string,
        totalGross: string,
        obs: string,
        status: string
    }

    const navigate = useNavigate();
    
    useEffect(() => {
        document.title = "Pedidos - Comanda"
    },[])

    // Pedido inicial caso não tenha
    const client1Products: Product[] = [
        { id: 101, product: "Bolo", quantity: 1, price: "60.00" },
        { id: 102, product: "Brigadeiros", quantity: 30, price: "1.50" },
        { id: 103, product: "Coxinhas", quantity: 40, price: "2.00" },
        { id: 104, product: "Esfihas", quantity: 20, price: "2.50" },
        { id: 105, product: "Torta Doce", quantity: 1, price: "45.00" },
    ];

    const totalGross = client1Products.reduce((sum, p) => sum + (p.quantity * Number(p.price)), 0);
    const discount = 10.00; 
    const finalValue = totalGross - discount;

    const initialOrders: Order[] = [
        {
            id: Date.now(),
            name: "Cliente 1",
            date: "31/08/2025",
            productsStrings: client1Products.map(p => `${p.quantity} ${p.product}`),
            products: client1Products, 
            value: `R$ ${finalValue.toFixed(2)}`,
            discount: discount.toString(),
            discountValue: discount.toFixed(2),
            discountType: "R$",
            totalGross: totalGross.toFixed(2),
            obs: "Entrega agendada para 14h.",
            status: "Pendente"
        },

    ];

    const getOrders = () => {
        const currentOrdersString = localStorage.getItem("orders");

        const orders = currentOrdersString 
            ? JSON.parse(currentOrdersString) 
            : localStorage.setItem("orders", JSON.stringify(initialOrders))

        return orders
    }

    const [ orders, setOrders ] = useState<Order[]>(getOrders());

    const removeOrder = (filteredOrder: Order) => {
        const currentOrders = [ ...orders ]
        const newOrders = currentOrders.filter(order => 
            filteredOrder.id !== order.id
        )

        setOrders(newOrders)
        localStorage.setItem("orders", JSON.stringify(newOrders))
        
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