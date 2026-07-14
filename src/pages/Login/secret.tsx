import { ArrowLeftIcon, ArrowRightIcon, CopyIcon, ShieldUserIcon } from "lucide-react"
import styles from "./Login.module.css"
import { useState } from "react"
import { Messages } from "../../components/Messages"
import { LoginMfa } from "./mfa"

type SecretProps = {
    userId: number
    backToLogin: () => void
}

export function Secret({ userId, backToLogin} : SecretProps) {
    const [ openSecret, setOpenSecret ] = useState(true)
    const [ secretManual ] = useState("BJEW RKOM PKRM TMKRO")

    const handleCopyClick = () => {
        navigator.clipboard.writeText(secretManual)
        Messages.success("Código copiado")
    }

    return ( !openSecret ? (
            <LoginMfa 
                userId={userId}
                setOpenSecret={setOpenSecret}
                backToLogin={backToLogin}
            />
        ) : (
            <div className={styles.secretContainer}>
                <div className={styles.secretHeader}>
                    <div className={styles.iconWrapper}>
                        <ShieldUserIcon />
                    </div>
                    <h1>Comanda App Security</h1>
                </div>
                <div className={styles.secretContent}>
                    <div className={styles.secretContainerHeader}>
                        <h2>Configuração Autenticação de Dois Fatores MFA</h2>
                        <p>
                            Aumente a segurança da sua conta adicionando uma camada extra de proteção. <br></br>
                            Para continuar, você precisa configurar um aplicativo autenticador.
                        </p>
                    </div>
                    <div className={styles.secretQrCodeContainer}>
                        <div className={styles.secretContainerQrCodeContent}>
                            <div className={styles.secretQrCode}>
                                <p>QR CODE</p>
                            </div>
                        </div>
                        <div className={styles.secretQrCodeInfo}>
                            <h3>PASSOS PARA CONFIGURAÇÃO:</h3>
                            <div className={styles.secretQrCodeInfoLines}>
                                <p className={styles.secretQrCodeInfoLinesNumber}>1</p>
                                <p>Abra o Google Authenticator, Microsoft Authenticator ou Authy no seu celular.</p>
                            </div>
                            <div className={styles.secretQrCodeInfoLines}>
                                <p className={styles.secretQrCodeInfoLinesNumber}>2</p>
                                <p>Selecione "Adicionar conta" ou o ícone "+" e escolha "Escanear código QR".</p>
                            </div>
                            <div className={styles.secretQrCodeInfoLines}>
                                <p className={styles.secretQrCodeInfoLinesNumber}>3</p>
                                <p>Aponte a câmera para o QR code ao lado ou insira a chave manualmente.</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.manualSecret}>
                        <h3>CÓDIGO SECRET (CONFIGURAÇÃO MANUAL)</h3>
                        <div className={styles.manualSecretContent}>
                            <p>{secretManual}</p>
                            <CopyIcon onClick={() => handleCopyClick()}/>
                        </div>
                    </div>
                    <div className={styles.containerButtons}>
                        <button 
                            className={styles.containerButtonsNext}
                            onClick={() => setOpenSecret(false)}
                        >
                            Continuar para verificação 
                            <ArrowRightIcon />
                        </button>
                        <p 
                            className={styles.containerButtonsBack}
                            onClick={() => backToLogin()}
                        >
                            <ArrowLeftIcon/> Voltar para o login
                        </p>
                    </div>
                </div>
            </div>
        )
    )
}