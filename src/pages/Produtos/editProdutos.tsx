import { useEffect, useState } from "react";
import { Container } from "../../components/Container";
import { Title } from "../../components/Title";
import { MainTemplate } from "../../templates/MainTemplate";
import styles from "./CreateProduto.module.css";
import { ChevronDownIcon, SaveIcon } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { Messages } from "../../components/Messages";
import { getProductById, updateProduct } from "../../services/productsApi";

export function EditProdutos() {
    const navigate = useNavigate();
    
    // Input Values
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");

    // Select Inputs
    const [isCategoryOpen, setIsCategoryOpen] = useState(false); 
    const [isUnOpen, setIsUnOpen] = useState(false); 
    const [selectCategory, setSelectCategory] = useState("Selecione uma categoria");
    const [selectUn, setSelectUn] = useState("Selecione uma unidade");

    const { id } = useParams<{id: string}>();
    const [ loading, setLoading] = useState(true);

    useEffect(() => {
        document.title = "Editar Produto - Comanda"

        if(!id) return 
        
        try{
            setLoading(true)
            const loadProducts = async () => {
                const product = await getProductById(id)

                setName(product.product)
                setPrice(product.price.toFixed(2).toString())
                setDescription(product.description || "")
                setSelectCategory(product.category)
                setSelectUn(product.unit)
            }

            loadProducts()
        } catch(error) {
            console.log(`[-] Erro carregar produto ${id}: `, error)
            Messages.error("Erro ao carregar produto")
        } finally {
            setLoading(false)
        }
    },[id])

    const selectOption = (option : string, type : string) => {
        if (type === "category") {
            setSelectCategory(option)
            setIsCategoryOpen(!isCategoryOpen)
        }
        else{
            setSelectUn(option)
            setIsUnOpen(!isUnOpen)
        }
    }

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault()
        Messages.dismiss()

        if (name === "" || 
            price === "" || 
            selectCategory === "Selecione uma categoria" || 
            selectUn === "Selecione uma unidade"
        ) {
            Messages.error("Preecha todos os campo obrigatórios")
            return
        }

        const editedProduct = {
            id: Number(id),
            product: name,
            price: Number(price),
            category: selectCategory,
            unit: selectUn,
            description: description
        } 

        try {
            if(!id) return

            await updateProduct(id, editedProduct)

            Messages.success("Produto criado com sucesso");
            navigate("/produtos");
        } catch(error) {
            console.log("[-] Erro ao editar produto: ", error)
            Messages.error("Erro ao editar produto")
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
                    title="Editar Produto" 
                    subtitle="Edite os dados do produto antes de salvar as alterações"
                />

                <div className={styles.formContent}>
                    <form onSubmit={handleSubmit}>
                        {/* Inputs Padrão */}
                        <div className={styles.inputGroup}>
                            <div className={styles.inputBox}>
                                <label htmlFor="nome">Nome do Produto *</label>
                                <input 
                                    id="nome" 
                                    autoComplete="off"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} 
                                    placeholder="Ex: Brigadeiro"/>
                            </div>
                            <div className={styles.inputBox}>
                                <label htmlFor="preco">Preço *</label>
                                <div className={styles.priceInput}>
                                    <input 
                                        id="preco" 
                                        autoComplete="off"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        type="number"
                                        placeholder="0,00"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Inputs de escolha */}
                        <div className={styles.inputGroup}>
                            <div className={styles.inputBox}>
                                {/* Categoria */}
                                <div className={styles.inputCategory}>
                                    <label htmlFor="categoria">Categoria *</label>
                                    <button 
                                        type="button"
                                        className={`${styles.dropbtn} ${isCategoryOpen ? styles.open : ""}`}
                                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                    >
                                        {selectCategory}
                                        <ChevronDownIcon/>
                                    </button>
                                    <div className={`${styles.dropdownContent} ${isCategoryOpen ? styles.open : ""}`}>
                                        <a onClick={() => 
                                            selectOption("Doce", "category")}>Doce
                                        </a>
                                        <a onClick={() => 
                                            selectOption("Salgado", "category")}>Salgado
                                        </a>
                                        <a onClick={() => 
                                            selectOption("Bolo", "category")}>Bolo
                                        </a>
                                        <a onClick={() => 
                                            selectOption("Sobremesa", "category")}>Sobremesa
                                        </a>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Unidade */}
                            <div className={styles.inputBox}>
                                <div className={styles.inputCategory}>
                                    <label htmlFor="unidade">Unidade *</label>
                                    <button 
                                        type="button"
                                        className={`${styles.dropbtn} ${isUnOpen ? styles.open : ""}`}
                                        onClick={() => setIsUnOpen(!isUnOpen)}
                                    >
                                        {selectUn}
                                        <ChevronDownIcon/>
                                    </button>
                                    <div className={`${styles.dropdownContent} ${isUnOpen ? styles.open : ""}`}>
                                        <a onClick={() => selectOption("UN", "un")}>UN</a>
                                        <a onClick={() => selectOption("KG", "un")}>Kg</a>
                                        <a onClick={() => selectOption("g", "un")}>g</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Descrição */}
                        <div className={styles.inputGroup}>
                            <div className={`${styles.inputBox} ${styles.description}`}>
                                <label htmlFor="descricao">Descrição (Opcional)</label>
                                <textarea 
                                    id="descricao" 
                                    value={description}
                                    placeholder="Detalhes do produto, ingredientes, observações, etc."
                                    autoComplete="off"
                                    onChange={(e) => setDescription(e.target.value)} 
                                />                            
                            </div>
                        </div>

                        {/* Botões */}
                        <div className={styles.buttons}>
                            <button 
                                onClick={() => {navigate("/produtos")}} 
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