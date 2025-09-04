import { useState } from "react";
import { Container } from "../../components/Container";
import { MainTemplate } from "../../templates/MainTemplate";

import styles from "./Home.module.css"
import { Title } from "../../components/Title";
import GeralDatePicker from "../../components/GeralDatePicker";
import { CircleCheckIcon, ClipboardListIcon, HourglassIcon } from "lucide-react";


export function Home() {
    // Converte p/ string
    const formatDateString = (date : Date) => {
        return date.toISOString().split("T")[0];
    }

    const formatDate =  (date : Date) => {
        date.setDate(date.getDate() + 1)

        return date.toLocaleDateString("pt-BR", 
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        )
    }

    const [date, setDate] = useState(formatDateString(new Date())) 
    
    return (
        <MainTemplate>
            <Container>
                <div className={styles.HomeContainer}>
                    <Title title="Geral" subtitle="Olá Usuário! Aqui está o seu resumo diário"/>

                    <h2 className={styles.date}>
                        <GeralDatePicker
                            displayValue={formatDate}
                            value={date}
                            onChange={setDate}
                            placeholder="Selecione a data inicial"
                            dateName = "Data"
                        />
                        
                    </h2>

                    
                    <div className={styles.summary}>
                        <h2>Receita total: <span>R$ 5553,50</span></h2>

                        <div className={styles.categories}>
                            <div className={styles.category}>
                                <h2>Bolos</h2>
                                <h3 className={styles.quantity}>12</h3>
                                <h4>unidades hoje</h4>
                            </div>
                            <div className={styles.category}>
                                <h2>Salgados</h2>
                                <h3 className={styles.quantity}>120</h3>
                                <h4>unidades hoje</h4>
                            </div>
                            <div className={styles.category}>
                                <h2>Doces</h2>
                                <h3 className={styles.quantity}>125</h3>
                                <h4>unidades hoje</h4>
                            </div>
                            <div className={styles.category}>
                                <h2>Sobremesas</h2>
                                <h3 className={styles.quantity}>10</h3>
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
                                <p>4</p>
                            </div>
                        </div>
                        <div className={styles.quickStatsBox}>
                            <div className={styles.iconWrapper}>
                                <CircleCheckIcon/>
                            </div>
                            <div className={styles.statsContent}>
                                <h3>Pedidos Concluídos</h3>
                                <p>16</p>
                            </div>
                        </div>
                        <div className={styles.quickStatsBox}>
                            <div className={styles.iconWrapper}>
                                <ClipboardListIcon/>
                            </div>
                            <div className={styles.statsContent}>
                                <h3>Pedidos Totais</h3>
                                <p>20</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </MainTemplate>
    )
}