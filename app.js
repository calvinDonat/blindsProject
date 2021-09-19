"use strict"

console.log("working...")

async function setup() {

}

async function run() {

}

setInterval(() => {
  const config = require('./config.json');
  var scheduledEvents = config['scheduledEvents'];

  let date = new Date();
  console.log(`\n \n \nRight now it is ${date.getHours()}:${date.getMinutes()}`)

  for (let event of scheduledEvents) { 
    if (event.special) {
      function getSunriseAndSunset(latitude = 41.059858, longitude = -73.574960, day = 'today') {
        const axios = require('axios');
      
        axios.get(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${day}`)
          .then((response) => {
            let timeValue = response.data.results[event.special];
            console.log(`setting blinds to move at ${event.special}...`);
            const moment = require("moment-timezone");
        
            var chronTimeValue = moment.utc(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${timeValue.slice(0, 5)}`, "YYYY-MM-DD HH:mm").tz("America/New_York").format("* mm HH * * *");

            const fs = require("fs");

            fs.readFile('./config.json', 'utf8', (err, data) => {
              if (err) throw err;
              var result = data.replace(event.time, chronTimeValue);
              result = result.replace(event.special, '');
              fs.writeFile('./config.json', result, (err) => {
                if (err) return console.log(err);
              });
            });
          });
        };
      
        getSunriseAndSunset()

      } 
    if (event.timeOfTheDay == `* ${date.getMinutes} ${date.getHours} * * *`) {
      console.log(`${event.target}::${event.action}`);
    }
}
}, 60000);
