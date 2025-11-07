import { useEffect, useState } from "react";
import { Container } from "../../components/Container";
import { Title } from "../../components/Title";
import { MainTemplate } from "../../templates/MainTemplate";
import styles from "./CreatePedido.module.css";
import { PlusCircleIcon, RefreshCwIcon, SaveIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Messages } from "../../components/Messages";
import { CreateOrderDatePicker } from "../../components/CreateOrderDatePicker";
import { CreateOrderList } from "../../components/CreateOrderList";
import { getOrderById, updateOrder } from "../../services/ordersApi";
import { formatDate } from "../../utils/format-date";
import CustomerSearch from "../../components/CustomerSearch";
import { getCustomerById, updateCustomer } from "../../services/customersApi";
import { ProductSearch } from "../../components/ProductSearch";
import { getProductById, updateProduct } from "../../services/productsApi";

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

    const [ previousProductList, setPreviousProductList ] = useState<OrderProduct[]>([])

    // Input Values
    const [ customerId, setCustomerId ] = useState<string | null>(null)
    const [ discountType, setDiscountType ] = useState("%")
    const [ discountValue, setDiscountValue ] = useState("0")
    const [ noRegister, setNoRegister ] = useState(false);
    const [ productList, setProductList ] = useState<OrderProduct[]>([])

    const [ name, setName ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ customerSelected, setCustomerSelected ] = useState(true);
    const [ date, setDate ] = useState("")

    const [ total, setTotal ] = useState("")
    const [ totalGross, setTotalGross] = useState("")
    const [ discount, setDiscount ] = useState(0)

    const [ productId, setProductId] = useState<string | null>(null)
    const [ productName, setProductName] = useState("")
    const [ product, setProduct ] = useState<OrderProduct>();

    // Identifica qual order será modificada 
    useEffect(() => {
        document.title = "Editar Pedido - Comanda"

        // Atualiza os dados com essa order 
        const loadOrder = async () => {
            if (!id) return 

            try {
                setLoading(true)
                const order = await getOrderById(id)
                
                setCustomerId(order.customerId ? order.customerId : null)
                setDiscountType(order.discountType);
                setDiscountValue(order.discountValue);
                setNoRegister(order.noRegister)
                setProductList(order.products);
                setPreviousProductList(order.products)

                setName(order.name)
                setDescription(order.obs)
                setDate(convertDateFormat(order.date))
                
                setTotal(order.value)
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
        setTotal(subtotal.toString()); 
    }, [productList, discountValue, discountType, grossValue]); 

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
            order.product !== listItem.product
        )

        setProductList(newOrder)
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

    // Adiociona produto no pedido
    const handleNewProduct = () => {
        Messages.dismiss()

        if (!product) {
            Messages.error("Selecione um produto");
            return;
        }

        const newProduct = {
            uniqueId: product.uniqueId,
            productId: product.productId,
            product: product.product,
            price: product.price,
            quantity: product.quantity,
            category: product.category,
            unit: product.unit,
        };

        setProductName("")
        setProductList([...productList, newProduct]);
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
        }

        else if(!customerSelected) {
            Messages.error("Selecione um cliente exitente");
            return;
        } 

        else if (productList.length <= 0) {
            Messages.error("Adicione itens ao pedido");
            return;
        } 

        const formattedProducts = productList.map(p => 
            `${p.quantity}${p.unit} ${p.product}`
        );
    
        const updatedOrder = ({
            customerId: noRegister ? null : customerId,
            name: name,
            noRegister: noRegister,
            date: formatDate(date),
            productsStrings: formattedProducts,
            products: productList,
            value: `R$ ${Number(total).toFixed(2)}`,        
            discount: Number(discount).toFixed(2),
            discountValue: discountValue,
            totalGross: totalGross,
            discountType: discountType,
            obs: description,
            status: "Pendente",
        }) 

        // Enviar para o banco de dados
        try {
            if(!id) return

            // Caso agora for marcado sem registro, retira o vinculo do id com o cliente antigo 
            if (noRegister) {
                setCustomerId(null)
            }

            await updateOrder(id, updatedOrder)

            if (!noRegister && customerId){
                const chosenCustomer = await getCustomerById(customerId)
                await updateCustomer(customerId, {...chosenCustomer, pendingOrders: true})
            }

            // Adicionar a quantidade de produtos nas análises 
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

            // for (const product of productList) {
            //     const productById = await getProductById(product.productId)

            //     // 
            //     await updateProduct(
            //         product.productId, 
            //         {...productById, quantity: productById.quantity += product.quantity}
            //     )
            // }

            // // Apenas o que não está ou mudou na lista editada
            // const productsDeleted = previousProductList.filter(product => (
            //     !productList.includes(product)
            // ))

            // if (productsDeleted){
            //     for (const product of productsDeleted) {
            //         const productById = await getProductById(product.productId)

            //         await updateProduct(
            //             product.productId,
            //             {...productById, quantity: productById.quantity -= product.quantity}
            //         )
            //     }
            // }

            Messages.success("Pedido editado com sucesso")
            navigate("/pedidos");
        } catch (error){
            console.error("[-] Erro ao Editar Pedido: ", error)
            Messages.error("Erro ao Editar Pedido")
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

    return(
        <MainTemplate>
            <Container>
                <Title 
                    title="Editar Pedido" 
                    subtitle="Edite os dados do pedido antes de salvar as alterações"
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
                                    setProductId={setProductId}
                                    placeholder="Buscar produto para adicionar ao pedido..." 
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
                                        - R$ {Number(discount).toFixed(2)}
                                    </p>
                                </div>

                                {/* Subtotal */}
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