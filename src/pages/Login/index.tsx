import styles from "./Login.module.css"
import { useRef, useState } from "react";
import { login, loginMfa } from "../../services/authApi";
import { useNavigate } from "react-router";
import { Messages } from "../../components/Messages";
import { ArrowLeftIcon, ClipboardListIcon, EyeClosedIcon, EyeIcon, LockIcon, ShieldUserIcon, UserIcon } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export function Login() {
    const navigate = useNavigate()
    const { setUser } = useAuth()

    const [ loading, setLoading ] = useState(false)
    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")
    const [ viewPassword, setViewPassword ] = useState(false)

    // MFA
    const [ mfa, setMfa ] = useState(false)
    const [ userId, setUserId ] = useState(0)

    const [ inputValue1, setInputValue1 ] = useState("")
    const [ inputValue2, setInputValue2 ] = useState("")
    const [ inputValue3, setInputValue3 ] = useState("")
    const [ inputValue4, setInputValue4 ] = useState("")
    const [ inputValue5, setInputValue5 ] = useState("")
    const [ inputValue6, setInputValue6 ] = useState("")

    const inputRef = useRef<HTMLDivElement[]>([])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            // Faz login e cria o token no localstorage
            setLoading(true)
            
            const loginData = await login(username, password)
            
            if(loginData.requiresMfa) {
                setUserId(loginData.userId)
                setMfa(loginData.requiresMfa)
            }
        } catch(error) {
            Messages.error("Credenciais incorretas")
            console.log("Erro de login: ", error)
            setError("Usuário ou senha inválidos")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmitMFA = async (e: React.FormEvent) => {
        e.preventDefault()

        const code = Number(`${inputValue1}${inputValue2}${inputValue3}${inputValue4}${inputValue5}${inputValue6}`)

        try {
            setLoading(true)

            const mfaData = await loginMfa(userId, code)
            setUser(mfaData.user)

            navigate("/")
            setError("")
            Messages.success("Login bem-sucedido")
        } catch (error) {
            Messages.error("Código incorreto")
            console.log("Erro de MFA: ", error)
        }
    }

    const handleChangeInput = (index: number, digit: string, setValue: any) => {
        if(digit != " "){
            // Caso for o último, não foca no próximo (inexistente)
            if(index === 5) setValue(digit)
            
            // 
            else if (!isNaN(Number(digit)) && index < 5 ){
                setValue(digit)
                // console.log(digit)
                inputRef.current[index + 1].focus()
            }
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number, setValue: any) => {
        const keyPressed = event.key

        if (keyPressed === "Backspace") setValue("") 
        
        if (keyPressed === "ArrowLeft") 
            if (index > 0) inputRef.current[index - 1].focus()
            
        if (keyPressed === "ArrowRight") 
            if (index < 5) inputRef.current[index + 1].focus()
    }

    const backToLogin = () => {
        setMfa(false)
        setUsername("")
        setPassword("")
        setError("")
    }
    
    return(
        mfa ? 
        (
            // --------------------------- Tela de MFA --------------------------- //
            <div className={styles.mfaContainer}>
                <div className={styles.mfaTitleContainer}>
                    <div className={styles.mfaTitleContainerIcon}>
                        <ShieldUserIcon />
                    </div>
                    <div className={styles.mfaTitleContainerTexts}>
                        <h2>Comanda App</h2>
                        <h3>Proteja sua conta</h3>
                        <p>Conta protegida com autenticação de dois fatores. Acesse o aplicativo Authenticator para obter o código.</p>
                    </div>
                </div>
                <div className={styles.mfaFormContainer}>
                    <div className={styles.mfaTitleContainerCode}>
                        <h2>Confirme seu acesso</h2>
                        <h3>Digite o cõdigo de 6 digitos enviado para o seu dispositivo.</h3>
                        <form onSubmit={handleSubmitMFA}>
                            <div className={styles.mfaTitleContainerInput}>
                                <input
                                    maxLength={1} type="text"
                                    ref={el => {inputRef.current[0] = el!}}
                                    onChange={(el) => {handleChangeInput(0, el.target.value, setInputValue1)}}
                                    onKeyDown={(e) => handleKeyDown(e, 0, setInputValue1)}
                                    value={inputValue1}
                                />
                                <input
                                    maxLength={1} type="text"
                                    ref={el => {inputRef.current[1] = el!}}
                                    onChange={(el) => {handleChangeInput(1, el.target.value, setInputValue2)}}
                                    onKeyDown={(e) => handleKeyDown(e, 1, setInputValue2)}
                                    value={inputValue2}
                                />
                                <input
                                    maxLength={1} type="text"
                                    ref={el => {inputRef.current[2] = el!}}
                                    onChange={(el) => {handleChangeInput(2, el.target.value, setInputValue3)}}
                                    onKeyDown={(e) => handleKeyDown(e, 2, setInputValue3)}
                                    value={inputValue3}
                                />
                                <input
                                    maxLength={1} type="text"
                                    ref={el => {inputRef.current[3] = el!}}
                                    onChange={(el) => {handleChangeInput(3, el.target.value, setInputValue4)}}
                                    onKeyDown={(e) => handleKeyDown(e, 3, setInputValue4)}
                                    value={inputValue4}
                                />
                                <input
                                    maxLength={1} type="text"
                                    ref={el => {inputRef.current[4] = el!}}
                                    onChange={(el) => {handleChangeInput(4, el.target.value, setInputValue5)}}
                                    onKeyDown={(e) => handleKeyDown(e, 4, setInputValue5)}
                                    value={inputValue5}
                                />
                                <input
                                    maxLength={1} type="text"
                                    ref={el => {inputRef.current[5] = el!}}
                                    onChange={(el) => {handleChangeInput(5, el.target.value, setInputValue6)}}
                                    onKeyDown={(e) => handleKeyDown(e, 5, setInputValue6)}
                                    value={inputValue6}
                                />
                            </div>

                            <button className={styles.mfaTitleContainerInputButton} type="submit">
                                Enviar
                            </button>
                            <div onClick={() => backToLogin()} className={styles.voltar}>
                                <ArrowLeftIcon />
                                <p>Voltar</p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        ) : (
            // --------------------------- Tela de login --------------------------- //
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
    )
}