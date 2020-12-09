import React from 'react';
import './App.css';
import './component/IdCard'
import IdCard from './component/IdCard';

function App() {
  return (
    <div className="App">
        <div className="cards-section">
        <h1>Id Card</h1>
        <IdCard 
        lastName = 'Doe'
        firstName = 'Jhon'
        gender = 'male'
        height = {178}
        // birth = {new Date("1992-07-14")}
        picture = "https://randomuser.me/api/portraits/men/44.jpg"/>
        
        <IdCard 
        lastName = 'Delores'
        firstName = 'Obrien'
        gender = 'female'
        height = {172}
        // birth = {new Date("1992-07-14")}
        picture = "https://randomuser.me/api/portraits/women/44.jpg"/>
      </div>
    </div>
  );
}

export default App;
