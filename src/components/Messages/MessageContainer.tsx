import { ToastContainer } from "react-toastify";

type MessagesContainerProps = {
    children: React.ReactNode
}

export function MessageContainer({ children } : MessagesContainerProps) {
    return(
        <>
            {children}
            <ToastContainer 
                pauseOnHover={false}
            />
        </>
    )
}