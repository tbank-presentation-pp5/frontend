import { Link } from 'react-router'
import './header.css'

function Header() {
    return (
        <div className='header-container'>
            <div className='header'>
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