import React, { Component } from "react";
import { Link } from "react-router-dom";

import { withAuth } from "../lib/AuthProvider";		

class Signup extends Component {
  state = { email: "", password: "" };

  handleFormSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    console.log('Signup -> form submit', { email, password });
    this.props.signup({ email, password }); //Té les proprs d'ell i del provider, i de totes, aquí usa el mètodo signup que ve com a prop del provider
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  render() {
    const { email, password } = this.state;
    return (
      <div>
        <h1>Sign Up</h1>

        <form onSubmit={this.handleFormSubmit}>
          <label>Email:</label>
          <input
            type='text'
            name='email'
            value={email}
            onChange={this.handleChange}
          />

          <label>Password:</label>
          <input
            type='password'
            name='password'
            value={password}
            onChange={this.handleChange}
          />

          <input type='submit' value='Signup' />
        </form>

        <p>Already have account?</p>
        <Link to={"/login"}> Login</Link>
      </div>
    );
  }
}

export default withAuth(Signup);
