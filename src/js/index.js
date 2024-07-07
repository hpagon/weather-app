import { apiHandler } from "./apiHandler.js";
import { domHandler } from "./domHandler.js";
import { parser } from "./parser.js";
import { domEditor } from "./domEditor.js";
import "../style.css";

class App {
  #currentSearchResults;
  constructor() {
    domEditor.loadContent();
  }
  async updateWeather(cityName, locationIndex) {
    let data;
    let locationJson;
    //if no selected location, use the first search result
    if (locationIndex === undefined) {
      locationJson = await apiHandler.fetchLocation(cityName);
      locationJson = locationJson.results[0];
    } else {
      //otherwise use selected location
      locationJson = this.#currentSearchResults[locationIndex];
    }
    console.log(locationJson);
    let weatherJson = await apiHandler.fetchWeather(
      locationJson.latitude,
      locationJson.longitude
    );
    console.log(weatherJson);
    data = parser.parseWeatherData(locationJson, weatherJson);
    console.log(data);
    domEditor.updateWeather(data);
  }
  async searchLocations(cityName) {
    let locationJson = await apiHandler.fetchLocation(cityName);
    console.log(locationJson);
    domEditor.updateSearchResults(locationJson.results);
    this.#currentSearchResults = locationJson.results;
  }
}

const app = new App();
export { app };
