import PropTypes from 'prop-types'
import Button from './Button'
import { Link } from 'react-router-dom'

const Header = ({ title }) => {
    const onClick = () => {
        console.log('Click')
    }

    return (
        <header className='header'>
            <h2>{title}</h2>

            {/* <h4>Welcome back Host Name</h4>  try para*/}
            <Button color='pink' text='Create Event' />
            {/* <Button color='pink' text='Create Event' onClick={()} /> */}
        </header>
    )
}

Header.defaultProps = {
    title: 'Website Name',
}

Header.propTypes = {
    title: PropTypes.string,
}

export default Header
