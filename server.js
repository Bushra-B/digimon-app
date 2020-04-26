'use strict';

// Load Enviroument Variables
require('dotenv').config();

//Server Dependencies
const express = require('express');
const superagent = require('superagent');
const methodOverride = require('method-override');
const pg = require('pg');

//Main variables
const app = express();
const PORT = process.env.PORT;
const client = new pg.Client(process.env.DATABASE_URL);

//Uses
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public'));
app.set('view engine', 'ejs');

//Handle any route
app.get('/', (request, response) => {
  response.status(200).send('Working');
});

//Route definitions
app.get('/home', homePageHandler);
app.get('/fav', favoriteHandler);
app.get('/favPage', favPageHandler);
app.get('/details/:digimonID', detailsHandler);
// app.get('/detailsPage', detailsPageHandler);




//Route Handlers

//HomePage
function homePageHandler(request, response) {
  let url = 'https://digimon-api.herokuapp.com/api/digimon';
  superagent.get(url)
    .then(digimonResults => {
      let digimonData = digimonResults.body.map(obj => {
        return new Digimon(obj);
      });
      response.render('./pages/index', {data: digimonData});
    });
}

//C.F
function Digimon(obj){
  this.name = obj.name;
  this.img = obj.img;
  this.level = obj.level;
}

//Favorite Page
function favoriteHandler(request, response) {
  let {name, img, level} = request.query;
  let SQL = 'INSERT INTO digimons (name, img, level) VALUES ($1,$2,$3);';
  let safeValues = [name, img, level];
  client.query(SQL, safeValues)
    .then(results => {
    });
  response.redirect('/favPage');
}

function favPageHandler(request, response) {
  let SQL ='SELECT * FROM digimons;';
  client.query(SQL)
    .then(results => {
      response.render('./pages/favorite', {data:results.rows});

    });
}

//Details Page
function detailsHandler(request, response) {
  let id = request.params.digimonID;
  let SQL = 'SELECT * FROM digimons WHERE id=$1;';
  let safeValue = [id];
  client.query(SQL, safeValue)
    .then(results => {
      response.render('./pages/favorite', {data:results.rows[0]});

    });

}

// function detailsPageHandler(request, response) {
// }


// Listen on port
// app.listen(PORT, () => {
//   console.log('Listening on port: ', PORT);
// });
client.connect().then(() =>{
  app.listen(PORT, () => {
    console.log('Listening on port: ', PORT);
  });
});
