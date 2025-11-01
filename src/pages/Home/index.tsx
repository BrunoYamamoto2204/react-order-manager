import { useEffect, useState } from "react";
import { Container } from "../../components/Container";
import { MainTemplate } from "../../templates/MainTemplate";

import styles from "./Home.module.css"
import { Title } from "../../components/Title";
import GeralDatePicker from "../../components/GeralDatePicker";
import { CircleCheckIcon, ClipboardListIcon, HourglassIcon } from "lucide-react";
import { formatBrDate, formatDate } from "../../utils/format-date";
import { getOrders, type Order } from "../../services/ordersApi";


export function Home() {
    // Converte p/ string
    const formatDateString = (date : Date) => {
        return date.toLocaleDateString('sv-SE');
    }

    // String yyyy-MM-dd
    const [ date, setDate ] = useState(formatDateString(new Date())) 
    const [ orders, setOrders ] = useState<Order[]>([])

    useEffect(() => {
        const loadOrders = async () => {
            try{
                const ordersData = await getOrders()

                const filteredOrdersByDate = () => (
                    ordersData.filter(order => (
                        order.date === formatDate(date)
                    ))
                )

                setOrders(filteredOrdersByDate())
            } catch (error) {
                console.log("[500] - Erro ao carregar produtos: ", error)
            } 
        }

        loadOrders()
    }, [date])

    const countPendingOrders = () => {
        let countPending = 0;
        let concluedCounter = 0;

        orders.map(order => (
            order.status === "Pendente" ? countPending++ : concluedCounter++
        ))

        return {countPending, concluedCounter}
    }

    const totalOrdersValue = () => {
        return orders.reduce((total, order) => 
            total += Number(order.value.split(" ")[1])
        , 0)
    }

    const categoryCount = () => {
        let docesCount = 0;
        let salgadosCount = 0;
        let bolosCount = 0;
        let sobremesasCount = 0;

        orders.map(order => (
            order.products.map(product => {
                if (product.category === "Doce") docesCount += product.quantity
                if (product.category === "Salgado") salgadosCount += product.quantity
                if (product.category === "Bolo")  bolosCount += product.quantity
                if (product.category === "Sobremesa") sobremesasCount += product.quantity
            })
        ))

        return { docesCount, salgadosCount, bolosCount, sobremesasCount }
    }

    const { countPending, concluedCounter } = countPendingOrders()
    const { docesCount, salgadosCount, bolosCount, sobremesasCount } = categoryCount()
    
    return (
        
        <MainTemplate>
            <Container>
                <div className={styles.HomeContainer}>
                    <Title title="Geral" subtitle="Olá Usuário! Aqui está o seu resumo diário"/>

                    <h2 className={styles.date}>
                        <GeralDatePicker
                            displayValue={formatBrDate}
                            value={date}
                            onChange={setDate}
                            placeholder="Selecione uma data"
                            dateName = "Data"
                        />
                        
                    </h2>

                    
                    <div className={styles.summary}>
                        <h2>Receita total: <span>R$ {totalOrdersValue().toFixed(2).replace(".",",")}</span></h2>

                        <div className={styles.categories}>
                            <div className={styles.category}>
                                <h2>Bolos</h2>
                                <h3 className={styles.quantity}>{bolosCount}</h3>
                                <h4>unidades hoje</h4>
                            </div>
                            <div className={styles.category}>
                                <h2>Salgados</h2>
                                <h3 className={styles.quantity}>{salgadosCount}</h3>
                                <h4>unidades hoje</h4>
                            </div>
                            <div className={styles.category}>
                                <h2>Doces</h2>
                                <h3 className={styles.quantity}>{docesCount}</h3>
                                <h4>unidades hoje</h4>
                            </div>
                            <div className={styles.category}>
                                <h2>Sobremesas</h2>
                                <h3 className={styles.quantity}>{sobremesasCount}</h3>
                                <h4>unidades hoje</h4>
                            </div>
                        </div>
                    </div>

                    <h2 className={styles.quickStatsTitle}>Status Rápidos</h2>
                    <div className={styles.quickStats}>
                        <div className={styles.quickStatsBox}>
                            <div className={styles.iconWrapper}>
                                <HourglassIcon/>
                            </div>
                            <div className={styles.statsContent}>
                                <h3>Pedidos Pendentes</h3>
                                <p>{countPending}</p>
                            </div>
                        </div>
                        <div className={styles.quickStatsBox}>
                            <div className={styles.iconWrapper}>
                                <CircleCheckIcon/>
                            </div>
                            <div className={styles.statsContent}>
                                <h3>Pedidos Concluídos</h3>
                                <p>{concluedCounter}</p>
                            </div>
                        </div>
                        <div className={styles.quickStatsBox}>
                            <div className={styles.iconWrapper}>
                                <ClipboardListIcon/>
                            </div>
                            <div className={styles.statsContent}>
                                <h3>Pedidos Totais</h3>
                                <p>{orders.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </MainTemplate>
    )
}