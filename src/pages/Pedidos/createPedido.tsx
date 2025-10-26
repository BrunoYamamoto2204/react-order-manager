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
import { createOrder } from "../../services/ordersApi";
import { formatDate } from "../../utils/format-date";
import CustomerSearch from "../../components/CustomerSearch";
import { getCustomerById, updateCustomer } from "../../services/customersApi";

type Product = {
    id: number;
    product: string;
    price: string;
    quantity: number;
    unit: string;
}

export function CreatePedido() {
    const navigate = useNavigate();

    const [ discountType, setDiscountType ] = useState("%")
    const [ discountValue, setDiscountValue ] = useState("0")
    const [ noRegister, setNoRegister ] = useState(false);
    const [ productList, setProductList ] = useState<Product[]>([])

    // Input Values
    const [ customerId, setCustomerId ] = useState("")
    const [ name, setName ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ customerSelected, setCustomerSelected ] = useState(false);

    const [ total, setTotal ] = useState(0)
    const [ totalGross, setTotalGross] = useState("")
    const [ discount, setDiscount ] = useState(0)

    const [ product, setProduct] = useState("");
    const [ unit ] = useState("UN"); 
    const [ quantity ] = useState("1");
    const [ price ] = useState("10.5");
    
    useEffect(() => {
        document.title = "Novo Pedido - Comanda"
    },[])

    // Calcula o Valor Bruto
    const grossValue = productList.reduce((sum, order) => {
        return sum + (order.quantity * Number(order.price))
    }, 0)

    // Define o total 
    useEffect(() => {
        const calculatedDiscountAmount  = () => {
            setTotalGross(grossValue.toString())

            if(discountType === "%"){
                setDiscount(Number(grossValue) * (Number(discountValue) / 100))
                return Number(grossValue) * (Number(discountValue) / 100)
            }
            else {
                setDiscount(Number(discountValue))
                return Number(discountValue)
            }
        }

        const currentDiscountAmount = calculatedDiscountAmount();
        const subtotal = Math.max(0, grossValue - currentDiscountAmount);
        setTotal(subtotal); 
    }, [productList, discountValue, discountType, grossValue]); 

    // Troca o tipo de Desconto
    const changeDiscountType = () => {
        return discountType == "%" ? setDiscountType("R$") : setDiscountType("%")
    }

    // Converte a data em YYYY-MM-dd
    const formatDateString = (date : Date) => {
        return date.toISOString().split("T")[0];
    }

    const [date, setDate] = useState(formatDateString(new Date())) // YYYY-MM-dd
   
    // Adiociona produto no pedido
    const handleNewProduct = () => {
        Messages.dismiss()

        if (!product) {
            Messages.error("Selecione um produto");
            return;
        }

        const newProduct = {
            id: Date.now(),
            product: product,  
            quantity: Number(quantity),
            price: price,
            unit: unit
        };

        setProductList([...productList, newProduct]);
        Messages.success("Produto adicionado")
        
        setProduct("");
    }

    // Excluir o item 
    const removeProduct = (listItem: Product) => {
        const currentOrderList = [...productList]
        const newOrder = currentOrderList.filter(order => 
            order.product !== listItem.product
        )
        setProductList(newOrder)
    }

    // Cria Pedido
    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault()
        Messages.dismiss()

        if (noRegister) {
            if(!name){
                Messages.error("Insira o nome do cliente");
                return;
            }
        }

        else if(!customerSelected) {
            Messages.error("Selecione um cliente exitente");
            return;
        } 

        else if (productList.length <= 0) {
            Messages.error("Adiocione itens ao pedido");
            return;
        } 

        const formattedProducts = productList.map(p => 
            `${p.quantity}${p.unit === "UN" ? "" : p.unit} ${p.product}`
        );
    
        const newOrder = ({
            customerId: customerId,
            name: name,
            date: formatDate(formatDateString(new Date())),
            productsStrings: formattedProducts,
            products: productList,
            value: `R$ ${total.toFixed(2)}`,        
            discount: discount.toFixed(2),
            discountValue: discountValue,
            totalGross: totalGross,
            discountType: discountType,
            obs: description,
            status: "Pendente",
        }) 
        
        try{
            await createOrder(newOrder)

            if (!noRegister){
                const chosenCustomer = await getCustomerById(customerId)
                await updateCustomer(customerId, {...chosenCustomer, pendingOrders: true})
            }

            setName("");
            setDescription("");
            setProductList([]);
            setDiscountValue("0");

            Messages.success("Pedido criado com sucesso")
            navigate("/pedidos");
        } catch (error) {
            console.error("[-] Erro ao criar pedido: ", error)
            Messages.error("Erro ao criar pedido")
        }
    }

    // Mudar o changeQuantity
    const changeQuantity = (newQuantity : number, productName: string) => {
        setProductList(currentProducts => 
            currentProducts.map(product => 
                product.product === productName 
                    ? {...product, quantity: newQuantity}
                    : product
            )
        )
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
                                <CustomerSearch 
                                    value={name}
                                    customerSelected={setCustomerSelected}
                                    onChange={setName}
                                    setCustomerId={setCustomerId}
                                    placeholder="Buscar Cliente"
                                />
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
                                                {productList.length > 0 ? (
                                                <CreateOrderList 
                                                    orderList={productList} 
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