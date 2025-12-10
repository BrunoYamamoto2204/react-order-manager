import { useEffect, useState } from "react";
import { Container } from "../../components/Container";
import { Title } from "../../components/Title";
import { MainTemplate } from "../../templates/MainTemplate";
import styles from "./CreateProduto.module.css";
import { ChevronDownIcon, SaveIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Messages } from "../../components/Messages";
import { createProduct } from "../../services/productsApi";
import { getProductTypes, type ProductType } from "../../services/productTypeApi";
import { CategoryBox } from "../../components/CategoryBox";

export function CreateProdutos() {
    useEffect(() => {
        document.title = "Novo Produto - Comanda"
    },[])
    const navigate = useNavigate();

    const [ isSubmitting, setIsSubmitting ] = useState(false);

    // Input Values
    const [ name, setName ] = useState("");
    const [ price, setPrice ] = useState("");
    const [ description, setDescription ] = useState("");

    // Select Inputs
    const [ isCategoryOpen, setIsCategoryOpen ] = useState(false); 
    const [ isUnOpen, setIsUnOpen ] = useState(false); 
    const [ selectCategory, setSelectCategory ] = useState("Selecione uma categoria");
    const [ selectUn, setSelectUn ] = useState("Selecione uma unidade");

    const [ productTypes, setProductTypes ] = useState<ProductType[]>([]); 

    const [ openCreateCategory, setOpenCreateCategory ] = useState(false);
    const [ openCreateBox, setOpenCreateBox ] = useState(false);    

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

    useEffect(() => {
        const loadProductTypes = async () => {
            try{
                const data = await getProductTypes()
                setProductTypes(data)
            } catch(error){
                console.log("Erro ao carregar os tipos dos produtos:", error)
                Messages.error("Erro ao carregar os cateorias")
            }
        } 

        loadProductTypes()
    }, [])

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

        // Garante que não adicione vários produtos
        if (isSubmitting) return; 
        setIsSubmitting(true);

        const priceNumber = Number(
            price.replace("R$", "").replace(/\s/g, "").replace(".", "").replace(",", ".")
        );

        const newProduct = {
            product: name,
            price: priceNumber,
            category: selectCategory,
            unit: selectUn,
            quantity: 0,
            description: description || ""
        } 

        try{
            await createProduct(newProduct)
            
            setName("");
            setPrice("");
            setDescription("");
            setSelectCategory("Selecione uma categoria");
            setSelectUn("Selecione uma unidade");
            
            Messages.success("Produto criado com sucesso")
            navigate("/produtos")
        } catch(error) {
            console.log("Erro ao criar produto: ", error)
            Messages.error("Erro ao criar produto")
        } finally {
            setIsSubmitting(false);
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

        setPrice(formatted);
    };

    return(
        <MainTemplate>
            <Container>
                <Title 
                    title="Novo Produto" 
                    subtitle="Preencha os dados para cadastrar um novo produto"
                />

                {openCreateCategory && (
                    <CategoryBox
                        setOpenCreateBox={setOpenCreateBox}
                        openCreateBox={openCreateBox}
                        setOpenCreateCategory={setOpenCreateCategory}
                        productTypes={productTypes}
                        setProductTypes={setProductTypes}
                    />
                )}

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
                                        onChange={(e) => handleProductPrice(e.target.value)}
                                        placeholder="R$ 0,00"
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
                                    <div 
                                        className={`${styles.dropdownContent} ${isCategoryOpen ? styles.open : ""}`}
                                    >
                                        {productTypes.map(type => {
                                            return (
                                                <a onClick={() => 
                                                    selectOption(`${type.name}`, "category")}
                                                >
                                                    {type.name}
                                                </a>
                                            )
                                        })}
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
                                className={styles.categoryButton} 
                                type="button"
                                onClick={() => setOpenCreateCategory(true)}
                            >        
                                Gerenciar Categorias
                            </button>
                            <div className={styles.saveAndCancelDiv}>
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