import { parser } from "./parser";
import { weatherCondition } from "./weatherCondition";
import { domHandler } from "./domHandler";
import Rain from "/src/assets/details/rainy.svg";

class DomEditor {
  constructor() {}
  loadContent() {
    this.createDailyCard();
    this.createHourlyCard();
    this.createSearchResults();
  }

  updateWeather(data) {
    this.updateMainCard(data, data.main);
    this.updateHourlyCard(data, data.hourly);
    this.updateDailyCard(data, data.daily);
  }
  createHourlyCard() {
    const hourlyCard = document.querySelector("#hourly-card .card-container");
    //insert data slots for up to 48 hours
    for (let i = 0; i < 48; i++) {
      const card = document.createElement("div");
      const time = document.createElement("p");
      const temperature = document.createElement("p");
      const condition = document.createElement("img");
      const rain = document.createElement("div");
      const rainIcon = document.createElement("img");
      const chanceOfRain = document.createElement("p");
      //add classes/attributes
      card.classList.add("card");
      rainIcon.src = Rain;
      //append elements
      rain.append(rainIcon, chanceOfRain);
      card.append(time, temperature, condition, rain);
      hourlyCard.appendChild(card);
    }
  }
  createDailyCard() {
    const dailyCard = document.querySelector("#daily-card .card-container");
    //insert data for up to 48 hours
    for (let i = 0; i < 8; i++) {
      const card = document.createElement("div");
      const day = document.createElement("p");
      const maxTemp = document.createElement("p");
      const minTemp = document.createElement("p");
      const condition = document.createElement("img");
      const chanceOfRain = document.createElement("p");
      const infoContainer = document.createElement("div");
      const dayContainer = document.createElement("div");
      //add classes/attributes
      card.classList.add("card");
      //append elements
      dayContainer.appendChild(day);
      infoContainer.append(maxTemp, minTemp, condition, chanceOfRain);
      card.append(dayContainer, infoContainer);
      dailyCard.appendChild(card);
    }
  }
  createSearchResults() {
    const resultsContainer = document.querySelector(
      "#search-results-container"
    );
    const message = document.createElement("div");
    message.id = "search-results-message";
    resultsContainer.appendChild(message);
    for (let i = 0; i < 10; i++) {
      const resultContainer = document.createElement("div");
      const resultText = document.createElement("p");
      const city = document.createElement("span");
      const admin1 = document.createElement("span");
      const country = document.createElement("span");
      //add classes/attributes
      resultContainer.classList.add("search-result");
      resultContainer.setAttribute("tabindex", i + 2);
      //add events
      // domHandler.searchResultSubmitEvent(resultContainer);
      //append elements
      resultText.append(city, admin1, country);
      resultContainer.appendChild(resultText);
      resultsContainer.appendChild(resultContainer);
    }
    resultsContainer.style.display = "none";
  }
  updateMainCard(data, mainData) {
    const city = document.querySelector("#city");
    const country = document.querySelector("#country");
    const temperature = document.querySelector("#current-temperature");
    const feelsLike = document.querySelector("#feels-like").children[0];
    const condition = document.querySelector("#condition");
    const conditionImage = document.querySelector("#condition-image");
    const lastUpdated = document.querySelector("#last-updated").children[0];
    const wind = document.querySelector("#wind");
    const humidity = document.querySelector("#humidity");
    const dewpoint = document.querySelector("#dew-point");
    const pressure = document.querySelector("#pressure");
    const uvIndex = document.querySelector("#uv-index");
    const visibility = document.querySelector("#visibility");
    const sunrise = document.querySelector("#sunrise");
    const sunset = document.querySelector("#sunset");
    // update content
    city.textContent = mainData.city;
    country.textContent =
      mainData.country === "United States" ? mainData.state : mainData.country;
    temperature.textContent = mainData.temperature + "°";
    feelsLike.textContent = mainData.feelsLike + "°";
    condition.textContent = weatherCondition.weatherCodeDecrypt(
      mainData.weatherCode
    );
    conditionImage.src = weatherCondition.weatherCodeToImage(
      mainData.weatherCode,
      mainData.isDay
    );
    lastUpdated.textContent = mainData.lastUpdated;
    // update details content
    wind.textContent = mainData.details.wind;
    humidity.textContent = mainData.details.humidity;
    dewpoint.textContent = mainData.details.dewPoint;
    pressure.textContent = mainData.details.pressure;
    uvIndex.textContent = mainData.details.uvIndex;
    visibility.textContent = mainData.details.visibility;
    sunrise.textContent = mainData.details.sunrise;
    sunset.textContent = mainData.details.sunset;
  }

  updateHourlyCard(data, hourlyData) {
    const hourlyCard = document.querySelector("#hourly-card .card-container");
    //insert data for up to 48 hours
    for (let i = 0; i < 48; i++) {
      const card = hourlyCard.children[i];
      const time = card.children[0];
      const temperature = card.children[1];
      const condition = card.children[2];
      const chanceOfRain = card.children[3].children[1];
      //edit content
      time.textContent = parser.convertMilitaryTimeHour(
        (data.localHour + i) % 24
      );
      temperature.textContent =
        hourlyData.temperatures[data.indexHour + i] + "°";
      condition.setAttribute(
        "alt",
        hourlyData.weatherCodes[data.indexHour + i]
      );
      condition.src = weatherCondition.weatherCodeToImage(
        hourlyData.weatherCodes[data.indexHour + i],
        hourlyData.isDay[data.indexHour + i]
      );
      chanceOfRain.textContent =
        hourlyData.rainChances[data.indexHour + i] + "%";
    }
  }
  updateDailyCard(data, dailyData) {
    const dailyCard = document.querySelector("#daily-card .card-container");
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    //insert data for up to 48 hours
    for (let i = 0; i < 8; i++) {
      const card = dailyCard.children[i];
      const day = card.children[0].children[0];
      const maxTemp = card.children[1].children[0];
      const minTemp = card.children[1].children[1];
      const condition = card.children[1].children[2];
      const chanceOfRain = card.children[1].children[3];
      //edit content
      day.textContent =
        i === 0 ? "Today" : days[(data.localTime.weekday + i - 1) % 7];
      maxTemp.textContent = dailyData.maxTemperatures[i] + "°";
      minTemp.textContent = dailyData.minTemperatures[i] + "°";
      condition.setAttribute("alt", dailyData.weatherCodes[i]);
      condition.src = weatherCondition.weatherCodeToImage(
        dailyData.weatherCodes[i]
      );
      chanceOfRain.textContent = dailyData.rainChances[i] + "%";
    }
  }
  updateSearchResults(results) {
    const resultsContainer = document.querySelector(
      "#search-results-container"
    );
    for (let i = 0; i < 10; i++) {
      const resultContainer = resultsContainer.children[i + 1];
      // console.log("results container: ", resultsContainer);
      console.log("result container: ", resultContainer);
      const city = resultContainer.children[0].children[0];
      const admin1 = resultContainer.children[0].children[1];
      const country = resultContainer.children[0].children[2];
      //if results has less than 10 entries, hide the empty entries
      if (results === undefined || i >= results.length) {
        resultContainer.style.display = "none";
        continue;
      }
      //update content
      city.textContent = results[i].name + ", ";
      admin1.textContent = results[i].admin1 ? results[i].admin1 + ", " : "";
      country.textContent = results[i].country;
      //make entry visible
      resultContainer.style.display = "block";
    }
    resultsContainer.children[0].style.display = "none";
    if (results === undefined) {
      resultsContainer.children[0].style.display = "block";
      resultsContainer.children[0].textContent = "No matches found.";
    }
    resultsContainer.style.display = "block";
  }
}

const domEditor = new DomEditor();

export { domEditor };
