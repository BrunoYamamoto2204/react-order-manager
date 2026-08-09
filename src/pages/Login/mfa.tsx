import { ArrowLeftIcon, ShieldUserIcon } from "lucide-react"
import styles from "./Login.module.css"
import { useRef, useState } from "react"
import { Messages } from "../../components/Messages"
import { useNavigate } from "react-router"
import { useAuth } from "../../hooks/useAuth"
import { confirmUserSecret, loginMfa } from "../../services/authApi"

type LoginMfaProps = {
    userId: number
    requireSecret: boolean
    setOpenSecret?: (secretScreen: boolean) => void
    backToLogin: () => void
}

export function LoginMfa({ userId, requireSecret, setOpenSecret, backToLogin } : LoginMfaProps) {
    const navigate = useNavigate()
    const { setUser } = useAuth()

    const [ isSubmiting, setIsSubmiting ] = useState(false)

    const [ inputValue1, setInputValue1 ] = useState("")
    const [ inputValue2, setInputValue2 ] = useState("")
    const [ inputValue3, setInputValue3 ] = useState("")
    const [ inputValue4, setInputValue4 ] = useState("")
    const [ inputValue5, setInputValue5 ] = useState("")
    const [ inputValue6, setInputValue6 ] = useState("")

    const inputRef = useRef<HTMLDivElement[]>([])   

    const handleSubmitMFA = async (e: React.FormEvent) => {
        e.preventDefault()

        const code = `${inputValue1}${inputValue2}${inputValue3}${inputValue4}${inputValue5}${inputValue6}`

        try {
            setIsSubmiting(true)

            // Apenas quando o secret ainda não foi configurado
            if (requireSecret)
                await confirmUserSecret(userId, code)

            const mfaUser = await loginMfa(userId, code)
            setUser(mfaUser)

            navigate("/")
            Messages.success("Login bem-sucedido")
        } catch (error) {
            const erroMessage = error instanceof Error ? error.message : "Erro na autenticação MFA"
            Messages.error(erroMessage) 
            console.log("Erro de MFA: ", error)
        } finally {
            setIsSubmiting(false)
        }
    }

    const handleChangeInput = (index: number, digit: string, setValue: any) => {
        if(digit != " "){
            
            if (!isNaN(Number(digit))) {
                setValue(digit)

                // Caso for o último, não foca no próximo (inexistente)
                if (index < 5)
                    inputRef.current[index + 1].focus()
            }
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number, setValue: any) => {
        const keyPressed = event.key

        if (keyPressed === "Backspace") {
            event.preventDefault();
            
            setValue("");

            if (index > 0){
                setValue("")
                inputRef.current[index - 1].focus()
            }
        }
        
        if (keyPressed === "ArrowLeft") 
            if (index > 0) inputRef.current[index - 1].focus()
            
        if (keyPressed === "ArrowRight") 
            if (index < 5) inputRef.current[index + 1].focus()
    }

    const handleBackButton = () => {
        if (setOpenSecret) {
            setOpenSecret(true) // Se tiver secret, volta para a tela de secret
        } else {
            backToLogin() // Se não, volta direto p/ de login
        }
    }

    return (
        <div className={styles.mfaContainer}>
            <div className={styles.mfaTitleContainer}>
                <div className={styles.mfaTitleContainerIcon}>
                    <ShieldUserIcon />
                </div>
                <div className={styles.mfaTitleContainerTexts}>
                    <h2>Comanda App</h2>
                    <h3>Proteja sua conta</h3>
                    <p>
                        Autenticação de dois fatores ativa. Abra o Google Authenticator 
                        ou qualquer app compatível (Microsoft Authenticator, Authy) 
                        e insira o código de 6 dígitos exibido.
                    </p>
                </div>
            </div>
            <div className={styles.mfaFormContainer}>
                <div className={styles.mfaTitleContainerCode}>
                    <h2>Confirme seu acesso</h2>
                    <h3>Digite o código de 6 digitos enviado para o seu dispositivo.</h3>
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

                        <button className={styles.mfaTitleContainerInputButton} type="submit" disabled={isSubmiting}>
                            {isSubmiting ? "Entrando..." : "Entrar"}
                        </button>
                            
                        <div onClick={() => handleBackButton()} className={styles.voltar}>
                            <ArrowLeftIcon />
                            <p>Voltar</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

