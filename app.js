require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const https = require("https");

// creating application with express and EJS

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + "/public"));

// get requests

app.get('/', function(req, res) {
  res.render("landing");
});

app.get('/home', function(req, res) {
  res.render("home");
});

// post requests

app.post('/', function(req, res) {
  res.render("home");
});


app.post("/home", function(req, res) {

  const query = req.body.cityName;
  const units = "imperial";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + units + "&appid=" + process.env.API_KEY;

  https.get(url, function(response) {

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const desc = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

      function toTitleCase(str) {
        return str.replace(
          /\w\S*/g,
          function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          }
        );
      }

      const city = toTitleCase(query);

      res.render("return", {
        city: city,
        temp: temp,
        desc:desc,
        imgUrl:imgUrl
      });
    });
  });
});

app.post("/return", function(req, res) {
  res.redirect("/home");
});


app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
