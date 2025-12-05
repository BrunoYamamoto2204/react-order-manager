import { useEffect, useState } from "react";
import { Container } from "../../components/Container";
import { Title } from "../../components/Title";
import { MainTemplate } from "../../templates/MainTemplate";
import styles from "./CreatePedido.module.css";
import { BikeIcon, PlusCircleIcon, RefreshCwIcon, SaveIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Messages } from "../../components/Messages";
import { CreateOrderDatePicker } from "../../components/CreateOrderDatePicker";
import { CreateOrderList } from "../../components/CreateOrderList";
import { getOrderById, updateOrder } from "../../services/ordersApi";
import { formatDate } from "../../utils/format-date";
import CustomerSearch from "../../components/CustomerSearch";
import { ProductSearch } from "../../components/ProductSearch";
import { getProductById, updateProduct } from "../../services/productsApi";
import { getCustomerById } from "../../services/customersApi";
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

export function EditPedido() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [ loading, setLoading ] = useState(true);

    const [ isMobile, setIsMobile ] = useState(false)

    const [ isSubmitting, setIsSubmitting ] = useState(false);

    const [ previousProductList, setPreviousProductList ] = useState<OrderProduct[]>([])

    // Input Values
    const [ customerId, setCustomerId ] = useState<string | null>(null)
    const [ discountType, setDiscountType ] = useState("%")
    const [ discountValue, setDiscountValue ] = useState("0")
    const [ noRegister, setNoRegister ] = useState(false);
    const [ productList, setProductList ] = useState<OrderProduct[]>([])
    const [ status, setStatus] = useState("")

    const [ name, setName ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ date, setDate ] = useState("")
    const [ time, setTime] = useState(new Date().toLocaleDateString("sv-SE")) 
    const [ customerSelected, setCustomerSelected ] = useState(true);

    const [ total, setTotal ] = useState(0)
    const [ totalGross, setTotalGross] = useState("")
    const [ discount, setDiscount ] = useState(0)

    const [ productName, setProductName] = useState("")
    const [ product, setProduct ] = useState<OrderProduct>();

    const [ isDelivery, setIsDelivery ] = useState(false);
    const [ deliveryAddress, setDeliveryAddress ] = useState("");
    const [ deliveryFee, setDeliveryFee ] = useState("");

    useEffect(() => {
        const mediaQueryMobile = window.matchMedia("(max-width: 1050px)")
        setIsMobile(mediaQueryMobile.matches)

        const handleMobile = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches)
        }

        mediaQueryMobile.addEventListener("change", handleMobile)
        return () => {
            mediaQueryMobile.removeEventListener("change", handleMobile)
        }
    },[])

    // Identifica qual order será modificada 
    useEffect(() => {
        document.title = "Editar Pedido - Comanda"

        // Atualiza os dados com essa order 
        const loadOrder = async () => {
            if (!id) return 

            try {
                setLoading(true)
                const order = await getOrderById(id)
                const totalValue = Number(order.value.replace("R$", ""))
                
                setCustomerId(order.customerId ? order.customerId : null)
                setDiscountType(order.discountType);
                setDiscountValue(order.discountValue);
                setNoRegister(order.noRegister)
                setProductList(order.products);
                setPreviousProductList(order.products)
                setStatus(order.status)

                setIsDelivery(order.isDelivery)
                setDeliveryAddress(order.deliveryAddress!)
                setDeliveryFee(order.deliveryFee!)

                setName(order.name)
                setDescription(order.obs)
                setDate(convertDateFormat(order.date))
                setTime(order.time)
                
                setTotal(totalValue)
                setTotalGross(order.totalGross)
                setDiscount(Number(order.discount))  
            } catch (error){
                console.error(`[-] Erro ao carregar pedido ${id}: `, error)
                Messages.error("Erro ao editar pedido")
            } finally {
                setLoading(false)
            }
        }; 

        loadOrder()
    },[id])

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
        const subtotal = Math.max(0, grossValue - currentDiscountAmount) + priceNumber(deliveryFee);
        setTotal(subtotal); 
    }, [productList, discountValue, discountType, grossValue, deliveryFee]); 

    // Formtar data: dd/MM/YYYY - YYYY-MM-dd
    const convertDateFormat = (dateStr: string) => {
        if (!dateStr || !dateStr.includes('/')) {
            return new Date().toISOString().split('T')[0];
        }
        const [ day, month, year ] = dateStr.split("/")
        return `${year}-${month}-${day}`
    };

    // Troca o tipo de Desconto
    const changeDiscountType = () => {
        return discountType == "%" ? setDiscountType("R$") : setDiscountType("%")
    }

    // Excluir o item 
    const removeProduct = (listItem: OrderProduct) => {
        const currentOrderList = [...productList]

        const newOrder = currentOrderList.filter(order => 
            order.uniqueId !== listItem.uniqueId
        )

        setProductList(newOrder)
    }

    // Adiociona produto no pedido
    const handleNewProduct = (productToAdd: OrderProduct) => {
        Messages.dismiss()

        if (!productToAdd) {
            Messages.error("Selecione um produto");
            return;
        }

        // const newProduct = {
        //     uniqueId: product.uniqueId,
        //     productId: product.productId,
        //     product: product.product,
        //     price: product.price,
        //     quantity: product.quantity,
        //     category: product.category,
        //     unit: product.unit,
        // };

        setProductName("")
        setProduct(undefined)
        setProductList([...productList, productToAdd]);
        Messages.success("Produto adicionado")
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
        } else if(!customerSelected) {
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

        // Garante que não adicione vários pedidos
        if (isSubmitting) return; 
        setIsSubmitting(true);

        const formattedProducts = productList.map(p => 
            `${p.quantity} ${p.unit} ${p.product}`
        );
    
        const updatedOrder = ({
            customerId: noRegister ? null : customerId,
            isDelivery: isDelivery,
            deliveryAddress: deliveryAddress,
            deliveryFee: deliveryFee,
            name: name,
            noRegister: noRegister,
            date: formatDate(date),
            time: time,
            productsStrings: formattedProducts,
            products: productList,
            value: `R$ ${Number(total).toFixed(2)}`,        
            discount: Number(discount).toFixed(2),
            discountValue: discountValue,
            totalGross: totalGross,
            discountType: discountType,
            obs: description,
            status: status,
        }) 

        // Enviar para o banco de dados
        try {
            if(!id) return

            // Caso agora for marcado sem registro, retira o vinculo do id com o cliente antigo 
            if (noRegister) {
                setCustomerId(null)
            }

            await updateOrder(id, updatedOrder)

            // Adicionar a quantidade de produtos nas quantidade dentro de products 
            for (const newProduct of productList) {
                // Valida se cada item da lista atual faz parte da lista antiga
                const oldProduct = previousProductList.find(p => 
                    p.productId === newProduct.productId
                )
                
                // Produto que já existia
                if (oldProduct) {
                    const result = newProduct.quantity - oldProduct.quantity

                    const currentProduct = await getProductById(newProduct.productId)
                    await updateProduct(newProduct.productId, {
                        ...currentProduct,
                        quantity: currentProduct.quantity + result
                        
                    })
                }
                
                // Produto novo
                else {
                    const currentProduct = await getProductById(newProduct.productId)
                    await updateProduct(newProduct.productId, {
                        ...currentProduct,
                        quantity: currentProduct.quantity + newProduct.quantity
                    })
                }
            }

            // Remover produtos 
            for (const oldProduct of previousProductList) {
                const checkProduct = productList.find(p => (
                    p.productId === oldProduct.productId
                ))

                if (!checkProduct) {
                    const currentProduct = await getProductById(oldProduct.productId)
                    await updateProduct(oldProduct.productId, {
                        ...currentProduct,
                        quantity: currentProduct.quantity - oldProduct.quantity
                        
                    })
                }
            }

            Messages.success("Pedido editado com sucesso")
            navigate("/pedidos");
        } catch (error){
            console.error("[-] Erro ao Editar Pedido: ", error)
            Messages.error("Erro ao Editar Pedido")
        } finally {
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

            const addressString = `${road} ${number} - ${neighborhood}, ${city}`

            if (addressString === "  - , ") {
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

    if (loading) {
        return (
            <MainTemplate>
                <Container>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        Carregando pedido...
                    </div>
                </Container>
            </MainTemplate>
        );
    }

    if (isMobile) {
        return (
            <MainTemplate>
                <Container>
                    <Title 
                        title="Novo Pedido" 
                        subtitle="Preencha os dados para criar um novo pedido"
                    />
                    <div className={styles.formContent}>
                        <form 
                            onSubmit={handleSubmit}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") e.preventDefault()
                            }}
                        >
                            <div className={styles.inputBox}>
                                <label htmlFor="nome">Cliente</label>
                                <CustomerSearch 
                                    customerName={name}
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
                                        className={styles.noResgiterInput}
                                        type="checkbox" 
                                        name="noName" 
                                        id="noName" 
                                        checked={noRegister}
                                        onChange={() => setNoRegister(!noRegister)}
                                    />
                                </div>
                            </div>
                            <hr />
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
                            <hr />
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
                                    {productList.length > 0 ? (
                                        <CreateOrderList 
                                            productList={productList} 
                                            changeQuantity={changeQuantity}
                                            removeProduct={removeProduct}
                                        />
                                    ) : (
                                        <div className={styles.mqNoProductsContainer}> 
                                            <p className={styles.noProducts}>
                                                Adicione Produtos ao Pedido
                                            </p>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Adicionar Produto */}
                                <h3 style={{marginTop:"3rem"}}>Adicionar Produto</h3>
                                <div className={styles.inputWithIcon} >
                                    <ProductSearch 
                                        productName={productName}
                                        onChangeName={setProductName}
                                        setProduct={setProduct}
                                        placeholder="Buscar produto para adicionar ao pedido..." 
                                        onEnterPress={handleNewProduct}
                                    />
                                </div>
                                <button
                                    onClick={() => handleNewProduct(product!)} 
                                    className={styles.addItemButton}
                                    type="button"
                                >
                                    <PlusCircleIcon /> Adicionar Produto
                                </button>
                            </div>

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
                            
                            {/* Descontos */}
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
                            </div>
                        </form>
                    </div>
                </Container>
            </MainTemplate>
        )
    }

    return(
        <MainTemplate>
            <Container>
                <Title 
                    title="Editar Pedido" 
                    subtitle="Edite os dados do pedido antes de salvar as alterações"
                />

                <div className={styles.formContent}>
                    <form 
                        onSubmit={handleSubmit}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") e.preventDefault()
                        }}
                    
                    >
                        {/* Inputs Padrão */}
                        <div className={styles.inputGroup}>
                            <div className={styles.inputBox}>
                                <label htmlFor="nome">Cliente</label>
                                <CustomerSearch 
                                    customerName={name}
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
                                                    productList={productList} 
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
                                    onEnterPress={handleNewProduct}
                                />
                            </div>
                            <button
                                onClick={() => handleNewProduct(product!)} 
                                className={styles.addItemButton}
                                type="button"
                            >
                                <PlusCircleIcon/> Adicionar Produto
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
                                        - R$ {Number(discount).toFixed(2)}
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
                                        R$ {Number(total).toFixed(2)}
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