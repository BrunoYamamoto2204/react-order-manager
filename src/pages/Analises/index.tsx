import { use, useState } from "react"
import { Container } from "../../components/Container"
import { Title } from "../../components/Title"
import { MainTemplate } from "../../templates/MainTemplate"
import styles from "./Analises.module.css"
import CustomDatePicker from "../../components/CustomDatePicker"
import { ArrowDown01Icon, ArrowDownAZ, ArrowDownIcon, ChartAreaIcon, ChartColumnIcon, ChartNoAxesColumnIcon, ChartNoAxesCombinedIcon, ChevronDownIcon, CircleDollarSignIcon, DollarSignIcon, ListOrderedIcon, Package2Icon, ShoppingCartIcon, TrophyIcon } from "lucide-react"
import { AnalysisList } from "../../components/AnalysisList"

export function Analises() {
    // Converte p/ string
    const formatDateString = (date : Date) => {
        return date.toISOString().split("T")[0];
    }

    // Data em tipo Date
    const today = new Date()
    today.setDate(today.getDate() - 1);
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1);

    // Data em String 
    const [startDate, setStartDate] = useState(formatDateString(yesterday))
    const [endDate, setEndDate] = useState(formatDateString(today))  
    const [isOpen, setIsOpen] = useState(false)
    const [optionSelected, setOptionSelected] = useState("Escolha uma opção");

    const selectOption = (option :  string) => {
        setOptionSelected(option)
        setIsOpen(!isOpen)
    }

    const productList = [
        { posicao: 1, produto: "Brigadeiro", valor: 2543.43, quantidade: 852 },
        { posicao: 2, produto: "Coxinha", valor: 2243.43, quantidade: 772 },
        { posicao: 3, produto: "Risoles", valor: 2032.42, quantidade: 692 },
        { posicao: 4, produto: "Quibe", valor: 1832.12, quantidade: 641 },
        { posicao: 5, produto: "Beijinho", valor: 1621.88, quantidade: 589 }
    ];

    return (
        <MainTemplate>
            <Container >
                <Title 
                    title="Análises" 
                    subtitle="Analise os resultados e gere insights para o seu negócio"
                />
                <div className={styles.analysisDate}>
                    <h2>Período de análise: </h2>
                    <div className={styles.period}>
                        <div>
                            <CustomDatePicker
                                value={startDate}
                                onChange={setStartDate}
                                placeholder="Selecione a data inicial"
                                dateName = "Data Inicial"
                                maxDate={endDate} // Data inicial não pode ser depois da final
                            />
                        </div>
                        <div className={styles.midText}>até</div>
                        <div>
                            <CustomDatePicker
                                value={endDate}
                                onChange={setEndDate}
                                placeholder="Selecione a data final"
                                dateName = "Data Final"
                                minDate={startDate} // Data final não pode ser antes da inicial
                            />
                        </div>
                    </div>
                </div>

                {/* RESUMO DO PERÍODO */}
                <div className={styles.periodResume}>
                    <div className={styles.resumeTitle}>
                        <h2>Resumo do perído</h2>
                        <h3>Visão geral dos seus resultados de vendas.</h3>
                    </div>
                    <div className={styles.resumeContent}>
                        <div className={styles.resumeItem}>
                            <h3>Quantidade de Pedidos</h3>
                            <h4>231</h4>
                        </div>
                        <div className={styles.resumeItem}>
                            <h3>Valor dos h4edidos</h3>
                            <h4>R$ 10.231,76</h4>
                        </div>
                        <div className={styles.resumeItem}>
                            <h3>Ticket Médio</h3>
                            <h4>R$ 44,76</h4>
                        </div>
                    </div>
                </div>

                <div className={styles.featuredProductStats}>
                    <div className={styles.productChoice}>
                        <h2>Destaques </h2>
                        <div className={styles.dropdown}>
                            <button
                                className={`${styles.dropbtn} ${isOpen ? styles.open : ""}`}
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                {optionSelected}
                                <ChevronDownIcon/>
                            </button>
                        
                            <div className={`${styles.dropdownContent} ${isOpen ? styles.open : ""}`}>
                                <a onClick={() => selectOption("Mais Vendido")} href="#">
                                    Mais Vendido
                                </a>
                                <a onClick={() => selectOption("Mais Lucro")} href="#">
                                    Mais Lucro
                                </a>
                                <a onClick={() => selectOption("Menos Lucro")} href="#">
                                    Menos Lucro
                                    </a>
                                <a onClick={() => selectOption("Menos Vendido")} href="#">
                                    Menos Vendido
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* DESTAQUES */}
                    <div className={styles.containersGroup}>
                        <div className={styles.featuredProduct}>
                            <h2><TrophyIcon/> Produto</h2>
                            <h3 className={styles.productName}>Brigadeiro</h3>
                            <h4 className={styles.productSubtitle}>se destacou no período.</h4>
                        </div>
                        <div className={styles.featuredProduct}>
                            <h2><ShoppingCartIcon/> Quantidade Vendida</h2>
                            <h3 className={styles.productName}>852</h3>
                            <h4 className={styles.productSubtitle}>unidades vendidas</h4>
                        </div>
                        <div className={styles.featuredProduct}>
                            <h2><DollarSignIcon/> Valor Total</h2>
                            <h3 className={styles.productName}>R$ 2543,43</h3>
                            <h4 className={styles.productSubtitle}>unidades vendidas</h4>
                        </div>
                    </div>

                    <div className={styles.gridOfTwo}>
                        <div className={styles.bestSellersContainer}>
                            <h2>
                                <ChartNoAxesCombinedIcon/>
                                Produtos mais vendidos
                            </h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Posição</th>
                                        <th>Produto</th>
                                        <th>Valor</th>
                                        <th>Quantidade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnalysisList productsList={productList}/>
                                </tbody>
                            </table>
                            <h3 className={styles.seeMore}>Ver mais...</h3>
                        </div>
                        <div className={styles.orderChart}>
                            <h2>
                                <ChartColumnIcon/>
                                Produtos mais vendidos
                            </h2>
                        </div>  
                    </div>
                </div>
            </Container>
        </MainTemplate>
    )
}