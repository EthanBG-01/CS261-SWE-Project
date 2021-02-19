import { Link } from 'react-router-dom'

const Nav = () => {
    const navStyle = {
        color: 'white'
    };

    return (
        <nav>
            <h3>Website Name</h3>
            <ul className="nav-links">
                <Link style={navStyle} to='/dashboard'>
                    <li>Dashboard</li>
                </Link>
                <Link style={navStyle} to='/'>
                    <li>Main</li>
                </Link>
                <Link style={navStyle} to='/login'>
                    <li>Log Out</li>
                </Link>
            </ul>
        </nav>
    )
}

export default Nav
