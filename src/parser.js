import { format } from "date-fns";

class Parser {
  constructor() {}
  parseWeatherData(locationJson, weatherJson) {
    //convert utc to local time
    let currentTime = format(new Date(), "yyyy-MM-dd HH:mm:ssxxx", {
      timeZone: locationJson.timezone,
    });
    let currentHour = format(new Date(), "HH", {
      timeZone: locationJson.timezone,
    });
    let givenHour = format(new Date(weatherJson.current.time), "HH");
    let sunrise = format(new Date(weatherJson.daily.sunrise[0]), "HH:mm");
    let sunset = format(new Date(weatherJson.daily.sunset[0]), "HH:mm");
    return {
      localTime: currentTime,
      localHour: currentHour,
      time: weatherJson.current.time,
      indexHour: givenHour,
      main: {
        city: locationJson.name,
        state: locationJson.admin1,
        country: locationJson.country,
        temperature: weatherJson.current.temperature_2m,
        feelsLike: weatherJson.current.apparent_temperature,
        weatherCode: weatherJson.current.weather_code,
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
  //   weatherCodeDecrypt(weatherCode) {

  //   }
}

const parser = new Parser();
export { parser };
