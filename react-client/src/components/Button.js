import PropTypes from 'prop-types'

const Button = ({ color, text, styleClass, onClick }) => {
    return (
        <button
        onClick={onClick}
        className={styleClass}
        >
            {text}    
        </button>
    )
}

Button.defaultProps = {
    color: 'pink',
}

Button.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string,
    onClick: PropTypes.func,
}

export default Button
