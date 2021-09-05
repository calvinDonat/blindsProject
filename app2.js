"use strict"

const config = require('./config.json');
var scheduledEvents = config['scheduledEvents'];

setInterval(() => {
  let date = new Date();
  console.log(`Right now it is ${date.getHours()}:${date.getMinutes()}`)

  for (let event of scheduledEvents) { 
  
    if (event.special) {
      async function getSunriseAndSunset(latitude = 41.059858, longitude = -73.574960, date = 'today') {
        return new Promise((resolve, reject) => {
          const https = require('https');
      
          https.get(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${date}`, (resp) => {
          var data = '';
      
          resp.on('data', (chunk) => {
            data += chunk;
          });
      
          resp.on('end', () => {
            resolve({
              sunrise: JSON.parse(data).results.sunrise,
              sunset: JSON.parse(data).results.sunset
            });
          });
      
          }).on("error", (err) => {
            console.log(err);
            reject("Because");
          });
        });
      }
      
      async function promiseResolve() {
        let sunriseAndSunset = await getSunriseAndSunset();
        let timeValue = sunriseAndSunset[event.special];
        console.log(event.special);
        const moment = require("moment-timezone");
        
        var chronTimeValue = moment.utc(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${timeValue.slice(0, 5)}`, "YYYY-MM-DD HH:mm").tz("America/New_York").format("* mm HH * * *");

        const fs = require("fs");

        fs.readFile('./config.json', 'utf8', (err, data) => {
          if (err) throw err;
          var result = data.replace(event.time, chronTimeValue);
          fs.writeFile('./config.json', result, (err) => {
            if (err) return console.log(err);
          });
        });
      }
      promiseResolve();  
    }
    if (event.timeOfTheDay == `* ${date.getMinutes} ${date.getHours} * * *`) {
      console.log(`${event.target}::${event.action}`);
    }
  }
}, 60000);
