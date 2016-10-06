var faker = require('faker');

var fakeData = [];

var latitude = faker.address.latitude();
var longitude = faker.address.longitude();
var city = faker.address.city();
var country = faker.address.country();
var countryCode = faker.address.countryCode();

function generateFakeData () {
  fakeData.push(
    {
      text: [],
      coordinates:
        {
          lat: latitude,
          long: longitude
        },
      date: new Date().toLocaleString(),
      type: "Point",
      place: city,
      country_code: countryCode,
      country: country
    }
  );
  setTimeout(generateFakeData, 1000);
}

module.exports = generateFakeData();

