import React, { Component } from 'react';
import axios from 'axios';
class Register extends Component {
  constructor(props){
    super(props);
    this.state={
      name:'',
      email:'',
      password:'',
      userType:'host'
    }
  }
  render() {
    return (
      <div>
          <div>
            <h1>Welcome! Host</h1>
            Register here to create events, projects and more to gain real-time feedback from your atendees and team members
            <h1>Name</h1>
           <input
             label="Enter your First Name"
             onChange = {(event,newValue) => this.setState({name:newValue})}
             />
           <br/>
           <h1>Email</h1>
           <input
             label="Enter your Email"
             type="email"
             onChange = {(event,newValue) => this.setState({email:newValue})}
             />
           <br/>
           <h1>Password</h1>
           <input
             type = "password"
             label="Enter your Password"
             onChange = {(event,newValue) => this.setState({password:newValue})}
             />
           <br/>
           <h1>Register</h1>
           <button label="Register" primary={true} style={style} onClick={(event) => this.handleClick(event)}/>
           <br/>
           <h1>Already have an account?</h1>
           Login here
           <button onclick="window.location.href='/Login'">Already have an account? Login here</button>
          </div>
      </div>
    );
  }
}
const style = {
  margin: 15,
};
export default Register;