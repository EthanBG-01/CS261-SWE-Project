import PropTypes from 'prop-types'
import Button from './Button'
import { Link, useHistory } from 'react-router-dom'

const Header = ({ title, color, text, onClick }) => {
    const history = useHistory()
    // clickFunc = () => {history.push("/create")}
    

    return (
        <header className='header'>
            <h2>{title}</h2>

            {/* <h4>Welcome back Host Name</h4>  try para*/}
            <Button color={color} text={text} onClick={onClick}/>
            {/* <Button color='pink' text='Create Event' onClick={()} /> */}
        </header>
    )
}

Header.defaultProps = {
    title: 'Website Name',
    color: 'pink',
}

Header.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    color: PropTypes.string,
    onClick: PropTypes.func,
}

export default Header
