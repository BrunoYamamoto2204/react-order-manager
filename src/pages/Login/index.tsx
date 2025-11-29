import styles from "./Login.module.css"
import { useState } from "react";
import { login } from "../../services/authApi";
import { useNavigate } from "react-router";
import { Messages } from "../../components/Messages";
import { ClipboardListIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function Login() {
    const navigate = useNavigate()
    const { setUser } = useAuth()

    const [ loading, setLoading ] = useState(false)
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")

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

    return(
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <div className={styles.titleContainer}>
                    <h2><ClipboardListIcon /> Comanda App</h2>
                    <h3>Gerenciador de Pedidos</h3>
                    <hr />
                </div>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                        <label>Usuário</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    )
}