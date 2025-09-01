import { useState } from "react"
import { Container } from "../../components/Container"
import { Title } from "../../components/Title"
import { MainTemplate } from "../../templates/MainTemplate"
import styles from "./Analises.module.css"
import CustomDatePicker from "../../components/CustomDatePicker"

export function Analises() {
    // Converte p/ string
    const formatDateString = (date : Date) => {
        return date.toISOString().split("T")[0];
    }

    // Formata a data
    const formatDateDisplay = (date : string) => {
        if (!date) return "-"
        const [ano, mes, dia] = date.split("-")
        return `${dia}/${mes}/${ano}`
    }   

    // Data em tipo Date
    const today = new Date()
    today.setDate(today.getDate() - 1);
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1);

    // Data em String 
    const [startDate, setStartDate] = useState(formatDateString(yesterday))
    const [endDate, setEndDate] = useState(formatDateString(today))  

    
    return (
        <MainTemplate>
            <Container >
                <Title 
                    title="Análises" 
                    subtitle="Analise os resultados e gere insights para o seu negócio"
                />
                <hr />
                <div className={styles.analysisDate}>
                    <h2>Período de análise</h2>
                    <h3>
                        {formatDateDisplay(startDate)} até {formatDateDisplay(endDate)}
                    </h3>

                    <div className={styles.period}>
                        <div className={styles.date}>
                            <h3>Data Inicial:</h3>
                            <CustomDatePicker
                                value={startDate}
                                onChange={setStartDate}
                                placeholder="Selecione a data inicial"
                                maxDate={endDate} // Data inicial não pode ser depois da final
                            />
                        </div>
                        <div className={styles.date}>
                            <h3>Data Final:</h3>
                            <CustomDatePicker
                                value={endDate}
                                onChange={setEndDate}
                                placeholder="Selecione a data final"
                                minDate={startDate} // Data final não pode ser antes da inicial
                            />
                        </div>
                    </div>
                </div>
            </Container>
        </MainTemplate>
    )
}