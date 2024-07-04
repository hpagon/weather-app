import { DateTime } from "luxon";
import { weatherCondition } from "./weatherCondition";

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
    let lastUpdated = this.convertToLocalTime(
      weatherJson.current.time,
      locationJson.timezone
    ).toFormat("t ZZZZ");
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
        weatherCode: weatherCondition.weatherCodeDecrypt(
          weatherJson.current.weather_code
        ),
        lastUpdated,
        details: {
          wind: weatherJson.current.wind_speed_10m,
          humidity: weatherJson.current.relative_humidity_2m,
          dewPoint: weatherJson.current.dew_point_2m,
          pressure: weatherJson.current.surface_pressure,
          uvIndex: weatherJson.daily.uv_index_max[0],
          sunrise,
          sunset,
        },
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
    };
  }
  //takes an iso date and returns a luxon date in the specified timezone
  convertToLocalTime(date, localTimeZone) {
    let localDate = DateTime.fromISO(date, { zone: "UTC" }).setZone(
      localTimeZone
    );
    return localDate;
  }

  //converts an hour in military time to the standard format
  convertMilitaryTimeHour(hour) {
    const suffix = hour >= 12 ? " pm" : " am";
    const adjustedHour = hour === 12 || hour === 0 ? 12 : hour % 12;
    return adjustedHour + suffix;
  }
}

const parser = new Parser();
export { parser };
