import React, { Component } from 'react';
import axios from 'axios';
class Login extends Component {
constructor(props){
  super(props);
  this.state={
  username:'',
  password:''
  }
 }

 handleClick(event){
   // check if fields are empty, red error message
    var apiBaseUrl = "http://localhost";
    var self = this;
    var payload={
      "email":this.state.email,
      "password":this.state.password
    }
    axios.post(apiBaseUrl+'login', payload).then(function (response) {
      console.log(response);
      if (response.data.code == 200){
        console.log("Login successfull"); // Update context (speak Kirson, userID and authentication token passed in response body)
        // History.push 
      }
      else if (response.data.code == 400){
        console.log("Invalid login details");
        alert("Invalid login details") // Red text above user input
      }
      else {
        console.log("Email does not exist");
        alert("Email does not exist");
      }
    })
      .catch(function (error) {
      console.log(error);
      });
    }
    
render() {
    return (
      <div>
        <h1>Welcome! Host</h1>
        Register here to create events, projects and more to gain real-time feedback from your attendees and team members
          <div>
            <h1>Email</h1>
           <input
             label="Enter your Email"
             onChange = {(event,newValue) => this.setState({email:newValue})}
             />
           <br/>
              <h1>Password</h1>
             <input
               type="password"
               label="Enter your Password"
               onChange = {(event,newValue) => this.setState({password:newValue})}
               />
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