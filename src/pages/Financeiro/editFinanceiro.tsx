import { useEffect, useState } from "react";
import { Container } from "../../components/Container"
import { Title } from "../../components/Title"
import { MainTemplate } from "../../templates/MainTemplate"

import styles from "./createFinanceiro.module.css"
import GeralDatePicker from "../../components/GeralDatePicker";
import { formatDate } from "../../utils/format-date";
import { MoveDownIcon, MoveUpIcon, SaveIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Messages } from "../../components/Messages";
import { getIncomeExpenseById, updateIncomeExpense } from "../../services/financialApi";

export function EditFinanceiro() {
    const navigate = useNavigate()

    const { id } = useParams<{id: string}>()
    const [ loading, setLoading ] = useState(true);
    
    const [ date, setDate ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ account, setAccount ] = useState("");
    const [ value, setValue ] = useState("");

    const [ isExpense, setIsExpense ] = useState(true);
    const [ isIncome, setIsIncome ] = useState(false);

    // const [ isMobile, setIsMobile ] = useState(false); 
    const [ isSubmitting, setIsSubmitting] = useState(false); 

    useEffect(() => {
        document.title = "Editar Conta - Comanda"

        if (!id) return

        try {
            const loadTransactions = async () => {
                const transaction = await getIncomeExpenseById(id)

                setDate(transaction.date)
                setDescription(transaction.description)
                setAccount(transaction.account)
                handleProductPrice(transaction.value.toFixed(2))
            }
             
            loadTransactions()
        } catch(error) {
            console.log(`[-] Erro carregar conta ${id}: `, error)
            Messages.error("Erro ao carregar conta")
        } finally {
            setLoading(false)
        }

    },[])

    const handleTransactionType = (option : string) => {
        if (option === "expense") {
            setIsExpense(true)
            setIsIncome(false)
        } else{
            setIsExpense(false)
            setIsIncome(true)
        }
    }

    const handleProductPrice = (value: string) => {
        // Remove tudo que não for número
        const numeric = value.replace(/\D/g, "");

        // Converte para reais
        const formatted = (Number(numeric) / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        setValue(formatted);
    };

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault()
        Messages.dismiss()

        const priceNumber = Number(
            value.replace("R$", "").replace(/\s/g, "").replace(".", "").replace(",", ".")
        );

        if (
            date === "" ||
            description === "" ||
            account === "" ||
            value === ""
        ) {
            Messages.error("Preencha todos os campos obrigatórios")
            return
        }

        if(isSubmitting) return
        setIsSubmitting(true)

        const newTransaction = {
            date: date,
            description: description,
            category: isExpense ? "Despesa" : "Receita",
            account: account,
            value: priceNumber,
        }

        try {
            if(!id) return

            await updateIncomeExpense(id, newTransaction)

            Messages.success("Conta criada com sucesso")
            navigate("/financeiro")
        } catch (error) {
            console.log("Erro ao editar conta: ", error)
            Messages.error("Erro ao editar conta")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <MainTemplate>
                <Container>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        Carregando produto...
                    </div>
                </Container>
            </MainTemplate>
        );
    }

    return (
        <MainTemplate>
            <Container>
                <Title 
                    title="Editar Conta" 
                    subtitle="Edite os dados da conta antes de salvar as alterações"
                />

                <div className={styles.formContent}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.transactionTypeBox}>
                            <h3>Tipo de transação</h3>
                            <div className={styles.typeButtonBox}> 
                                <button
                                    type="button"
                                    className={isExpense ? styles.activeType : ''}
                                    onClick={() => handleTransactionType("expense")}
                                    disabled={isExpense}
                                >
                                        <MoveDownIcon style={{color:"var(--error)"}}/> 
                                        Despesa
                                </button>
                                <button
                                    type="button"
                                    className={isIncome ? styles.activeType : ''}
                                    onClick={() => handleTransactionType("income")}
                                    disabled={isIncome}
                                >
                                    <MoveUpIcon style={{color:"var(--primary)"}}/> 
                                    Receita
                                </button>
                            </div>
                        </div>
                        
                        <div className={styles.detailsBox}>
                            <h3>Data e Conta</h3>
                            <div className={styles.detailsContent}>
                                {/* Data */}
                                <div className={styles.inputBox}>
                                    <label htmlFor="nome">Data de Vencimento *</label>
                                    <div className={styles.dateBox}>
                                        <GeralDatePicker
                                            className={styles.dateBoxInput}
                                            displayValue={formatDate}
                                            value={date}
                                            onChange={setDate}
                                            placeholder="mm/dd/yyyy"
                                            dateName = "Data"
                                        />
                                    </div>
                                </div>
                                {/* Conta */}
                                <div className={styles.inputBox}>
                                    <label htmlFor="preco">Conta *</label>
                                    <input
                                        id="conta"
                                        autoComplete="off"
                                        value={account}
                                        onChange={(e) => setAccount(e.target.value)}
                                        placeholder="Conta"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.informationBox}>
                            <h3>Informações Principais</h3>
                            <div className={styles.informationContent}>
                                <div className={styles.inputBox}>
                                    <label htmlFor="preco">Descrição da Conta *</label>
                                    <input
                                        id="descricao"
                                        autoComplete="off"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Ex: Pagamento de Fornecedor"
                                    />
                                </div>
                                {/* Valor */}
                                <div className={styles.inputBox}>
                                    <label > Valor *</label>
                                    <div className={styles.priceInput}>
                                        <input
                                            id="preco"
                                            autoComplete="off"
                                            value={value}
                                            onChange={(e) => handleProductPrice(e.target.value)}
                                            placeholder="R$ 0,00"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Botões */}
                        <div className={styles.buttons}>
                            <div className={styles.saveAndCancelDiv}>
                                <button
                                    onClick={() => {navigate("/financeiro")}}
                                    className={styles.cancel}
                                    type="button"
                                >
                                    Cancelar
                                </button>
                                <button
                                    className={styles.save}
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    <SaveIcon />
                                    {isSubmitting ? "Salvando..." : "Salvar Produto"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </Container>
        </MainTemplate>

    )
}