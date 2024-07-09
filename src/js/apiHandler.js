export { apiHandler };

class APIHandler {
  constructor() {}
  async fetchLocation(cityName) {
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json`
      );
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async fetchWeather(latitude, longitude) {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m,dew_point_2m,visibility&hourly=temperature_2m,precipitation_probability,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_mean&temperature_unit=fahrenheit&forecast_days=14`
      );
      const json = await response.json();
      return json;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

const apiHandler = new APIHandler();
