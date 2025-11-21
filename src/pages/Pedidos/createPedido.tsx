import { useEffect, useState } from "react";
import { Container } from "../../components/Container";
import { Title } from "../../components/Title";
import { MainTemplate } from "../../templates/MainTemplate";
import styles from "./CreatePedido.module.css";
import { BikeIcon, PlusCircleIcon, RefreshCwIcon, SaveIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Messages } from "../../components/Messages";
import { CreateOrderDatePicker } from "../../components/CreateOrderDatePicker";
import { CreateOrderList } from "../../components/CreateOrderList";
import { createOrder } from "../../services/ordersApi";
import { formatDate } from "../../utils/format-date";
import CustomerSearch from "../../components/CustomerSearch";
import { getCustomerById, updateCustomer } from "../../services/customersApi";
import { ProductSearch } from "../../components/ProductSearch";
import { getProductById, updateProduct } from "../../services/productsApi";
import { ToggleSwitch } from "../../components/ToggleSwitch";


export type OrderProduct = {
    uniqueId: number
    productId: string;
    product: string;
    price: string;
    quantity: number;
    category: string,
    unit: string;
}

export function CreatePedido() {
    const navigate = useNavigate();

    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const [ customerId, setCustomerId ] = useState<string | null>(null)
    const [ discountType, setDiscountType ] = useState("%")
    const [ discountValue, setDiscountValue ] = useState("0")
    const [ noRegister, setNoRegister ] = useState(false);
    const [ productList, setProductList ] = useState<OrderProduct[]>([])

    // Input Values
    const [ name, setName ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ date, setDate ] = useState(new Date().toLocaleDateString("sv-SE")) 
    const [ time, setTime ] = useState("") 
    const [ customerSelected, setCustomerSelected ] = useState(false);

    const [ total, setTotal ] = useState(0)
    const [ totalGross, setTotalGross] = useState("")
    const [ discount, setDiscount ] = useState(0)

    const [ productName, setProductName] = useState("")
    const [ product, setProduct ] = useState<OrderProduct>();

    const [ isDelivery, setIsDelivery ] = useState(false);
    const [ deliveryAddress, setDeliveryAddress ] = useState("");
    const [ deliveryFee, setDeliveryFee ] = useState("");

    useEffect(() => {
        document.title = "Novo Pedido - Comanda"
    },[])

    // Remove os valores de entrega, caso estiver com a opção não
    useEffect(() => {
        if(!isDelivery) {
            setDeliveryAddress("")
            setDeliveryFee("")
        }
    },[isDelivery])

    // Calcula o Valor Bruto
    const grossValue = productList.reduce((sum, order) => {
        return sum + (order.quantity * Number(order.price))    
    }, 0)
    
    // Formatar R$1,00 -> 1.0
    const priceNumber = (price: string) => Number(
        price.replace("R$", "").replace(/\s/g, "").replace(".", "").replace(",", ".")
    );

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
        const subtotal = Math.max(0, grossValue - currentDiscountAmount + priceNumber(deliveryFee));
        setTotal(subtotal); 
    }, [productList, discountValue, discountType, grossValue, deliveryFee]); 

    // Troca o tipo de Desconto
    const changeDiscountType = () => {
        return discountType == "%" ? setDiscountType("R$") : setDiscountType("%")
    }
   
    // Adiociona produto no pedido
    const handleNewProduct = () => {
        Messages.dismiss()
        
        if (!product) {
            Messages.error("Selecione um produto");
            return;
        }

        setProductName("")
        setProduct(undefined)
        setProductList([...productList, product]);
        Messages.success("Produto adicionado")
    }

    // Excluir o item 
    const removeProduct = (listItem: OrderProduct) => {
        const currentOrderList = [...productList]
        const newOrder = currentOrderList.filter(order => 
            order.uniqueId !== listItem.uniqueId
        )
        setProductList(newOrder)
    }

    // Cria Pedido
    const handleSubmit = async (e : React.FormEvent) => {
        console.log("executou aqui")
        e.preventDefault()
        Messages.dismiss()

        if (isSubmitting) return; 
        setIsSubmitting(true);

        if (noRegister) {
            if(!name){
                Messages.error("Insira o nome do cliente");
                return;
            }
        } else if (!customerSelected || !customerId) {
            Messages.error("Selecione um cliente exitente");
            return;
        } 

        if (!time) {
            Messages.error("Adicione o horário do pedido");
            return;
        }

        if (isDelivery) {
            if (!deliveryAddress) {
                Messages.error("Informe o endereço de entrega do pedido");
                return;
            }
            if (!deliveryFee) {
                Messages.error("Informe a taxa de entrega do pedido");
                return;
            }
        }

        if (productList.length <= 0) {
            Messages.error("Adicione itens ao pedido");
            return;
        } 

        const formattedProducts = productList.map(p => 
            `${p.quantity} ${p.unit} ${p.product}`
        );
    
        const newOrder = ({
            customerId: customerId ?? undefined,
            isDelivery: isDelivery,
            deliveryAddress: deliveryAddress,
            deliveryFee: deliveryFee,
            name: name,
            noRegister: noRegister,
            date: formatDate(date),
            time: time,
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

            if (!noRegister && customerId) {
                const chosenCustomer = await getCustomerById(customerId);
                await updateCustomer(customerId, { ...chosenCustomer, pendingOrders: true });
            }

            // Adicionar a quantidade de produtos nas análises 
            for (const product of productList) {
                const productById = await getProductById(product.productId)

                await updateProduct(
                    product.productId, 
                    {...productById, quantity: productById.quantity += product.quantity}
                )
            }

            setName("")
            setCustomerSelected(false)

            Messages.success("Pedido criado com sucesso")
            navigate("/pedidos");
        } catch (error) {
            console.error("[-] Erro ao criar pedido: ", error)
            Messages.error("Erro ao criar pedido")
        }   finally {
            setIsSubmitting(false);
        }
    }

    // Mudar o changeQuantity
    const changeQuantity = (newQuantity : number, productId: string) => {
        setProductList(currentProducts => 
            currentProducts.map(product => 
                product.uniqueId.toString() === productId 
                    ? {...product, quantity: newQuantity}
                    : product
            )
        )
    }

    const handleDeliveryFee = (value: string) => {
        // Remove tudo que não for número
        const numeric = value.replace(/\D/g, "");

        // Converte para reais
        const formatted = (Number(numeric) / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

        setDeliveryFee(formatted);
    };

    const handleClickAddressButton = async () => {
        if (!customerSelected || !customerId){
            Messages.dismiss()
            setDeliveryAddress("")
            Messages.error("Selecione um cliente exitente");
            return;
        } else{
            const customerData = await getCustomerById(customerId)
            const road = customerData.road
            const neighborhood = customerData.neighborhood
            const number = customerData.num
            const city = customerData.city

            const addressString = `${road}${number} - ${neighborhood}, ${city}`

            if (addressString === " - , ") {
                Messages.dismiss()
                Messages.error("Sem endereço cadastrado");
                return;
            } else {
                Messages.dismiss()
                Messages.success("Dados adicionados com sucesso");
                setDeliveryAddress(addressString)
            }
        }
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
                                    setNoRegister={setNoRegister}
                                    noRegister={noRegister}
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
                            <div className={styles.inputBox}>
                                <label htmlFor="data">Horário</label>
                                <input 
                                    className={styles.timeInput}
                                    type="time"
                                    value={time}
                                    placeholder="14:00"   
                                    maxLength={5} 
                                    onChange={(e) => {setTime(e.target.value)}}
                                />
                            </div>
                        </div>

                        {/* Entrega  */}
                        <div className={styles.delivery}>
                            <hr />
                            
                            <div className={styles.deliveryCheckBox}>
                                <label><BikeIcon/> Pedido para entrega?</label>
                                <ToggleSwitch 
                                    changeIsDelivery={setIsDelivery}
                                    isDelivery={isDelivery}
                                />
                            </div>

                            {isDelivery && (
                                <div>
                                    <div className={styles.deliveryInputBox}>
                                        <div className={styles.deliveryInput}>
                                            <label>Endereço </label>
                                            <input
                                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                                value={deliveryAddress}
                                                placeholder="Ex: Rua ABC 123 - Bairro XYZ"
                                            />
                                        </div>
                                        <div className={styles.deliveryInput}>
                                            <label style={{color:"var(--primary-light)"}}>
                                                Taxa de Entrega *
                                            </label>
                                            <input
                                                type="text"
                                                value={deliveryFee}
                                                placeholder="Ex: R$ 10,00"
                                                onChange={(e) => handleDeliveryFee(e.target.value)}
                                            />
                                        </div>                                    
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleClickAddressButton()}
                                        className={styles.reuse}
                                    >
                                        Usar endereço do Cliente
                                    </button>

                                </div>
                            )}
                            <hr />
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
                                                <th>Unidade</th>
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
                                <ProductSearch 
                                    productName={productName}
                                    onChangeName={setProductName}
                                    setProduct={setProduct}
                                    placeholder="Buscar produto para adicionar ao pedido..." 
                                />
                            </div>
                            <button
                                onClick={() => handleNewProduct()} 
                                className={styles.addItemButton}
                                type="button"
                            >
                                <PlusCircleIcon /> Adicionar Produto
                            </button>
                        </div>


                        {/* Obs e Total */}
                        <div className={styles.inputGroup2}>
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
                                
                                {/* Taxa de Entrega */}
                                {isDelivery && (
                                    <div className={styles.statsValueBox}>
                                        <label>Taxa de Entrega</label> 
                                        <p>R$ {priceNumber(deliveryFee).toFixed(2)}</p>
                                    </div>
                                )}

                                {/* Total */}
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
                                disabled={isSubmitting}
                            >        
                                <SaveIcon />
                                {isSubmitting ? "Salvando..." : "Salvar Pedido"}
                            </button>
                        </div>

                    </form>
                </div>
            </Container>
        </MainTemplate>
    )
}