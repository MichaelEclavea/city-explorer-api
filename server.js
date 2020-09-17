'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', (err) =>console.error(err));
const superagent = require('superagent');


let locations = [];


app.use(cors());
const PORT = process.env.PORT;

app.get('/', function (request, response) {
    response.send('Hello World');
});


//   location paths

app.get('/location', handleGetLocation);
app.get('/weather', weatherHandler);
app.get('/trails', hikingHandler);

// constructor functions

function Location(city, locationData) {
    console.log(locationData)
    this.search_query = city;
    this.formatted_query = locationData.display_name;
    this.latitude = locationData.lat;
    this.longitude = locationData.lon;
}

function Weather(description, time) {
    this.forecast = description;
    this.time = time;
}

function Trail(object) {
    this.name = object.name;
    this.location = object.location;
    this.length = object.length;
    this.stars = object.stars;
    this.star_votes = object.starVotes;
    this.summary = object.summary;
    this.trail_url = object.url;
    this.conditions = object.conditionDetails;
    this.condition_date = object.conditionDate.slice(0, 10);
    this.condition_time = object.conditionDate.slice(11, 19);
}

// function

function handleGetLocation(req, res) {
    if (locations[req.query.city]) {
      console.log('getting city from memory', req.query.city)
      res.status(200).json(locations[req.query.city]);
    }
    else {
      console.log('getting city from API', req.query.city)
      let url = `https://us1.locationiq.com/v1/search.php`;
      let queryObject = {
        key: process.env.GEOCODE_API_KEY,
        city: req.query.city,
        format: 'json',
        limit: 1
      };
      superagent.get(url).query(queryObject)
        // if
        .then(dishes => {
          let data = dishes.body[0];
          console.log(data);
          let location = new Location(req.query.city, data);
          // Store in the DB, please, not memory
          // INSERT
        //   locations[req.query.city] = location;
          res.status(200).json(location);
        })
        // else
        .catch(err => {
          throw new Error(err.message);
        })
    }
  }


function weatherHandler(request, response) {
    try {
        const lat = request.query.latitude;
        const lon = request.query.longitude;
        let key = process.env.WEATHER_API_KEY;
        const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lon}&key=${key}`;
        console.log(url);
        superagent.get(url)
            .then(results => {
                let weatherData = results.body.data;
                let weatherDataSlice = weatherData.slice(0, 8);
                response.send(weatherDataSlice.map(value => new Weather(value.weather.description, value.datetime)));
            })
    } catch (error) {
        console.log('ERROR', error);
        response.status(500).send('So sorry, something went wrong.');
    }
}

function hikingHandler(request, response) {
    try {
        const lat = request.query.latitude;
        const lon = request.query.longitude;
        let key = process.env.HIKING_API_KEY;
        const url = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=${key}`;
        superagent.get(url)
            .then(results => {
                let trailData = results.body.trails;
                response.send(trailData.map(value => new Trail(value)));
            })
    } catch (error) {
        console.log('ERROR', error);
        response.status(500).send('So sorry, something went wrong.');
    }
}

function notFound(request, response) {
    response.status(404).send('Sorry, Not Found');
}


client.connect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`listening on port ${PORT}`);
        });

    })
    .catch(e => console.log(e))