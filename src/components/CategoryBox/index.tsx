import { ChevronDownIcon, TrashIcon } from "lucide-react"
import styles from "./CategoryBox.module.css"
import { Messages } from "../Messages"
import { useState } from "react"
import { createProductType, deleteProductType, type ProductType } from "../../services/productTypeApi"

type CategoryBoxProps = {
    setOpenCreateBox: (open: boolean) => void
    openCreateBox: boolean
    setOpenCreateCategory: (open: boolean) => void
    productTypes: ProductType[]
    setProductTypes: (type: ProductType[]) => void
}

export function CategoryBox({
    setOpenCreateBox, 
    openCreateBox, 
    setOpenCreateCategory,
    productTypes,
    setProductTypes
} : CategoryBoxProps){
    const [ createCategoryName, setCreateCategoryName ] = useState(""); 
    const [ createCategoryDescription, setCreateCategoryDescription ] = useState(""); 

    const [ isSubmittingCategory, setSubmittingCategory ] = useState(false);

    const newCategory = async () => {
        if (createCategoryName === "") {
            Messages.dismiss()
            Messages.error("Adicione o nome da categoria")
            return
        }

        const productCategory ={
            name: createCategoryName,
            description: createCategoryDescription
        }

        try {
            setSubmittingCategory(true);
            const newcategory = await createProductType(productCategory)

            const newProductTypeList = [...productTypes, newcategory]
            setProductTypes(newProductTypeList)

            setCreateCategoryName("")
            setCreateCategoryDescription("")
            
            Messages.success("Categoria criada com sucesso")
        } catch(error) {
            console.error("[-] Erro ao criar categoria: ", error)
            Messages.error("Erro ao criar categoria")
        } finally {
            setSubmittingCategory(false);
        }
    }
    
    const removeProductCategory = async (id: string) => {
        const newProductTypeList = productTypes.filter(type => 
            type._id !== id
        )
        setProductTypes(newProductTypeList)

        await deleteProductType(id)
        Messages.success("Categoria excluída com sucesso")
    }

    return (
        <>
            <div className={styles.overlay} onClick={() => setOpenCreateCategory(false)}>
                <div 
                    className={styles.createCategoryDiv} 
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3>Categorias</h3>

                    {/* Abrir Criação de Categoria */}
                    <div className={styles.creteOpen}>   
                        <div 
                            className={styles.creteOpenHeader}
                            onClick={() => setOpenCreateBox(!openCreateBox)}
                        >
                            <p>
                                <ChevronDownIcon
                                    className={openCreateBox ? `${styles.openCategory}` : ``}
                                />
                            </p>
                            <p>Criar Categoria:</p>
                        </div>
                        {openCreateBox && (
                            <div>
                                {/* Inputs */}
                                <div className={styles.creteOpenInput}>
                                    <div className={styles.creteOpenBox}>
                                        <label>Nome</label>
                                        <input
                                            placeholder="Categoria A"
                                            value={createCategoryName}
                                            onChange={
                                                e => setCreateCategoryName(e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className={styles.creteOpenBox}>
                                        <label>Descrição (Opcional)</label>
                                        <input
                                            placeholder="Add Observações"
                                            value={createCategoryDescription}
                                            onChange={e =>
                                                setCreateCategoryDescription(
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                {/* Botao de criar */}
                                <div className={styles.createCategoryFooter}>
                                    <button
                                        type="button"
                                        className={styles.createCategoryButton}
                                        onClick={() => newCategory()}
                                        disabled={isSubmittingCategory}
                                    >
                                        {isSubmittingCategory ? "Criando..." : "Criar"}
                                    </button>
                                </div>

                                <hr />
                            </div>
                        )}
                    </div>

                    {/* Lista de Categorias */}
                    <div>
                        <div className={styles.categoryListHeader}>
                            <h4>Nome</h4>
                            <h4>Descrição</h4>
                        </div>
                    </div>
                    
                    <hr className={styles.categoryListHr}/>

                    <div className={styles.categoryList}>
                        {productTypes.map((type, index) => {
                            return (
                                <>
                                    <div className={styles.categoryListValues}>
                                        <p>{type.name}</p>
                                        <p className={styles.categoryListDescription}>
                                            {   
                                                type.description ? 
                                                type.description : "Sem descrição "
                                            }
                                        </p>
                                        <p>
                                            <TrashIcon
                                                onClick={() => 
                                                    removeProductCategory(type._id!)
                                                }
                                            />
                                        </p>
                                    </div>
                                    
                                    {index < productTypes.length - 1 ? <hr /> : ""}
                                </>
                            )
                        })}
                    </div>

                    <button 
                        type="button"
                        className={styles.categoryListCancel}
                        onClick={() => setOpenCreateCategory(false)}
                    >
                        Fechar 
                    </button>
                </div>
            </div>
        </>
    )
}