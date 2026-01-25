import { Container } from "../../components/Container"
import { Title } from "../../components/Title"
import { MainTemplate } from "../../templates/MainTemplate"
import styles from "./Financeiro.module.css"

export function Financeiro () {
    return (
        <MainTemplate>
            <Container>
                <Title 
                    title="Financeiro"
                    subtitle="Gerencie o seu financeiro e controle suas receitas e gastos"
                />

                <div>
                    <p>Financeiro adicionado</p>
                </div>
            </Container>
        </MainTemplate>
    )
}