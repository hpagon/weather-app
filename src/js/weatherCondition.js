import Sun from "/src/assets/sun.png";
import Night from "/src/assets/night.png";
import SunnyCloudy from "/src/assets/cloudy.png";
import NightCloudy from "/src/assets/night-cloudy.png";
import Storm from "/src/assets/storm.png";
import Cloud from "/src/assets/cloud.png";
import Rainy from "/src/assets/rainy.png";
import Snowy from "/src/assets/snowy.png";

class WeatherCondition {
  constructor() {}
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
  //takes a weather code and maps it to an image
  weatherCodeToImage(weatherCode, isDay = 1) {
    // clear (ternary operation takes into account daily conditions where we want clear sunny displayed by default)
    if (weatherCode === 0) {
      return isDay === 1 ? Sun : Night;
    } else if (weatherCode < 3) {
      return isDay === 1 ? SunnyCloudy : NightCloudy;
    } else if (weatherCode < 51) {
      return Cloud;
    } else if (weatherCode < 71) {
      return Rainy;
    } else if (weatherCode < 80) {
      return Snowy;
    } else if (weatherCode < 85) {
      return Rainy;
    } else if (weatherCode < 95) {
      return Snowy;
    } else {
      return Storm;
    }
  }
  weatherCodeToBackground(weatherCode, isDay = 1) {
    if (weatherCode === 0) {
      //clear
      return isDay === 1 ? ["lightblue", "#69b0db"] : ["#152230", "#152230"];
    } else if (weatherCode < 3) {
      //partly cloudy
      return isDay === 1 ? ["#69b0db", "#c1cad9"] : ["#152230", "#0b121a"];
    } else if (weatherCode < 51) {
      //cloudy
      return isDay === 1 ? ["#c1cad9", "gray"] : ["#0b121a", "#0b121a"];
    } else if (weatherCode < 71) {
      //rain
      return isDay === 1 ? ["#c1cad9", "gray"] : ["#0b121a", "#0b121a"];
    } else if (weatherCode < 80) {
      //snow
      return isDay === 1 ? ["#c1cad9", "gray"] : ["#0b121a", "#0b121a"];
    } else if (weatherCode < 85) {
      //rain showers
      return isDay === 1 ? ["#c1cad9", "gray"] : ["#0b121a", "#0b121a"];
    } else if (weatherCode < 95) {
      //snow showers
      return isDay === 1 ? ["#c1cad9", "gray"] : ["#0b121a", "#0b121a"];
    } else {
      //thunderstorm
      return isDay === 1 ? ["#313233", "gray"] : ["#0b121a", "#0b121a"];
    }
  }
}

const weatherCondition = new WeatherCondition();

export { weatherCondition };
