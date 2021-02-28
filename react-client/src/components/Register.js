import React, { useState, useContext } from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';

import { UserContext } from '../contexts/UserContext'

export default function Register() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [submitError, setSubmitError] = useState('');

    const {user, setUser} = useContext(UserContext);
    const history = useHistory();

    const register = async () => {

        let returnFlag = false;

        let payload = {
            'name': name,
            'email': email,
            'password': password,
            'userType': "host"
        }

        if (name === 0) {
            setNameError("Name cannot be left blank");
            returnFlag = true;
        } else{
            setNameError("");
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
            const result = await axios.post('http://localhost/user/register', {
                'name':name,
                'email':email,
                'password':password,
                'userType':"host"
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
        <div className={"Register"}>
            <h1>Welcome! Host</h1>
            Register here to create events, projects and more to gain real-time feedback from your atendees and team
            members
            <br/>
            <p>{submitError}</p>
            <br/>
            <div>
                <h1>Name</h1>
                <p>{nameError}</p>
                <br/>
                <input value={name} onChange={e=> setName(e.target.value)}/>
                <br/>

                <h1>Email</h1>
                <p>{emailError}</p>
                <br/>
                <input
                    type="email"
                    onChange={e=> setEmail(e.target.value)}/>
                <br/>

                <h1>Password</h1>
                <p>{passwordError}</p>
                <br/>
                <input
                    type={"password"}
                    onChange={e=> setPassword(e.target.value)}/>
                <br/>

                <h1>Register</h1>
                <button onClick={register}>Register
                </button>
                <br/>

                <h1>Already have an account?</h1>
                Login here
                <button>Already have an account? Login here</button>
            </div>
        </div>
    );
}

