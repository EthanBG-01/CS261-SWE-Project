import React, { useState, useContext } from 'react';
import axios from 'axios';

import { UserContext } from '../contexts/UserContext'
import {useHistory} from "react-router-dom";

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [submitError, setSubmitError] = useState('');

    const {user, setUser} = useContext(UserContext);
    const history = useHistory();

    const login = async () => {

        let returnFlag = false;

        let payload = {
            'email': email,
            'password': password,
            'userType': "host"
        }

        if (email.length === 0) {
            setEmailError("Email cannot be left blank");
            returnFlag = true;
        } else {
            setEmailError("");
        }

        if (password.length === 0) {
            setPasswordError("Password cannot be left blank.");
            returnFlag = true;
        } else {
            setPasswordError("");
        }

        if (returnFlag) return;

        try {
            const result = await axios.post('http://localhost/user/login', {
                'email': email,
                'password': password,
                'userType': "host"
            });

            const user = {
                access: result.data.access_token,
                refresh: result.data.refresh_token,
            };

            setUser({user});

            history.push("/");

        } catch (e) {
            console.log(e.response.data.response);
            setSubmitError(e.response.data.response);
        }
    };

    return (
        <div className={"Login"}>
            <h1>Welcome! Host</h1>
            Register here to create events, projects and more to gain real-time feedback from your attendees and team members
            <br/><p>{submitError}</p><br/>
            <div>
                <h1>Email</h1>
                <p>{emailError}</p><br/>
                <input value={email} onChange={e=> setEmail(e.target.value)} />
                <br/>

                <h1>Password</h1>
                <p>{passwordError}</p><br/>
                <input
                    type="password"
                    value={password}
                    onChange={e=> setPassword(e.target.value)}/>
                <br/>

                <h1>Login</h1>
                <button onClick={login}> Login</button>
            </div>
        </div>
    );
}







 

