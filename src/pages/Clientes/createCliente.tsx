import { useEffect, useState } from "react";
import { Container } from "../../components/Container";
import { Title } from "../../components/Title";
import { MainTemplate } from "../../templates/MainTemplate";
import styles from "./CreateCliente.module.css";
import { SaveIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Messages } from "../../components/Messages";
import { createCustomer } from "../../services/customersApi";
import { formatCpfCpnj } from "../../utils/format-cpf-cnpj";
import { formatPhone } from "../../utils/format-phone";

export function CreateCliente() {
    useEffect(() => {
        document.title = "Novo Cliente - Comanda"
    },[])
    const navigate = useNavigate();

    // Input Values
    const [name, setName] = useState("");
    const [cpfCnpj, setCpfCnpj] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [road, setRoad] = useState("");
    const [num, setNum] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [cep, setCep] = useState("");
    const [obs, setObs] = useState("");

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault()
        Messages.dismiss()

        if (name === "" || 
            cpfCnpj === "" || 
            phone === "" || 
            email === "" ||
            cpfCnpj === ""
        ) {
            Messages.error("Preecha todos os campo obrigatórios")
            return
        }

        const newCustomer = {
            name, 
            cpfCnpj, 
            phone, 
            email,
            pendingOrders: false,
            road,
            num,
            neighborhood, 
            city,
            state,
            cep,
            obs            
        }

        try {
            await createCustomer(newCustomer)

            setName("");
            setCpfCnpj("");
            setPhone("");
            setRoad("");
            setNum("");
            setCity("");
            setState("");
            setCep("");
            setObs("");
            setEmail("");
            setNeighborhood("");
            
            Messages.success("Produto criado com sucesso")
            navigate("/clientes")
        } catch(error) {
            console.log("Erro ao criar cliente: ", error)
            Messages.error("Erro ao cadastrar cliente")
        }
    }

    return(
        <MainTemplate>
            <Container>
                <Title 
                    title="Novo Produto" 
                    subtitle="Preencha os dados para cadastrar um novo produto"
                />

                <div className={styles.formContent}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            {/* Nome */}
                            <div className={styles.inputBox}>
                                <label htmlFor="nome">Nome do Cliente *</label>
                                <input
                                    id="nome"
                                    autoComplete="off"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ex: João Silva"/>
                            </div>
                            {/* CPF/CNPJ */}
                            <div className={styles.inputBox}>
                                <label htmlFor="cpf-cnpj">CPF/CNPJ *</label>
                                <input
                                    id="cpf-cnpj"
                                    autoComplete="off"
                                    value={cpfCnpj}
                                    onChange={(e) => setCpfCnpj(formatCpfCpnj(e.target.value))}
                                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                                    maxLength={18}/>
                            </div>
                            {/* Telefone */}
                            <div className={styles.inputBox}>
                                <label htmlFor="telefone">Telefone *</label>
                                <input
                                    id="telefone"
                                    autoComplete="off"
                                    value={phone}
                                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                                    placeholder="(41) 90000-0000"
                                    maxLength={15}/>
                            </div>
                            {/* Email */}
                            <div className={styles.inputBox}>
                                <label htmlFor="email">E-mail *</label>
                                <input
                                    id="email"
                                    autoComplete="off"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="exemplo@email.com"/>
                            </div>
                        </div>

                        {/* Endereço */}
                        <div className={`${styles.inputBox} ${styles.addressGroup}`}>
                            <span className={styles.label}>Endereço (Opcional)</span>
                            <div className={`${styles.addressBox} ${styles.roadBox}`}>
                                <label htmlFor="rua">Rua</label>
                                <input
                                    id="rua"
                                    autoComplete="off"
                                    value={road}
                                    onChange={(e) => setRoad(e.target.value)}
                                    placeholder="Nome da Rua"/>
                            </div>
                            <div className={styles.addressBox}>
                                <label htmlFor="num">Número</label>
                                <input
                                    id="num"
                                    autoComplete="off"
                                    value={num}
                                    onChange={(e) => setNum(e.target.value)}
                                    placeholder="Ex: 123"/>
                            </div>
                            <div className={styles.addressBox}>
                                <label htmlFor="bairro">Bairro</label>
                                <input
                                    id="bairro"
                                    autoComplete="off"
                                    value={neighborhood}
                                    onChange={(e) => setNeighborhood(e.target.value)}
                                    placeholder="Nome do Bairro"/>
                            </div>
                            <div className={styles.addressBox}>
                                <label htmlFor="cidade">Cidade</label>
                                <input
                                    id="cidade"
                                    autoComplete="off"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    placeholder="Nome da Cidade"/>
                            </div>
                            <div className={styles.addressBox}>
                                <label htmlFor="estado">Estado</label>
                                <input
                                    id="estado"
                                    autoComplete="off"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    placeholder="Ex: PR"/>
                            </div>
                            <div className={styles.addressBox}>
                                <label htmlFor="cep">CEP</label>
                                <input
                                    id="cep"
                                    autoComplete="off"
                                    value={cep}
                                    onChange={(e) => setCep(e.target.value)}
                                    placeholder="00000-000"/>
                            </div>
                        </div>
                        
                        {/* Descrição */}
                        <div className={`${styles.inputBox} ${styles.description}`}>
                            <label htmlFor="descricao">Descrição (Opcional)</label>
                            <textarea 
                                id="descricao" 
                                value={obs}
                                placeholder="Pontos de referência, preferência, etc."
                                autoComplete="off"
                                onChange={(e) => setObs(e.target.value)} 
                            />                            
                        </div>

                        {/* Botões */}
                        <div className={styles.buttons}>
                            <button 
                                onClick={() => {navigate("/clientes")}} 
                                className={styles.cancel}
                                type="button"
                            >
                                Cancelar
                            </button>
                            <button 
                                className={styles.save} 
                                type="submit"
                            >        
                                <SaveIcon />
                                Salvar Produto
                            </button>
                        </div>

                    </form>
                </div>
            </Container>
        </MainTemplate>
    )
}