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

app.get('/location', handlerLocation);

function Location(place, city){
    this.search_query = place;
    this.formatted_query = city.display_name; 
    this.lattitude = city.lat; 
    this.longitude = city.lon;
}



function handlerLocation(request, response) {
   
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


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

