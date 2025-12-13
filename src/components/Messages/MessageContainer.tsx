import { ToastContainer } from "react-toastify";

type MessagesContainerProps = {
    children: React.ReactNode
}

export function MessageContainer({ children } : MessagesContainerProps) {
    return(
        <>
            {children}
            <ToastContainer 
                autoClose={2000}
                theme="colored"
                position="top-left"
                pauseOnHover={false}
                pauseOnFocusLoss={false} 
                closeOnClick
                style={{ zIndex: 99999 }}
            />
        </>
    )
}