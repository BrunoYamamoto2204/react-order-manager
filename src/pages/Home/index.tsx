import { useState } from "react";
import { Container } from "../../components/Container";
import { MainTemplate } from "../../templates/MainTemplate";

import styles from "./Home.module.css"
import { Calendar1Icon, CalendarIcon } from "lucide-react";

export function Home() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [isActive, setIsActive] = useState(true);

    const formatDate =  (date : Date) => date.toLocaleDateString("pt-BR", 
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    )
    
    const confirmDate = () => {
        const newDate = new Date(Number(year), Number(month) - 1, Number(day))
        setSelectedDate(newDate)
    }

    return (
        <MainTemplate>
            <Container>
                <div className={styles.HomeContainer}>
                    <div className={styles.titles}>
                        <h1>Geral</h1>
                        <h2>Olá Confeitaria Rosinha! Aqui está o seu resumo diário</h2>
                    </div>

                    <h2 className={styles.date}>
                        {formatDate(selectedDate)}
                        <button onClick={() => setIsActive(isActive ? false : true)}>
                            <CalendarIcon/>
                        </button>
                    </h2>
                    

                    <div className={isActive ? styles.dateForm : styles.dateFormDeactivated}>
                        <input 
                            type="number"
                            placeholder="Dia" 
                            value={day} 
                            onChange={e => setDay(e.target.value)} 
                        />
                        <input 
                            type="number"
                            placeholder="Mês" 
                            value={month} 
                            onChange={e => setMonth(e.target.value)} 
                        />
                        <input 
                            type="number"
                            placeholder="Ano" 
                            value={year} 
                            onChange={e => setYear(e.target.value)} 
                        />
                        <button onClick={confirmDate}><Calendar1Icon/></button>
                    </div>

                    <div className={styles.summary}>
                        <h2>Número de Pedidos: <span>0</span></h2>
                        <hr />
                        <div className={styles.categories}>
                            <div className={styles.category}>
                                <h2>Bolos</h2>
                                <p className={styles.quantity}>12</p>
                            </div>
                            <div className={styles.category}>
                                <h2>Salgados</h2>
                                <p className={styles.quantity}>120</p>
                            </div>
                            <div className={styles.category}>
                                <h2>Doces</h2>
                                <p className={styles.quantity}>125</p>
                            </div>
                            <div className={styles.category}>
                                <h2>Sobremesas</h2>
                                <p className={styles.quantity}>10</p>
                            </div>
                        </div>
                    </div>

                    <h2 className={styles.quickStatsTitle}>Status Rápidos</h2>
                    <div className={styles.quickStats}>
                        <div className={styles.quickStatsBox}>
                            <h3>Pedidos Pendentes</h3>
                            <p>20</p>
                        </div>
                        <div className={styles.quickStatsBox}>
                            <h3>Pedidos Concluídos</h3>
                            <p>20</p>
                        </div>
                        <div className={styles.quickStatsBox}>
                            <h3>Pedidos Totais</h3>
                            <p>20</p>
                        </div>
                    </div>


                </div>
            </Container>
        </MainTemplate>
    )
}