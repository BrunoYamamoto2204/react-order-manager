import { useEffect, useState } from "react";
import { Container } from "../../components/Container";
import { Title } from "../../components/Title";
import { MainTemplate } from "../../templates/MainTemplate";
import styles from "./CreatePedido.module.css";
import { PlusCircleIcon, RefreshCwIcon, SaveIcon, SearchIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Messages } from "../../components/Messages";
import { CreateOrderDatePicker } from "../../components/CreateOrderDatePicker";
import { CreateOrderList } from "../../components/CreateOrderList";
import { getOrderById, updateOrder } from "../../services/ordersApi";
import { formatDate } from "../../utils/format-date";

type Product = {
    id: number;
    product: string;
    price: string;
    quantity: number;
    unit: string;
}

export function EditPedido() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [ loading, setLoading ] = useState(true);

    // Input Values
    const [ discountType, setDiscountType ] = useState("%")
    const [ discountValue, setDiscountValue ] = useState("0")
    const [ noRegister, setNoRegister ] = useState(false);
    const [ productList, setProductList ] = useState<Product[]>([])

    const [ name, setName ] = useState("");
    const [ description, setDescription ] = useState("");
    const [ date, setDate ] = useState("")

    const [ total, setTotal ] = useState("")
    const [ totalGross, setTotalGross] = useState("")
    const [ discount, setDiscount ] = useState(0)

    const [ product, setProduct] = useState("");
    const [ unit ] = useState("UN");
    const [ quantity ] = useState("1");
    const [ price ] = useState("10.5");

    // Identifica qual order será modificada 
    useEffect(() => {
        document.title = "Editar Pedido - Comanda"

        // Atualiza os dados com essa order 
        const loadOrder = async () => {
            if (!id) return 

            try {
                setLoading(true)
                const order = await getOrderById(id)
                
                setDiscountType(order.discountType);
                setDiscountValue(order.discountValue);
                setProductList(order.products);
                setDiscountType(order.discountType);

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

        if(!name) {
            Messages.error("Selecione um cliente");
            return;
        } 
        if (productList.length <= 0) {
            Messages.error("Adiocione itens ao pedido");
            return;
        } 

        const formattedProducts = productList.map(p => 
            `${p.quantity}${p.unit} ${p.product}`
        );

        // Converte YYYY-MM-DD para dd/MM/yyyy
        const formatDateToDisplay = (dateStr: string) => {
            const [year, month, day] = dateStr.split("-");
            return `${day}/${month}/${year}`;
        };
    
        const updatedOrder = ({
            name: name,
            date: formatDateToDisplay(date),
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

            await updateOrder(id, updatedOrder)

            Messages.success("Pedido editado com sucesso")
            navigate("/pedidos");
        } catch (error){
            console.error("[-] Erro ao Editar Pedido: ", error)
            Messages.error("Erro ao Editar Pedido")
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

    // Adiociona produto no pedido
    const handleNewProduct = () => {
        Messages.dismiss()

        if (!product) {
            Messages.error("Selecione um produto");
            return;
        }

        const newProduct = {
            id: Number(Date.now()),
            product: product,  
            quantity: Number(quantity),
            price: price,
            unit: unit
        };

        setProductList([...productList, newProduct]);
        Messages.success("Produto adicionado")
        
        setProduct("");
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