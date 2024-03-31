import styles from './style.module.css'

export default function Header() {
    return (
        <>
            <div className={styles.nav}>
                <h1 className={styles.title}>TodoList</h1>
            </div>
        </>
    )
}