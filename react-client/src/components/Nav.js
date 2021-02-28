import React, { useState, useContext } from 'react';

import { Link } from 'react-router-dom'
import { UserContext } from '../contexts/UserContext'
import { useHistory } from "react-router-dom";

const Nav = () => {
    const {user, setUser} = useContext(UserContext);
    const history = useHistory();

    const navStyle = {
        color: 'white'
    };

    const logout = () => {
        const user = {
            access: undefined,
            refresh: undefined,
            login: false,
        };

        setUser({user});
        history.push("/login");
    }

    return (
        <nav>
            <h3>RT-Feedback</h3>
            <ul className="nav-links">
                <Link style={navStyle} to='/dashboard'>
                    <li>Dashboard</li>
                </Link>
                <Link style={navStyle} to='/'>
                    <li>Main</li>
                </Link>
                <Link style={navStyle} onClick={logout}>
                    <li>Log Out</li>
                </Link>
            </ul>
        </nav>
    )
}

export default Nav
