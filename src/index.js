import { apiHandler } from "./apiHandler.js";
import { domHandler } from "./domHandler.js";

class App {
  constructor() {}
  async updateWeather(cityName) {
    const json = await apiHandler.fetchWeather(cityName);
    console.log(json);
  }
}

const app = new App();
export { app };
