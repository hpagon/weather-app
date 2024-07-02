import { DateTime } from "luxon";

class Parser {
  constructor() {}
  parseWeatherData(locationJson, weatherJson) {
    //convert utc to local time
    let currentTime = this.convertToLocalTime(
      new Date().toISOString(),
      locationJson.timezone
    );
    let givenHour = this.convertToLocalTime(
      weatherJson.current.time,
      "UTC"
    ).hour;
    let sunrise = this.convertToLocalTime(
      weatherJson.daily.sunrise[0],
      locationJson.timezone
    ).toLocaleString(DateTime.TIME_SIMPLE);
    let sunset = this.convertToLocalTime(
      weatherJson.daily.sunset[0],
      locationJson.timezone
    ).toLocaleString(DateTime.TIME_SIMPLE);
    return {
      localTime: currentTime,
      localHour: currentTime.hour,
      time: weatherJson.current.time,
      indexHour: givenHour,
      main: {
        city: locationJson.name,
        state: locationJson.admin1,
        country: locationJson.country,
        temperature: weatherJson.current.temperature_2m,
        feelsLike: weatherJson.current.apparent_temperature,
        weatherCode: this.weatherCodeDecrypt(weatherJson.current.weather_code),
      },
      hourly: {
        temperatures: weatherJson.hourly.temperature_2m,
        rainChances: weatherJson.hourly.precipitation_probability,
        isDay: weatherJson.hourly.is_day,
        weatherCodes: weatherJson.hourly.weather_code,
      },
      daily: {
        maxTemperatures: weatherJson.daily.temperature_2m_max,
        minTemperatures: weatherJson.daily.temperature_2m_min,
        weatherCodes: weatherJson.daily.weather_code,
        rainChances: weatherJson.daily.precipitation_probability_mean,
      },
      details: {
        wind: weatherJson.current.wind_speed_10m,
        humidity: weatherJson.current.relative_humidity_2m,
        dewPoint: weatherJson.current.dew_point_2m,
        pressure: weatherJson.current.surface_pressure,
        uvIndex: weatherJson.daily.uv_index_max[0],
        sunrise,
        sunset,
      },
    };
  }
  //takes an iso date and returns a luxon date in the specified timezone
  convertToLocalTime(date, localTimeZone) {
    let localDate = DateTime.fromISO(date, { zone: "UTC" }).setZone(
      localTimeZone
    );
    return localDate;
  }

  //maps WMO weather interpretation codes to descriptions
  weatherCodeDecrypt(weatherCode) {
    switch (weatherCode) {
      case 0:
        return "Clear sky";
      case 1:
        return "Mainly clear";
      case 2:
        return "Partly cloudy";
      case 3:
        return "Overcast";
      case 45:
        return "Fog";
      case 48:
        return "Depositing rime fog";
      case 51:
        return "Light drizzle";
      case 53:
        return "Moderate drizzle";
      case 55:
        return "Dense drizzle";
      case 56:
        return "Light freezing drizzle";
      case 57:
        return "Dense freezing drizzle";
      case 61:
        return "Slight rain";
      case 63:
        return "Moderate rain";
      case 65:
        return "Heavy rain";
      case 66:
        return "Light freezing rain";
      case 67:
        return "Heavy freezing rain";
      case 71:
        return "Slight snow fall";
      case 73:
        return "Moderate snow fall";
      case 75:
        return "Heavy snow fall";
      case 77:
        return "Snow grains";
      case 80:
        return "Slight rain showers";
      case 81:
        return "Moderate rain showers";
      case 82:
        return "Violent rain showers";
      case 85:
        return "Slight snow showers";
      case 86:
        return "Heavy snow showers";
      case 95:
        return "Thunderstorm";
      case 96:
        return "Thunderstorm with slight hail";
      case 99:
        return "Thunderstorm with heavy hail";
    }
  }
}

const parser = new Parser();
export { parser };
