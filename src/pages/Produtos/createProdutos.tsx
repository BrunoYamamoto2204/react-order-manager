import { useEffect, useState } from "react";
import { Container } from "../../components/Container";
import { Title } from "../../components/Title";
import { MainTemplate } from "../../templates/MainTemplate";
import styles from "./CreateProduto.module.css";
import { ChevronDownIcon, SaveIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Messages } from "../../components/Messages";

export function CreateProdutos() {
    useEffect(() => {
        document.title = "Novo Produto - Comanda"
    },[])
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

    const handleSubmit = (e : React.FormEvent) => {
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

        setName("");
        setPrice("");
        setDescription("");
        setSelectCategory("Selecione uma categoria");
        setSelectUn("Selecione uma unidade");
        
        Messages.sucess("Produto criado com sucesso")

        console.log({
            name: name,
            price: price,
            category: selectCategory,
            unit: selectUn,
            description: description
        }) 

        return{
            name: name,
            price: price,
            category: selectCategory,
            unit: selectUn,
            description: description
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
                        {/* Inputs Padrão */}
                        <div className={styles.inputGroup}>
                            <div className={styles.inputBox}>
                                <label htmlFor="nome">Nome do Produto</label>
                                <input 
                                    id="nome" 
                                    autoComplete="off"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)} 
                                    placeholder="Ex: Brigadeiro"/>
                            </div>
                            <div className={styles.inputBox}>
                                <label htmlFor="preco">Preço</label>
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
                                    <label htmlFor="categoria">Categoria</label>
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
                                    <label htmlFor="unidade">Unidade</label>
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