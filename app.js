const config = require('./config.json');
var scheduledEvents = config['scheduledEvents'];

for (let event of scheduledEvents) {
  if (event.special == "sunrise") {
    const fs = require('fs');
    fs.readFile('./config.json', 'utf8', (err, data) => {
      if (err) throw err;
      var result = data.replace(event.time, chronSunrise);
      fs.writeFile('./config.json', result, (err) => {
        if (err) return console.log(err);
      });
    });
  };
};

setInterval(() => {
  let currentTime = new Date();
  let chronCurrentTime = `Right now it is ${currentTime.getHours()}:${currentTime.getMinutes()} `
  for (let event of scheduledEvents) {  
    if (event.timeOfTheDay == chronCurrentTime) {
      console.log(`${event.target}::${event.action}`);
    }
  }
}, 60000);


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
  let sunrise = sunriseAndSunset.sunrise;

  let date = new Date();

  const moment = require("moment-timezone");
  
  var chronSunrise = moment.utc(`${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${sunrise.slice(0, 5)}`, "YYYY-MM-DD HH:mm").tz("America/New_York").format("YYYY/MM/DD HH:mm");
  console.log(chronSunrise);
}


promiseResolve();

