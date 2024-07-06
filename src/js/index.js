import { apiHandler } from "./apiHandler.js";
import { domHandler } from "./domHandler.js";
import { parser } from "./parser.js";
import { domEditor } from "./domEditor.js";
import "../style.css";

class App {
  constructor() {
    domEditor.loadContent();
  }
  async updateWeather(cityName) {
    let locationJson = await apiHandler.fetchLocation(cityName);
    locationJson = locationJson.results[0];
    console.log(locationJson);
    let weatherJson = await apiHandler.fetchWeather(
      locationJson.latitude,
      locationJson.longitude
    );
    console.log(weatherJson);
    const data = parser.parseWeatherData(locationJson, weatherJson);
    console.log(data);
    domEditor.updateWeather(data);
  }
  async searchLocations(cityName) {
    let locationJson = await apiHandler.fetchLocation(cityName);
    console.log(locationJson);
    domEditor.updateSearchResults(locationJson.results);
  }
}

const app = new App();
export { app };
