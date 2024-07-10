import { apiHandler } from "./apiHandler.js";
// import { domHandler } from "./domHandler.js";
import { parser } from "./parser.js";
import { domEditor } from "./domEditor.js";
import "../style.css";

class App {
  #currentSearchResults;
  constructor() {
    domEditor.loadContent();
  }
  async updateWeather(cityName, locationIndex) {
    try {
      domEditor.insertLoadingComponent();
      let data;
      let locationJson;
      //if no selected location, use the first search result
      if (locationIndex === undefined) {
        locationJson = await apiHandler.fetchLocation(cityName);
        if (locationJson.results === undefined) {
          domEditor.removeLoadingComponent();
          domEditor.updateSearchResults(undefined);
          return;
        }
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
      domEditor.removeLoadingComponent();
    } catch (e) {
      this.handleError(e);
      domEditor.removeLoadingComponent();
    }
  }
  async searchLocations(cityName) {
    try {
      domEditor.insertLoadingComponent();
      let locationJson = await apiHandler.fetchLocation(cityName);
      console.log(locationJson);
      domEditor.updateSearchResults(locationJson.results);
      this.#currentSearchResults = locationJson.results;
      domEditor.removeLoadingComponent();
    } catch (e) {
      domEditor.removeLoadingComponent();
      this.handleError(e);
    }
  }
  handleError(error) {
    //notify client of network error
    if (error.message === "Failed to fetch") {
      domEditor.displayError("Network error. Please check your connection.");
    } else {
      domEditor.displayError("Error occured.");
    }
  }
}

const app = new App();
export { app };
