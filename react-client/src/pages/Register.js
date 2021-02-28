import React, { useState, useContext } from 'react';
import {Link, useHistory} from "react-router-dom";
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
                login: true,
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

            <div className={"bg-image"}></div>
            <div className={"bg-image2"}></div>

            <div className={"DetailsForm"}>
                <h3>Welcome To</h3>
                <div className={"TitleContainer"}>
                    <div className={"Title"}><h1>RT-Feedback</h1><p1>Host</p1></div>
                    Register here to create events, projects and more to gain real-time feedback from your attendees and team members
                </div>

                <br/><p  className={"inputError"}>{submitError}</p><br/>

                <div className={"inputField"}>
                    <h3>Name</h3>
                    <p  className={"inputError"}>{nameError}</p>
                    <input value={name} onChange={e=> setName(e.target.value)}/>
                </div>

                <div className={"inputField"}>
                    <h3>Email</h3>
                    <p  className={"inputError"}>{emailError}</p>
                    <input
                        type="email"
                        onChange={e=> setEmail(e.target.value)}/>
                </div>

                <div className={"inputField"}>
                    <h3>Password</h3>
                    <p  className={"inputError"}>{passwordError}</p>
                    <input
                        type={"password"}
                        onChange={e=> setPassword(e.target.value)}/>
                </div>

                <button onClick={register}>REGISTER</button>

                <div className={"redirect"}>
                    <p>Already have an Account?</p><Link to='/login'>Login Here</Link>
                </div>
            </div>
        </div>
    );
}

