import React, { Component } from "react";

const Card = ({image, cardTitle, cardDescription}) => {
    return (
        <div className="card">
            <img src={image}></img>
            <div>
                <h3>{cardTitle}</h3>
                <p>{cardDescription}</p>
            </div>
        </div>
    );
}

export default Card;