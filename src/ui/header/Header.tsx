import { Link } from 'react-router'
import styles from "./header.module.css"

function Header() {
    return (
        <div className={styles.headerContainer}>
            <div className={styles.header}>
                <Link to="/">
                    Главная
                </Link>
                <Link to="/generate">
                    Конструктор
                </Link>
                <Link to="/my-projects">
                    Мои проекты
                </Link>
            </div>
        </div>
    )
}

export default Header