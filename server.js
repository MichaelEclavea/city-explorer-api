'use strict';

const express = require('express');
const app = express();
const cors = require('cors');
const { response } = require('express');
app.use(cors());
require('dotenv').config();
const PORT = process.env.PORT;

app.get('/', function (request, response) {
    response.send('Hello World');
  });


//   location paths

app.get('/location', handlerLocation);
app.get('/weather', handlerWeather);


// constructor functions

function Location(place, city){
    this.search_query = place;
    this.formatted_query = city.display_name; 
    this.latitude = city.lat; 
    this.longitude = city.lon;
}

function Weather(forecast, time){
    this.forecast = forecast;
    this.time = time;
}


// function

function handlerLocation(request, response) {
    console.log('in handler function');
    try {
        const place = request.query.city;
        let city = require('./data/location.json');
        console.log(city);
        let locationData = new Location(place, city[0]); 
        response.status(200).json(locationData);
    } catch(error) {
        response.status(500).send('Broken request');
    }
}

function handlerWeather(request, response){
    try{
        const weatherData = [];
        const getWeatherData = require('./data/weather.json');
        getWeatherData.data.forEach(day =>{
            const forecast = day.weather.description;
            const time = day.datetime;
            const weather = new Weather(forecast, time);
            weatherData.push(weather);
        });
        response.status(200).json(weatherData);
    } catch(error){
        response.status(500).send('Broken request!');
    }
}


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

