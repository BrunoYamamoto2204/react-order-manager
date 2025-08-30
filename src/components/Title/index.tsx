import styles from "./Title.module.css"

type TitleProps = {
    title: string;
    subtitle: string;
}

export function Title({ title, subtitle } : TitleProps) {
    return (
        <div className={styles.titles}>
            <h1>{title}</h1>
            <h2>{subtitle}</h2>
        </div>
    )
} 