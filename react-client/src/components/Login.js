import React, { Component } from 'react';
import axios from 'axios';
class Login extends Component {
constructor(props){
  super(props);
  this.state={
  email:'',
  password:'',
  userType:'host',
  emailError:'',
  passwordError:'',
  submitError:'',
  faliure: false
  }

  this.handleChangeEmail = this.handleChangeEmail.bind(this);
  this.handleChangePassword = this.handleChangePassword.bind(this);
 }

 async handleClick(event){  // might have to run another instance of react
    var self = this;
    var payload={
      'email':this.state.email,
      'password':this.state.password,
      'userType':"host"
    }
    console.log(payload);
    if (this.state.email.length == 0) {
      console.log("Email cannot be left blank");
      this.setState({emailError: "Email cannot be left blank"});
      this.setState({faliure: true});
    }

    if (this.state.password.length == 0) {
      console.log("Email cannot be left blank");
      this.setState({passwordError: "Password cannot be left blank"});
      this.setState({faliure: true});
    }

    if (this.state.faliure == true) {
      return;
    }

     // Update context (speak Kirson, userID and authentication token passed in response body)
        // History.push 

            // for 500 could say services not available, google what is usually said here on other services

    try {
      const result = await axios.post('http://localhost/user/login', {
        'email':this.state.email,
        'password':this.state.password,
        'userType':"host"
      });
      console.log(result);
      const user = {
          access:result.data.Data.access_token,
          refresh:result.data.Data.refresh_token,
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
            <button label="Submit" primary={true} style={style} onClick={(event) => this.handleClick(event)}> Login</button>
         </div>
      </div>
    );
  }
}
const style = {
 margin: 15,
};
export default Login;