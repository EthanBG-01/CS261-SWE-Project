import React, { Component, useState, useContext } from 'react';
import axios from 'axios';

import { UserContext } from '../contexts/UserContext'



class Login extends Component {
constructor(props){
  super(props);
  this.state={
  email:'',
  password:'',
  userType:'host',
  emailError:'',
  passwordError:'',
  submitError:''
  }

  this.handleChangeEmail = this.handleChangeEmail.bind(this);
  this.handleChangePassword = this.handleChangePassword.bind(this);
 }
 
 async login(event){  // might have to run another instance of react

    let self = this;
    let returnFlag = false;

    // Something's wrong with the states - they're undefined, causing 500 Errors

    let payload={
      'email':this.state.email,
      'password':this.state.password,
      'userType':"host"
    }

    if (this.state.email.length === 0) {
      this.setState({emailError: "Email cannot be left blank"});
      returnFlag = true;
    } else{
        this.setState({emailError: ""});
    }

    if (this.state.password.length === 0) {
      this.setState({passwordError: "Password cannot be left blank"});
      returnFlag = true;
    } else{
        this.setState({passwordError: ""});
    }


     if (returnFlag) return;

    try {
      const result = await axios.post('http://localhost/user/login', {
        'email':this.state.email,
        'password':this.state.password,
        'userType':"host"
      });

      // setUser({
      //   access: result.data.access_token,
      //   refresh:result.data.refresh_token,
      // });

      const user = {
          access:result.data.access_token,
          refresh:result.data.refresh_token,
      };

    } catch (e) {
        console.log(e.response.data.response);
        this.setState({submitError: e.response.data.response});
    }};

    handleChangeEmail(event) {
      this.setState({email: event.target.value});
    }

    handleChangePassword(event) {
      this.setState({password: event.target.value});
    }
    
render() {
  // const {setUser} = useContext(UserContext)
    return (
      <div>
        <h1>Welcome! Host</h1>
        Register here to create events, projects and more to gain real-time feedback from your attendees and team members
        <br/><p1>{this.state.submitError}</p1><br/>
        <div>
            <h1>Email</h1>
            <p1>{this.state.emailError}</p1><br/>
            <input 
              label="Enter your Email"
              value={this.state.email}
              onChange={this.handleChangeEmail} />
            <br/>

            <h1>Password</h1>
            <p1>{this.state.passwordError}</p1><br/>
            <input
              type="password"
              value={this.state.password}
              onChange={this.handleChangePassword}/>
            <br/>

            <h1>Login</h1>
            <button label="Submit" primary={true} style={style} onClick={(event) => this.login(event)}> Login</button>
         </div>
      </div>
    );
  }
}
const style = {
 margin: 15,
};
export default Login;