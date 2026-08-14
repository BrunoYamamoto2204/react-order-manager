import { BanknoteIcon, CakeIcon, ChartNoAxesCombinedIcon, SaveIcon, ScrollTextIcon, ShieldHalfIcon, User2Icon } from "lucide-react";
import { Container } from "../../components/Container";
import { MainTemplate } from "../../templates/MainTemplate";
import styles from "./Permissoes.module.css"
import { useEffect, useRef, useState } from "react";
import { Messages } from "../../components/Messages";
import { getPermissions, modifyPermission } from "../../services/permissionApi";
import { useAuth } from "../../hooks/useAuth";

export type PermissionsType = {
    products: string[]
    customers: string[]
    orders: string[]
    analyses: string[]
    financial: string[]
};

export type PemissionResponseType = {
    role: string
    products: string[]
    customers: string[]
    orders: string[]
    analyses: string[]
    financial: string[]
};

export function Permissoes() {
    const inputRef = useRef<HTMLDivElement>(null)

    const { setReadPemissions } = useAuth()

    const [ isSubmitting, setIsSubmitting ] = useState(false)
    const [ isOpen, setIsOpen ] = useState(false)

    const [ selectedUser, setSelectedUser ] = useState<string>()
    
    const [ roles, setRoles ] = useState<string[]>([])
    const [ content, setContent ] = useState<PemissionResponseType[]>()
    const [ permissions, setPermissions ] = useState<PermissionsType>({
        products: [],
        customers: [],
        orders: [],
        analyses: [],
        financial: [],
    });

    useEffect(() => { loadPermissions() }, [])

    // Identifica clique fora da modal
    useEffect(() => {
        const handleClickRef = (event: MouseEvent) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ){
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickRef)

        return () => {
            document.removeEventListener("mousedown", handleClickRef)
        }
    }, [])

    const loadPermissions = async () => {
        // Busca todos os registros de permissões para cada role
        const data = await getPermissions()
        setContent(data)
        
        // Define a lista de roles
        setRoles(data.map(r => r.role))

        const currentRole = selectedUser != undefined 
            ? selectedUser
            : data[0].role 

        // Define uma role padrão
        setSelectedUser(currentRole)

        // Define as permissões 
        selectUserPermissions(currentRole, data)
    }

    // Atualiza as permissões do usuário
    const selectUserPermissions = async (role: string, source: PemissionResponseType[]) => {
        const roleContent = source?.find(p => p.role === role)

        setPermissions({
            products: roleContent!.products,
            customers: roleContent!.customers,
            orders: roleContent!.orders,
            analyses: roleContent!.analyses,
            financial: roleContent!.financial,
        })
    }

    const getReadPermissions = () => {
        const views: string[] = []

        Object.entries(permissions).forEach(([, permissionList]) => {
            permissionList.forEach(permission => {
                if (permission === "read")
                    views.push(permission)
            })
        })

        setReadPemissions(views)
    }

    // Modifica as permissões e o usuário selecionadop
    const selectRole = (role: string) => {
        setSelectedUser(role)
        
        selectUserPermissions(role, content!)

        setIsOpen(!isOpen)
    }

    const selectUser = () => {
        return (
            <>
                <button
                    className={`${styles.userButton} ${isOpen ? styles.open : ""}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    
                    <div className={styles.userIcon}>
                        <User2Icon />
                    </div>
                    <div className={styles.userHeader}>
                        <p>Editando perfil de:</p>
                        <p className={styles.selectedUser}>
                            {selectedUser?.replace(selectedUser.charAt(0), selectedUser.charAt(0).toUpperCase())}
                        </p>
                    </div>
                </button>

                <div className={styles.dropdownContentContainer}>
                {
                    roles.map(u => (
                        <div 
                            key={u}
                            className={`${styles.dropdownContent} ${isOpen ? styles.open : ""}`}
                        >
                            <a onClick={() => selectRole(u)} href="#">
                                {u.replace(u.charAt(0), u.charAt(0).toUpperCase())}
                            </a>
                        </div>
                    ))
                }
                </div>
            </>
        )
    }

    const handleSubmit = async (e : React.FormEvent) => {
        e.preventDefault()

        try{
            setIsSubmitting(true)

            const payload = { role: selectedUser, actions: permissions}

            await modifyPermission(payload)

            Messages.success("Permissões alteradas com sucesso")
            
            getReadPermissions()

            loadPermissions()
        } catch(error) {
            Messages.error("Erro ao atualizar permissões")
        } finally {
            setIsSubmitting(false)
        }
    }

    const clearAction = (fromSubmut?: boolean) => {
        setPermissions({
            products: [],
            customers: [],
            orders: [],
            analyses: [],
            financial: []
        })

        if (!fromSubmut)
            Messages.success("Campos limpos")
    }

    const handleToggle = (module: keyof PermissionsType, permission: string) => {
        permissions[module].includes(permission) 
            ? setPermissions(prev => (
                {
                    ...prev, 
                    [module]: prev[module].filter(action => action != permission)
                }
            ))
            : setPermissions(prev => (
                {
                    ...prev, 
                    [module]: [...prev[module], permission]
                }
            ))
    }

    const permissionCard = (
        title: string, 
        subtitle: string, 
        module: keyof PermissionsType, 
        icon: React.ReactNode, 
        permissions: string[],
        span?: boolean,
        ocultar?: string[]
    ) => {
        return (
            <div className={`${styles.permissionCard} ${span ? styles.permissionCardFull : ""}`}>
                <div className={styles.permissionCardHeader}>
                    {icon}
                    <div className={styles.permissionCardHeaderTitle}>
                        <h3>{title}</h3>
                        <p>{subtitle}</p>
                    </div>
                </div>

                <div className={styles.permissionGrid}>
                    {(!ocultar || !ocultar.includes("read")) && (
                        <div className={styles.permissionCheckboxes}>
                            <input 
                                type="checkbox" 
                                id={`${module}Read`}
                                checked={permissions.includes("read")}
                                onChange={() => handleToggle(module, "read")}
                            />
                            <label htmlFor={`${module}Read`}>Visualizar</label>
                        </div>
                    )}

                    {(!ocultar || !ocultar.includes("create")) && (
                        <div className={styles.permissionCheckboxes}>
                            <input 
                                type="checkbox" 
                                id={`${module}Create`}
                                checked={permissions.includes("create")}
                                onChange={() => handleToggle(module, "create")}
                                disabled={!permissions.includes("read") ? true : false}
                            />
                            <label htmlFor={`${module}Create`}>Adicionar</label>
                        </div>
                    )}

                    {(!ocultar || !ocultar.includes("update")) && (
                        <div className={styles.permissionCheckboxes}>
                            <input 
                                type="checkbox" 
                                id={`${module}Update`}
                                checked={permissions.includes("update")}
                                onChange={() => handleToggle(module, "update")}
                                disabled={!permissions.includes("read") ? true : false}
                            />
                            <label htmlFor={`${module}Update`}>Editar</label>
                        </div>
                    )}

                    {(!ocultar || !ocultar.includes("delete")) && (
                        <div className={styles.permissionCheckboxes}>
                            <input 
                                type="checkbox" 
                                id={`${module}Delete`}
                                checked={permissions.includes("delete")}
                                onChange={() => handleToggle(module, "delete")}
                                disabled={!permissions.includes("read") ? true : false}
                            />
                            <label htmlFor={`${module}Delete`}>Excluir</label>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <MainTemplate>
            <Container>
                <div className={styles.headerContainer}>
                    <div className={styles.textsHeader}>
                        <div className={styles.textIconHeader}>
                            <ShieldHalfIcon/>
                            <p>CONFIGURAÇÕES DE ACESSO</p>
                        </div>
                        <h1>Permissões do Usuário</h1>
                        <h2>Defina o nível de acesso para cada módulo do sistema</h2>
                    </div>
                    
                    <div className={styles.dropdown} ref={inputRef}>
                        {selectUser()}
                    </div>
                    
                </div>
                <div className={styles.mainContainer}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.permissionContainer}>
                            {/* Produtos */}
                            {permissionCard("Produtos", "Gerenciamento de cadastro de produtos", "products", <CakeIcon/>, permissions.products)}
                            {/* Clientes */}
                            {permissionCard("Clientes", "Gerenciamento de cadastro de clientes", "customers", <User2Icon/>, permissions.customers)}
                            {/* Pedidos */}
                            {permissionCard("Pedidos", "Controle dos produtos e clientes do pedido", "orders", <ScrollTextIcon/>, permissions.orders)}
                            {/* Financeiro */}
                            {permissionCard("Financeiro", "Controle de receitas e despesas", "financial", <BanknoteIcon/>, permissions.financial)}
                            {/* Análises */}
                            {permissionCard("Análises", "Relatórios, KPI e Insights", "analyses", <ChartNoAxesCombinedIcon/>, permissions.analyses, true, ["create", "update", "delete"])}
                        </div>

                        <div className={styles.buttons}>
                            <button
                                className={styles.clean}
                                type="button"
                                onClick={() => clearAction()}
                            >
                                Limpar
                            </button>
                            <button
                                className={styles.save}
                                type="submit"
                                disabled={isSubmitting}
                            >
                                <SaveIcon />
                                {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                            </button>
                        </div>
                    </form>
                </div>
            </Container>
        </MainTemplate>
    )
}