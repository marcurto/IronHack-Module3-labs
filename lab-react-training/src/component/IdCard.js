import React, { Component } from 'react';
import './IdCard.css';

class IdCard extends Component {
    render() {
        return (
            <div className="idCard">
                <div className="cardImg">
                    <img src={this.props.picture} alt={this.props.name} />
                </div>
                <div className = "cardInfo">
                    <div className = "cardItem">
                        <h5>First name:</h5>
                        <h6>{this.props.firstName}</h6>
                    </div>
                    <div className = "cardItem">
                        <h5>Last name:</h5>
                        <h6>{this.props.lastName}</h6>
                    </div>
                    <div className = "cardItem">
                        <h5>Gender:</h5>
                        <h6>{this.props.gender}</h6>
                    </div>
                    <div className = "cardItem">
                        <h5>Height:</h5>
                        <h6>{this.props.height}m</h6>
                    </div>
                    <div className = "cardItem">
                        <h5>Birth:</h5>
                        <h6>{this.props.birth}</h6>
                    </div>
               </div>
            </div>
        )
    }
}

export default IdCard;

