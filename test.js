async function getCities() {
  return new Promise((resolve, reject) => {
    const parse = require("csv-parse/lib/sync");
    const fs = require("fs");
    let data = fs.readFileSync('./filtered-cities-with-tz.csv', "utf8");
    const cities = await parse(data, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true
    });
    resolve(cities);
  });
}

async function run() {
  let cities = await getCities();
  for (let object of cities) {
    if (object.city == "Stamford") {
      console.log(object);
      return;
    }
  }
}

run();
 