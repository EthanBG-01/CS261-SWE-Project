import PropTypes from 'prop-types'
import Button from './Button'
import { Link, useHistory } from 'react-router-dom'

import "../styles/Header.css";

const Header = ({ title, color, text, name, button, welcome, onClick ,saved }) => {
    const history = useHistory()
    // clickFunc = () => {history.push("/create")}
    

    return (
        <header className='header'>
            <div>
                {
                    welcome ? <p>Welcome Back, {name}.</p> : <></>
                }
                <h2>{title}</h2>
            </div>



            {/* <h4>Welcome back Host Name</h4>  try para*/}
            {saved ? (
                <h4>Event has been saved, Proceed to Main page through navigation bar</h4>
            ) : (
                <>
                {
                    button !== undefined ?
                        button === true ? <Button color={color} styleClass={"create"} text={text} onClick={onClick}/> : <></>
                                : <Button color={color} styleClass={"create"} text={text} onClick={onClick}/>
                }
                </>
            )}
                {/* {
                    button !== undefined ?
                        button === true ? <Button color={color} styleClass={"create"} text={text} onClick={onClick}/> : <></>
                                : <Button color={color} styleClass={"create"} text={text} onClick={onClick}/>
                } */}
        </header>
    )
}

Header.defaultProps = {
    title: 'Website Name',
    color: 'pink',
    saved: false
}

Header.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    color: PropTypes.string,
    onClick: PropTypes.func,
}

export default Header
