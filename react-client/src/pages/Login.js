import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'

import { UserContext } from '../contexts/UserContext'
import {useHistory} from "react-router-dom";

import "../styles/Login-Reg.css";

export default function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
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

            const userObject = {
                access: result.data.access_token,
                refresh: result.data.refresh_token,
                login: true,
                name: result.data.response,
            };

            console.log("Success");
            setUser(userObject);

            history.push("/");

        } catch (e) {
            console.log(e.response.data.response);
            setSubmitError(e.response.data.response);
        }
    };

    return (
        <div className={"Login"}>
            <div className={"bg-image"}></div>
            <div className={"bg-image2"}></div>

            <div className={"DetailsForm"}>
                <h3>Welcome To</h3>
                <div className={"TitleContainer"}>
                    <div className={"Title"}><h1>RT-Feedback</h1><p>Host</p></div>
                    Register here to create events, projects and more to gain real-time feedback from your attendees and team members
                </div>

                <br/><p className={"inputError"}>{submitError}</p><br/>

                <div className={"inputField"}>
                    <h3>Email</h3>
                    <p className={"inputError"}>{emailError}</p>
                    <input value={email} onChange={e=> setEmail(e.target.value)} />
                </div>

                <div className={"inputField"}>
                    <h3>Password</h3>
                    <p className={"inputError"}>{passwordError}</p>
                    <input
                        type="password"
                        value={password}
                        onChange={e=> setPassword(e.target.value)}/>
                </div>

                <button onClick={login}>LOGIN</button>

                <div className={"redirect"}>
                    <p>Don't have an Account?</p><Link to='/register'>Register Here</Link>
                </div>

            </div>
        </div>
    );
}







 

