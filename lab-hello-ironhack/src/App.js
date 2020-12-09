import React, { Component } from "react";
import Header from "./Header";
import Card from "./Card";
import "./App.css";
import "./Header.css";
import "./Card.css";

class App extends Component {
    render() {
  
      return (
        <div>
          <Header/>
          <div className ="card-container">
            <Card image="/images/icon1.png" cardTitle = "Declarative" cardDescription= "React makes it painless to create interactive UIs."/>
            <Card image="/images/icon2.png" cardTitle = "Components" cardDescription= "Buil encapsulated components that manage their state."/>
            <Card image="/images/icon3.png" cardTitle = "Single-Way" cardDescription= "A set of immutable values are passed to the component's."/>
            <Card image="/images/icon4.png" cardTitle = "JSX" cardDescription="Statically-typed, designed to run on modern brownsers."/>

          </div>
        </div>
      );
    }
  }

export default App;