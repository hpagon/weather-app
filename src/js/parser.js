import { DateTime } from "luxon";
// import { weatherCondition } from "./weatherCondition";

class Parser {
  #currentData;
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
    let data = {
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
        weatherCode: weatherJson.current.weather_code,
        isDay: weatherJson.current.is_day,
        lastUpdated,
        details: {
          wind: weatherJson.current.wind_speed_10m,
          humidity: weatherJson.current.relative_humidity_2m,
          dewPoint: weatherJson.current.dew_point_2m,
          pressure: weatherJson.current.surface_pressure,
          uvIndex: weatherJson.daily.uv_index_max[0],
          visibility: weatherJson.current.visibility,
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
      units: {
        wind: "km/h",
        pressure: "hPa",
        visibility: "m",
        converted: false,
        wind_miles: "mph",
        visibility_miles: "miles",
      },
    };
    localStorage.setItem("location", JSON.stringify(locationJson));
    this.#currentData = data;
    return data;
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
  //convert deg c to deg f
  convertCToF(deg) {
    return deg * (9 / 5.0) + 32;
  }
  convertKmToMiles(km) {
    return km * 0.62137273664981;
  }
  convertMtoMiles(m) {
    return this.convertKmToMiles(m * 0.001);
  }
  //calculates imperial units manually to avoid api call
  calculateImperialUnits() {
    if (this.#currentData === undefined) return;
    //only calculate imperial units once
    if (!this.#currentData.units.converted) {
      console.log("Converted to F the first time");
      //main data
      this.#currentData.main.temperature_f = this.convertCToF(
        this.#currentData.main.temperature
      );
      this.#currentData.main.feelsLike_f = this.convertCToF(
        this.#currentData.main.feelsLike
      );
      //detaila data
      this.#currentData.main.details.wind_miles = this.convertKmToMiles(
        this.#currentData.main.details.wind
      );
      this.#currentData.main.details.dewPoint_f = this.convertCToF(
        this.#currentData.main.details.dewPoint
      );
      this.#currentData.main.details.visibility_miles = this.convertMtoMiles(
        this.#currentData.main.details.visibility
      );
      // pressure????????????????????????????????????????
      //hourly data
      this.#currentData.hourly.temperatures_f =
        this.#currentData.hourly.temperatures.map((temp) =>
          this.convertCToF(temp)
        );
      //daily data
      this.#currentData.daily.maxTemperatures_f =
        this.#currentData.daily.maxTemperatures.map((temp) =>
          this.convertCToF(temp)
        );
      this.#currentData.daily.minTemperatures_f =
        this.#currentData.daily.minTemperatures.map((temp) =>
          this.convertCToF(temp)
        );
      //prevent future calculation
      this.#currentData.units.converted = true;
    }
  }
  getCurrentData() {
    return this.#currentData;
  }
}

const parser = new Parser();
export { parser };
