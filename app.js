"use strict"

async function start() {
  try { 
    let location = await getLocation();
    console.log(`location is: ${location}`);
    let cities = await getCities();
    let locationDetails;
    getLocationDetails(cities, location).then((cityDetails) => {
      locationDetails = cityDetails
    }).catch((err) => {
      console.log(err);
      locationDetails = {
        timezone: "America/New_York",
        lat: "40.6943",
        lng: "-73.9249"
      }
    });
    console.log(locationDetails);
    let sunriseAndSunset = await getSunriseAndSunset(details.timezone, details.lat, details.lng);
    console.log(sunriseAndSunset);
    let scheduledEvents = await getScheduledEvents(sunriseAndSunset);
    console.log(scheduledEvents);;
    run(scheduledEvents);
  } catch(err) {
    console.log("catching the error", err);
  }
}

async function getLocation() {
  return new Promise((resolve) => {
    const fs = require("fs");
    let data = fs.readFileSync('./config.json', "utf8");
    resolve(JSON.parse(data).location);
  }).catch((err) => {
    console.log(err);
    console.log(456);
    return "INVALID CITY";
  }) 
}

async function getCities() {
  return new Promise(async (resolve) => {
    const parse = require("csv-parse/lib/sync");
    const fs = require("fs");
    let data = fs.readFileSync('./filtered-cities-with-tz.csv', "utf8");
    const cities = await parse(data, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true
    });
    resolve(cities);
  }).catch((err) => {
    console.log(err);
    console.log(123);
  })
}

async function getLocationDetails(cities, location) {
  return new Promise((resolve, reject) => {
      let details = null;
      for (let city of cities) {
        if (city.city_ascii.toLowerCase() == location.toLowerCase()) {
          console.log(city);
          details = {
            timezone: city.timezone,
            lat: city.lat,
            lng: city.lng
          }
          break;
        }
      }
      if (details == null) {
        reject(`Could not find location: ${location}; Valid locations must be cities with populations over 100,000.`);
      }
      resolve(details);
  });
};

async function getSunriseAndSunset(timezone, latitude = 41.059858, longitude = -73.574960, day = 'today') {
  return new Promise(async (resolve, reject) => {
    try { 
      const https = require("https");
      const axios = require("axios");
      const agent = new https.Agent({  
        rejectUnauthorized: false
      });
      let response = await axios.get(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${day}`, {Agent: agent});
      resolve({
        sunrise: currTime(response.data.results.sunrise.slice(0,11).toLowerCase(), timezone),
        sunset: currTime(response.data.results.sunset.slice(0,11).toLowerCase(), timezone)
      });
    } catch(err) {
      console.log(err);
    }  
  }).catch((err) => { 
    console.log(err);
  })
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

function currTime(time, timezone) {
  const moment_timezone = require('moment-timezone');
  if (time == undefined){
    return moment_timezone().format("HH:mm:ss");
  } else {
    const moment_timezone = require('moment-timezone');
    let returnValue = moment_timezone.utc(time, "HH:mm:ss a").tz("America/New_York").format("HH:mm:ss");
    return returnValue;
  }
}

async function run(scheduledEvents) {
  setInterval(() => {
    let currentTime = currTime();
    for(let event of scheduledEvents) {
      if (currentTime == event.time) {
        console.log(`MOVING THE ${event.target} ${event.action}`);
      }
    }
    console.log(currentTime);
  }, 1000)
};

start();