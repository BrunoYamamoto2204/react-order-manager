import { useEffect, useState } from "react";
import { Container } from "../../components/Container";
import { Title } from "../../components/Title";
import { MainTemplate } from "../../templates/MainTemplate";
import styles from "./CreateCliente.module.css";
import { SaveIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Messages } from "../../components/Messages";
import { getCustomerById, updateCustomer } from "../../services/customersApi"
import { formatCpfCpnj } from "../../utils/format-cpf-cnpj";
import { formatPhone } from "../../utils/format-phone";
import { getOrders, updateOrder } from "../../services/ordersApi";

export function EditCliente() {
    const navigate = useNavigate();

    const [ isSubmitting, setIsSubmitting ] = useState(false);

    // Input Values
    const [name, setName] = useState("");
    const [cpfCnpj, setcpfCnpj] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [road, setRoad] = useState("");
    const [num, setNum] = useState("");
    const [additionalAddress, setAdditionalAddress] = useState("");
    const [neighborhood, setNeighborhood] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [cep, setCep] = useState("");
    const [obs, setObs] = useState("");

    // const [ customers ] = useState<Customer[]>([]);
    
    const { id } = useParams<{id: string}>();
    const [ loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Novo Cliente - Comanda"

        const loadCustomer = async () => {
            if(!id) {
                console.log(`[-] Erro ao buscar cliente ${id}`)
                return
            }

            try {
                const currentCustomers = await getCustomerById(id)

                setName(currentCustomers.name)
                setcpfCnpj(currentCustomers.cpfCnpj || "" )
                setPhone(currentCustomers.phone)
                setEmail(currentCustomers.email || "" )
                setRoad(currentCustomers.road || "" )
                setNum(currentCustomers.num || "" )
                setAdditionalAddress(currentCustomers.additionalAddress || "" )
                setNeighborhood(currentCustomers.neighborhood || "" )
                setState(currentCustomers.state || "" )
                setCep(currentCustomers.cep || "" )
                setObs(currentCustomers.obs || "" )
            } catch(error) {
                console.log(`[-] Erro ao carregar cliente ${id}: `, error)
                Messages.error("Erro ao carregar cliente")
            } finally{
                setLoading(false)
            }
        }

        loadCustomer()
    },[id])

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault()
        Messages.dismiss()

        if (name === "" || 
            phone === "" 
        ) {
            Messages.error("Preecha todos os campo obrigatórios")
            return
        }


        // Garante que não adicione vários clientes
        if (isSubmitting) return; 
        setIsSubmitting(true);

        const editedCustomer = {
            name: name.trim(), 
            cpfCnpj: cpfCnpj.trim() || "-", 
            phone, 
            email: email.trim() || "-",
            pendingOrders: false,
            road: road.trim(),
            num: num.trim(),
            additionalAddress: additionalAddress.trim(),
            neighborhood: neighborhood.trim(), 
            city: city.trim(),
            state: state.trim(),
            cep,
            obs              
        }

        if(!id) {
            console.log(`Erro ao editar cliente ${id}`)
            return 
        } 
        
        try{

            // Atualiza o cliente 
            await updateCustomer(id, editedCustomer)
            Messages.success("Cliente editado com sucesso")

            // Atualiza nos pedidos do cliente 
            const customerOrdersData = await getOrders()
            const filteredOrdersList = customerOrdersData.filter(order => (
                id === order.customerId
            ))
            
            for (const order of filteredOrdersList){
                if (order._id){
                    await updateOrder(order._id, {...order, name: name })
                }
            }

            navigate("/clientes")
        } catch(error) {
            console.log(`[-] Erro ao editar cliente ${id}: `, error)
            Messages.error("Erro ao editar cliente")
        } finally {
            setIsSubmitting(false);
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

    return(
        <MainTemplate>
            <Container>
                <Title 
                    title="Editar Cliente" 
                    subtitle="Edite os dados do cliente antes de salvar as alterações"
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
                            {/* CPF/CNPJ */}
                            <div className={styles.inputBox}>
                                <label htmlFor="cpf-cnpj">CPF/CNPJ (Opcional)</label>
                                <input
                                    id="cpf-cnpj"
                                    autoComplete="off"
                                    value={cpfCnpj}
                                    onChange={(e) => setcpfCnpj(formatCpfCpnj(e.target.value))}
                                    placeholder="000.000.000-00 ou 00.000.000/0000-00"
                                    maxLength={18}/>
                            </div>
                            {/* Email */}
                            <div className={styles.inputBox}>
                                <label htmlFor="email">E-mail (Opcional)</label>
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
                            <span className={styles.label}>Endereço</span>
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
                                <label htmlFor="bairro">Complemento</label>
                                <input
                                    id="bairro"
                                    autoComplete="off"
                                    value={additionalAddress}
                                    onChange={(e) => setAdditionalAddress(e.target.value)}
                                    placeholder="Ap. 1"/>
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
                                disabled={isSubmitting}
                            >        
                                <SaveIcon />
                                {isSubmitting ? "Salvando..." : "Salvar Cliente"}
                            </button>
                        </div>

                    </form>
                </div>
            </Container>
        </MainTemplate>
    )
}