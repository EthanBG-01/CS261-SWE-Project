import React, { Component } from 'react';
import axios from 'axios';

class Register extends Component {

  constructor(props){
    super(props);
    this.state={
      name:'',
      email:'',
      password:'',
      userType:'host',
      nameError:'',
      emailError:'',
      passwordError:'',
      submitError:''
    }

    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
  }

  async register(event){  // might have to run another instance of react
      let self = this;
      let returnFlag = false;

      let payload = {
          'name': this.state.name,
          'email': this.state.email,
          'password': this.state.password,
          'userType': "host"
      };

     if (this.state.name.length === 0) {
      this.setState({nameError: "Name cannot be left blank"});
      returnFlag = true;
    } else{
         this.setState({nameError: ""});
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

     if (returnFlag) return

     try {
       const result = await axios.post('http://localhost/user/register', {
         'name':this.state.name,
         'email':this.state.email,
         'password':this.state.password,
         'userType':"host"
       });

       console.log(result);

       const user = {
           access:result.data.access_token,
           refresh:result.data.refresh_token,
       };

         // Update the user context
         // Use History to update to the main dashboard.

     } catch (e) {
         this.setState({submitError: e.response.data.response}); // weird behaviour where it says data empty but its not
     }};

     handleChangeName(event) {
      this.setState({name: event.target.value});
    }

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
      Register here to create events, projects and more to gain real-time feedback from your atendees and team members
      <br/><p1>{this.state.submitError}</p1><br/>
      <div>
          <h1>Name</h1>
          <p1>{this.state.nameError}</p1><br/>
          <input
            label="Enter your First Name"
            value={this.state.name}
            onChange={this.handleChangeName}/>
           <br/>

           <h1>Email</h1>
           <p1>{this.state.emailError}</p1><br/>
           <input
             label="Enter your Email"
             type="email"
             value={this.state.email}
             onChange={this.handleChangeEmail}/>
           <br/>

           <h1>Password</h1>
           <p1>{this.state.passwordError}</p1><br/>
           <input
            label="Enter your Password"
            value={this.state.password}
            type={"password"}
            onChange={this.handleChangePassword}/>
           <br/>

           <h1>Register</h1>
           <button label="Register" primary={true} style={style} onClick={(event) => this.register(event)}>Register</button>
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
