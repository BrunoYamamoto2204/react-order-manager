import { NavContainer } from "../../components/NavContainer";

import styles from "./MainTemplate.module.css"

type MainTemplateProps = {
    children: React.ReactNode;
}

export function MainTemplate({ children} : MainTemplateProps) {
    return (
        <div className={styles.mainTemplate}>
            <NavContainer />
            <main>
                {children}
            </main>
        </div>
    )
}