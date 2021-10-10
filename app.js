"use strict"


var eventQue = [];
var date = new Date()

async function start() {
  let sunriseAndSunset = await getSunriseAndSunset();
  console.log(sunriseAndSunset);
  let scheduledEvents = await getScheduledEvents(sunriseAndSunset);
  console.log(scheduledEvents);
  let var1 = "Calvin";
  console.log(var1);
  let var2 = var1;
  console.log(var2);
  var2 = "Fran";
  console.log(var2);
  console.log(var1);
  // await run(scheduledEvents);
}

async function getSunriseAndSunset(latitude = 41.059858, longitude = -73.574960, day = 'today') {
  return new Promise((resolve, reject) => {
    const axios = require('axios');
  
    axios.get(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${day}`)
      .then((response) => {
        resolve({
          sunrise: response.data.results.sunrise,
          sunset: response.data.results.sunset
        });
      });   
  });
};

async function getScheduledEvents(sunriseAndSunset) {
  return new Promise((resolve, reject) => {
    const config = require('./config.json');
    var scheduledEvents = config['scheduledEvents'];
    for (let event of scheduledEvents) {
      if (event.time == "${SUNRISE}") {
        event.time = sunriseAndSunset.sunrise;
      } else if (event.time == "${SUNSET}") {
        event.time = sunriseAndSunset.sunset;
      }
    }
    resolve(scheduledEvents);
  });
}

async function run() {
  console.info("Starting Setup...");
  await setup();
  console.info("Setup Completed.");
  console.info("Running...")

  for(let event of scheduledEvents) {
    if (event.time == 'sunrise' || event.time == 'sunset') {
      async function getSunriseAndSunset(latitude = 41.059858, longitude = -73.574960, day = 'today') {
        return new Promise((resolve, reject) => {
          const axios = require('axios');
        
          axios.get(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${day}`)
            .then((response) => {
              let timeValue = response.data.results[event.time];
              const moment = require("moment-timezone");
          
              var runTime = moment.utc(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${timeValue.slice(0, 5)}`, "YYYY-MM-DD HH:mm").tz("America/New_York").format("HH:mm");
              eventQue.push({
                time: runTime,
                action: event.action,
                target: event.target
              });
            });
            resolve();
        });
      };
      async function useSunriseAndSunset() {
        await getSunriseAndSunset();
        console.log(eventQue);
        if (event.timeOfTheDay == `* ${date.getMinutes} ${date.getHours} * * *`) {
          console.log(`${event.target}::${event.action}`);
        }
      }
      useSunriseAndSunset();
    } 
  }
}
// setInterval(() => {

//   let date = new Date();
//   console.log(`\n \n \nRight now it is ${date.getHours()}:${date.getMinutes()}`)

start();