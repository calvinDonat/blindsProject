"use strict"

async function start() {
  let sunriseAndSunset = await getSunriseAndSunset();
  console.log(sunriseAndSunset);
  let scheduledEvents = await getScheduledEvents(sunriseAndSunset);
  console.log(scheduledEvents);;
  run(scheduledEvents);
}

async function getSunriseAndSunset(latitude = 41.059858, longitude = -73.574960, day = 'today') {
  return new Promise((resolve, reject) => {
    const axios = require('axios');
  
    axios.get(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${day}`)
      .then((response) => {
        console.log(response.data.results.sunrise.slice(0,11).toLowerCase());
        resolve({
          sunrise: timeToLocal(response.data.results.sunrise.slice(0,11).toLowerCase()),
          sunset: timeToLocal(response.data.results.sunset.slice(0,11).toLowerCase())
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

function addZero(date = new Date()) {
  let dateString = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2);
  return dateString;
};

function timeToLocal(time) {
  const moment = require('moment-timezone');
  let returnValue = moment.utc(time, "HH:mm:ss a").tz("America/New_York").format("HH:mm:ss");
  return returnValue;
}

async function run(scheduledEvents) {
  setInterval(() => {
    let currentTime = addZero();
    for(let event of scheduledEvents) {
      if (currentTime == event.time) {
        console.log(`MOVING THE ${event.target} ${event.action}`);
      }
    }
    console.log(currentTime);
  }, 1000)
};

start();