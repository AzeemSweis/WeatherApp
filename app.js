const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const config = require("./config")

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req,res) => {
  res.sendFile(__dirname + "/index.html");
})

app.post("/", (req, res) => {
  const query = req.body.cityName;
  const apiKey = config.apiKey;
  const unit = "imperial";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid="+ apiKey + "&units="+ unit;

  https.get(url, function(response) {
    console.log(response.statusCode);

    response.on("data", function(data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const icon = "http://openweathermap.org/img/wn/" + weatherData.weather[0].icon +"@2x.png"
      res.write("<h1>In " + query + " the temperature is " + temp + " degrees F </h1>")
      res.write("<h3>The weather is currently " + description + "</h3>")
      res.write("<img src=" + icon + ">");
      res.send();
    })
  });
})

app.listen(port, function() {
  console.log(`Server is running on http://localhost:${port}`);
})
