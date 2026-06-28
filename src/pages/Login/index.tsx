import styles from "./Login.module.css"
import { useState } from "react";
import { login } from "../../services/authApi";
import { useNavigate } from "react-router";
import { Messages } from "../../components/Messages";
import { ClipboardListIcon, EyeClosedIcon, EyeIcon, LockIcon, UserIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function Login() {
    const navigate = useNavigate()
    const { setUser } = useAuth()

    const [ loading, setLoading ] = useState(false)
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")
    const [ viewPassword, setViewPassword ] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        try {
            // Faz login e cria o token no localstorage
            setLoading(true)
            const loginData = await login(username, password)
            setUser(loginData)

            navigate("/")
            Messages.success("Login bem-sucedido")
        } catch(error) {
            Messages.error("Credenciais incorretas")
            console.log("Erro de login: ", error)
            setError("Usuário ou senha inválidos")
        } finally {
            setLoading(false)
        }
    }

    const onClickVerSenha = () => {
        
    }

    return(
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <div className={styles.titleContainer}>
                    <div className={styles.titleComanda}>
                        <h2><ClipboardListIcon /> Comanda App</h2>
                        <h3>Gerenciador de Pedidos</h3>
                    </div>
                    <div className={styles.bemVindo}>
                        <h2>Bem-vindo de volta!</h2>
                        <p>Acesse sua conta para gerenciar seus pedidos.</p>
                    </div>
                </div>
                <div className={styles.login}>
                    <h2>Acessar Conta</h2>
                    <div className={styles.form}>
                        <form onSubmit={handleSubmit}>
                            <div className={styles.inputGroup}>
                                <label>Usuário</label>
                                <div className={styles.inputWithIcon}>
                                    <UserIcon className={styles.searchIcon}/>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Senha</label>
                                <div className={styles.inputWithIcon}>
                                    <LockIcon className={styles.searchIcon}/>
                                    <input
                                        type={viewPassword ? "text" : "password" }
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />

                                    {viewPassword ? (
                                        <EyeIcon onClick={() => setViewPassword(!viewPassword)} className={styles.eyeIcon}/>
                                    ) : (
                                        <EyeClosedIcon onClick={() => setViewPassword(!viewPassword)} className={styles.eyeIcon}/>
                                    )}
                                </div>
                            </div>
                            {error && <p className={styles.error}>{error}</p>}
                            <button type="submit" disabled={loading}>
                                {loading ? 'Entrando...' : 'Entrar'}
                            </button>
                        </form>
                        <div className={styles.formFooter}>
                            <p>&copy; 2026 Comanda App Dashboard.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}