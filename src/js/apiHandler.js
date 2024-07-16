export { apiHandler };

class APIHandler {
  constructor() {}
  async fetchLocation(cityName) {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json`
    );
    if (!response.ok) throw new Error(response.statusText);
    const json = await response.json();
    return json;
  }
  async fetchWeather(latitude, longitude) {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m,dew_point_2m,visibility&hourly=temperature_2m,precipitation_probability,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_probability_mean&forecast_days=14`
    );
    if (!response.ok) throw new Error(response.statusText);
    const json = await response.json();
    return json;
  }
}

const apiHandler = new APIHandler();
