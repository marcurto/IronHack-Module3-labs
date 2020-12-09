import React, { Component } from 'react'
import Header from './Header';
import axios from 'axios'

export default class RandomBeer extends Component {
    state = {
        randomBeer: []
    }

    componentDidMount = async () => {
        const randomBeerFromApi = await axios.get("https://ih-beers-api2.herokuapp.com/beers/random", {headers: {"Access-Control-Allow-Origin": "*"}})
        // axios devuelve un objeto con la respuesta dentro de "data"
        this.setState({ randomBeer: randomBeerFromApi.data})
        console.log(this.state.randomBeer, 'random')
    }


    render() {
        return (
            <div>
                <Header />
                <div className="random">
                {this.state.randomBeer.map((random, index) =>{
                        return<div key={index}>
                        <img src={random.image_url} alt="" style={{width: 50}}/>

                        <div>
                            <h2>{random.name}</h2>
                            <h3>{random.tagline}</h3>
                            <p>{random.description}</p>
                            <p>{random.first_brewed} </p>
                            <p>{random.attenuation_level} </p>
                            <h6>{random.contributed_by}</h6>
                        </div>
                        <hr></hr>
                        </div>
                    })}
                </div>
            </div>
        )
    }
}
