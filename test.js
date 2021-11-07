const parse = require("csv-parse/lib/sync");
const fs = require("fs");
let data = fs.readFileSync('./filtered-cities-with-tz.csv', "utf8");
let descriptors = ["city","city_ascii","lat","lng","country","iso2","iso3","admin_name","capital","population","id","timezone"]
async function getCities() {
  return new Promise(async (resolve) => {
    let cities = await parse(data, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true
  });
  resolve(cities)
})
}
async function sortCities(cities) {
  let i;
  let irreg = [];
  for (let city of cities) {
    i = 0;
    for (let descriptor of descriptors) {
      if (city[descriptor] != undefined) {
        i++
      }
    }
    if (i == 13) {
      irreg.push(city);
    }
  }
  return (irreg);
}


async function run() {
  let cities = await getCities();
  let returnValue = await sortCities(cities);
  console.log(returnValue);
}

run();