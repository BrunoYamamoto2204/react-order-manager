import { useEffect, useState } from "react";
import { Container } from "../../components/Container";
import { Title } from "../../components/Title";
import { MainTemplate } from "../../templates/MainTemplate";
import styles from "./CreatePedido.module.css";
import { PlusCircleIcon, RefreshCwIcon, SaveIcon, SearchIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Messages } from "../../components/Messages";
import { CreateOrderDatePicker } from "../../components/CreateOrderDatePicker";
import { CreateOrderList } from "../../components/CreateOrderList";

export function CreatePedido() {
    type Product = {
        product: string;
        price: number;
        quantity: number;
    }

    useEffect(() => {
        document.title = "Novo Pedido - Comanda"
    },[])

    const navigate = useNavigate();

    const [ discountType, setDiscountType ] = useState("%")
    const [ discountValue, setDiscountValue ] = useState("0")
    const [ noRegister, setNoRegister ] = useState(false);
    const [ orders, setOrders ] = useState<Product[]>([
        {
            product: "Brigadeiro",  
            quantity: 1,
            price: 1.50
        },
    ])

    // Input Values
    const [ name, setName ] = useState("");
    const [ description, setDescription ] = useState("");

    const [ total, setTotal ] = useState(0)
    const [ discount, setDiscount ] = useState(0)

    const [ product, setProduct] = useState("");
    const [ quantity ] = useState("1");
    const [ price ] = useState("10.5");
    
    // Calcula o Valor Bruto
    const grossValue = orders.reduce((sum, order) => {
        return sum + (order.quantity * order.price)
    }, 0)

    // Define o total 
    useEffect(() => {
        const calculatedDiscountAmount  = () => {
            if(discountType === "%"){
                setDiscount(Number(grossValue) * (Number(discountValue) / 100))
                return Number(grossValue) * (Number(discountValue) / 100)
            }
            else {
                setDiscount(Number(discountValue))
                return Number(discountValue)
            }
        }

        const currentTotalGross = orders.reduce((sum, order) => 
            sum + (order.quantity * order.price), 0);
        const currentDiscountAmount = calculatedDiscountAmount();
        const subtotal = Math.max(0, currentTotalGross - currentDiscountAmount);
        setTotal(subtotal); 
    }, [orders, discountValue, discountType, grossValue]); 

    // Troca o tipo de Desconto
    const changeDiscountType = () => {
        return discountType == "%" ? setDiscountType("R$") : setDiscountType("%")
    }

    // Formata a data em dd/MM/YYYY
    const formatDate =  (date : Date) => {
        const StringDate = date.toISOString().split("T")[0].split("-")  

        const [year, month, day] = StringDate
        return `${day}/${month}/${year}`
    }

    // Converte a data em YYYY-MM-dd
    const formatDateString = (date : Date) => {
        return date.toISOString().split("T")[0];
    }

    const [date, setDate] = useState(formatDateString(new Date())) 
   
    // Excluir o item 
    const removeProduct = (listItem: Product) => {
        const currentOrderList = [...orders]

        const newOrder = currentOrderList.filter(order => 
            order.product !==  listItem.product
        )

        setOrders(newOrder)
    }

    // Cria Pedido
    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault()
        Messages.dismiss()

        if(!name) {
            Messages.error("Selecione um cliente");
            return;
        } 
        if (orders.length <= 0) {
            Messages.error("Adiocione itens ao pedido");
            return;
        } 

        setName("");
        setDescription("");
        setOrders([]);
        
        Messages.success("Pedido criado com sucesso")

        console.log({
            name: name,
            price: price,
            total: total,
            discount: discount,
            orderList: orders,
            description: description
        }) 

        return{
            name: name,
            orders: orders,
            total: total,
            discount: discount,
            orderList: orders,
            description: description
        } 
    }

    // Mudar o changeQuantity
    const changeQuantity = (newQuantity : number, productName: string) => {
        setOrders(currentOrders => 
            currentOrders.map(order => 
                order.product === productName 
                    ? {...order, quantity: newQuantity}
                    : order
            )
        )
    }

    // Adiociona produto no pedido
    const handleNewProduct = () => {
        Messages.dismiss()

        if (!product) {
            Messages.error("Selecione um produto");
            return;
        }

        const newOrder = {
            product: product,  
            quantity: Number(quantity),
            price: Number(price)
        };

        setOrders([...orders, newOrder]);
        Messages.success("Produto adicionado")
        
        setProduct("");
    }

    return(
        <MainTemplate>
            <Container>
                <Title 
                    title="Novo Pedido" 
                    subtitle="Preencha os dados para criar um novo pedido"
                />

                <div className={styles.formContent}>
                    <form onSubmit={handleSubmit}>
                        {/* Inputs Padrão */}
                        <div className={styles.inputGroup}>
                            <div className={styles.inputBox}>
                                <label htmlFor="nome">Cliente</label>
                                <div className={styles.inputWithIcon}>
                                    <SearchIcon className={styles.searchIcon} />
                                    <input 
                                        id="nome" 
                                        autoComplete="off"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)} 
                                        placeholder="Buscar Cliente"
                                    />
                                </div>
                                <div className={styles.withouRegister}>
                                    <label htmlFor="noName">Sem cadastro</label>
                                    <input 
                                        type="checkbox" 
                                        name="noName" 
                                        id="noName" 
                                        checked={noRegister}
                                        onChange={() => setNoRegister(!noRegister)}
                                    />
                                </div>

                            </div>
                            <div className={styles.inputBox}>
                                <label htmlFor="data">Data</label>
                                <CreateOrderDatePicker
                                    displayValue={formatDate}
                                    value={date}
                                    onChange={setDate}
                                    placeholder="Selecione a data inicial"
                                    className={styles.dateInput} 
                                />
                            </div>
                        </div>

                        {/* Produtos do Pedido */}
                        <div className={styles.orderBox}>
                            <h3>Produtos do Pedido</h3>
                                <div className={styles.orderTable}>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Produto</th>
                                                <th>Quantidade</th>
                                                <th>Preço Unitário</th>
                                                <th>Subtotal</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                            <tbody>
                                                {orders.length > 0 ? (
                                                <CreateOrderList 
                                                    orderList={orders} 
                                                    changeQuantity={changeQuantity}
                                                    removeProduct={removeProduct}
                                                />
                                                ) : (
                                                    <tr>
                                                        {/* <td> com colSpan=5 para ocupar todas as 5 colunas */}
                                                        <td colSpan={5} className={styles.noProductsContainer}> 
                                                            <p className={styles.noProducts}>
                                                                Adicione Produtos ao Pedido
                                                            </p>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody> 
                                    </table>
                                </div>
                            
                            {/* Adicionar Produto */}
                            <h3 className={styles.addProducth3}>Adicionar Produto</h3>
                            <div className={styles.inputWithIcon} >
                                <SearchIcon className={styles.searchIcon} />
                                <input
                                    onChange={e => setProduct(e.target.value)}
                                    value={product}
                                    className={styles.addProductInput}
                                    placeholder= "Buscar produto para adicionar ao pedido..."
                                />
                            </div>
                            <button
                                onClick={handleNewProduct} 
                                className={styles.addItemButton}
                                type="button">
                                <PlusCircleIcon/> Adicionar Produto
                            </button>
                        </div>


                        {/* Obs e Total */}
                        <div className={styles.inputGroup}>
                            {/* Observações */}
                            <div className={`${styles.inputBox} ${styles.obs}`}>
                                <label htmlFor="descricao">Observações (Opcional)</label>
                                <textarea 
                                    id="descricao" 
                                    value={description}
                                    placeholder="Adicione observações ao pedido..."
                                    autoComplete="off"
                                    onChange={(e) => setDescription(e.target.value)} 
                                />                            
                            </div>
                            
                            {/* Total e Descontos */}
                            <div className={styles.inputBox}>
                                <h3 className={styles.discount}>Desconto (Opcional)</h3>
                                <div className={styles.discountInputBox}>
                                    <input 
                                        className={styles.discountInput}
                                        onChange={e => {
                                            const value = Math.max(0, Number(e.target.value))
                                            setDiscountValue(value.toString())
                                        }}
                                        value={discountValue}
                                        type="number"
                                    />    
                                    <button 
                                        type="button" 
                                        className={styles.changeDiscountTypeButton}
                                        onClick={changeDiscountType}
                                    >   
                                        <RefreshCwIcon />
                                        {discountType}
                                    </button>
                                    
                                </div> 
                                {/* Subtotal */}
                                <div className={styles.statsValueBox}>
                                    <label>Subtotal</label> 
                                    <p>R$ {grossValue.toFixed(2)}</p>
                                </div>

                                {/* Desconto */}
                                <div className={styles.statsValueBox}>
                                    <label>Desconto</label> 
                                    <p style={{color:"var(--error)"}}>
                                        - R$ {discount.toFixed(2)}
                                    </p>
                                </div>

                                {/* Subtotal */}
                                <div className={styles.statsValueBox}>
                                    <label>Total</label> 
                                    <p style={{ color: 'var(--primary)' }}>
                                        R$ {total.toFixed(2)}
                                    </p>
                                </div>

                                                     
                            </div>
                        </div>

                        {/* Botões */}
                        <div className={styles.buttons}>
                            <button 
                                onClick={() => {navigate("/pedidos")}} 
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