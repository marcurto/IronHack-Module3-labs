import React, { Component } from "react";




class Header extends Component {
    render() {
  
      return (
        <div className="header">
          <nav className= "nav-bar">
            <img src="./images/ironhack-logo.svg" alt="Ironhack logo" />
            <img src="./images/menu-top.svg" alt="Menu icon" />
          </nav>
          <header className ="header-content">
            <h1>Say hello to<br></br> ReactJS</h1>
            <p>You will learn how to use<br></br> the most popular frontend library,<br></br>and become a super Ninja developer.</p>
             <button>Awesome!</button>
          </header>
        </div>
      );
    }
  }

  export default Header;