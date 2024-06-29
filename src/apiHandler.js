export { apiHandler };

class APIHandler {
  constructor() {}
  async fetchWeather(cityName) {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=c05f091847fa461ea2c184734242706&q=${cityName}`
    );
    const json = await response.json();
    return json;
  }
}

const apiHandler = new APIHandler();
