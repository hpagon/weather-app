import { parser } from "./parser";
import { weatherCondition } from "./weatherCondition";
import { domHandler } from "./domHandler";
import Rain from "/src/assets/details/water.svg";

class DomEditor {
  constructor() {}
  // initializes page on start up
  loadContent() {
    //create content
    this.createDailyCard();
    this.createHourlyCard();
    this.createSearchResults();
    //hide content
    document.querySelector("#container").classList.add("start");
  }

  updateWeather(data) {
    //calculate imperial data if data is set to imperial on load
    const toggleButton = document.querySelector("#unit-toggle");
    if (toggleButton.textContent === "Imperial (F°)") {
      parser.calculateImperialUnits();
    }
    if (data === undefined) return;
    //update cards
    this.updateMainCard(data, data.main);
    this.updateHourlyCard(data, data.hourly);
    this.updateDailyCard(data, data.daily);
    //show content if hidden
    document.querySelector("#container").classList.remove("start");
    //update background
    const bgColors = weatherCondition.weatherCodeToBackground(
      data.main.weatherCode,
      data.main.isDay
    );
    document.querySelector(
      "#container"
    ).style.background = `linear-gradient(${bgColors[0]}, ${bgColors[1]})`;
    //add small animation
    for (let element of document.querySelectorAll("#main > div > div")) {
      element.classList.add("updated");
      setTimeout(() => element.classList.remove("updated"), 50);
    }
    //update root class to change card colors
    data.main.isDay === 0
      ? document.documentElement.classList.add("night")
      : document.documentElement.classList.remove("night");
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
      const rainContainer = document.createElement("div");
      const rainIcon = document.createElement("img");
      const chanceOfRain = document.createElement("p");
      const infoContainer = document.createElement("div");
      const dayContainer = document.createElement("div");
      //add classes/attributes
      card.classList.add("card");
      rainIcon.src = Rain;
      //append elements
      dayContainer.appendChild(day);
      rainContainer.append(rainIcon, chanceOfRain);
      infoContainer.append(maxTemp, minTemp, condition, rainContainer);
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
      domHandler.searchResultClickEvent(resultContainer);
      //append elements
      resultText.append(city, admin1, country);
      resultContainer.appendChild(resultText);
      resultsContainer.appendChild(resultContainer);
    }
    resultsContainer.style.display = "none";
  }
  updateMainCard(data, mainData) {
    const city = document.querySelector("#city");
    const admin1 = document.querySelector("#admin1");
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
    //get suffixes to select correct units
    const temperatureSuffix = this.getTemperatureSuffix();
    const distanceSuffix = this.getDistanceSuffix();
    const pressureSuffix = this.getPressureSuffix();
    // update content
    city.textContent = mainData.city;
    admin1.textContent = mainData.state === undefined ? "" : mainData.state;
    country.textContent = mainData.country;
    temperature.textContent =
      Math.round(mainData["temperature" + temperatureSuffix]) + "°";
    feelsLike.textContent =
      Math.round(mainData["feelsLike" + temperatureSuffix]) + "°";
    condition.textContent = weatherCondition.weatherCodeDecrypt(
      mainData.weatherCode
    );
    conditionImage.src = weatherCondition.weatherCodeToImage(
      mainData.weatherCode,
      mainData.isDay
    );
    lastUpdated.textContent = mainData.lastUpdated;
    // update details content
    wind.textContent =
      Math.round(mainData.details["wind" + distanceSuffix]) +
      " " +
      data.units["wind" + distanceSuffix];
    humidity.textContent = mainData.details.humidity + "%";
    dewpoint.textContent =
      Math.round(mainData.details["dewPoint" + temperatureSuffix]) + "°";
    pressure.textContent =
      Math.round(mainData.details["pressure" + pressureSuffix]) +
      " " +
      data.units["pressure" + pressureSuffix];
    uvIndex.textContent = mainData.details.uvIndex;
    visibility.textContent =
      Math.round(mainData.details["visibility" + distanceSuffix]) +
      " " +
      data.units["visibility" + distanceSuffix];
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
      //get unit suffixes
      const temperatureSuffix = this.getTemperatureSuffix();
      //set attributes
      condition.setAttribute("draggable", "false");
      //edit content
      time.textContent = parser.convertMilitaryTimeHour(
        (data.localHour + i) % 24
      );
      temperature.textContent =
        Math.round(
          hourlyData["temperatures" + temperatureSuffix][data.indexHour + i]
        ) + "°";
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
      const chanceOfRain = card.children[1].children[3].children[1];
      //get unit suffixes
      const temperatureSuffix = this.getTemperatureSuffix();
      //edit content
      day.textContent =
        i === 0
          ? "Today"
          : days[(data.localTime.weekday + i - 1) % 7] +
            " " +
            (data.localTime.day + i);
      maxTemp.textContent =
        Math.round(dailyData["maxTemperatures" + temperatureSuffix][i]) + "°";
      minTemp.textContent =
        Math.round(dailyData["minTemperatures" + temperatureSuffix][i]) + "°";
      condition.setAttribute("alt", dailyData.weatherCodes[i]);
      condition.src = weatherCondition.weatherCodeToImage(
        dailyData.weatherCodes[i]
      );
      chanceOfRain.textContent = dailyData.rainChances[i] + "%";
    }
  }
  //refreshes the result dropdown based on current context
  updateSearchResults(results) {
    const resultsContainer = document.querySelector(
      "#search-results-container"
    );
    if (results === undefined) {
      this.displayError("No matches found.");
      return;
    }
    for (let i = 0; i < 10; i++) {
      const resultContainer = resultsContainer.children[i + 1];
      const city = resultContainer.children[0].children[0];
      const admin1 = resultContainer.children[0].children[1];
      const country = resultContainer.children[0].children[2];
      //if results has less than 10 entries, hide the empty entries
      if (i >= results.length) {
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
    resultsContainer.style.display = "block";
  }
  //displays an error message in the results dropdown
  displayError(errorMessage) {
    const resultsContainer = document.querySelector(
      "#search-results-container"
    );
    //hide search result boxes
    for (let i = 0; i < 10; i++) {
      resultsContainer.children[i + 1].style.display = "none";
    }
    //change message text and display
    const message = resultsContainer.children[0];
    message.textContent = errorMessage;
    message.style.display = "block";
    resultsContainer.style.display = "block";
  }
  insertLoadingComponent() {
    const icon1 = document.querySelector("#searchbar-form img");
    const icon2 = document.querySelector("#logo img");
    icon1.classList.add("loading");
    icon2.classList.add("loading");
  }
  removeLoadingComponent() {
    const icon1 = document.querySelector("#searchbar-form img");
    const icon2 = document.querySelector("#logo img");
    icon1.classList.remove("loading");
    icon2.classList.remove("loading");
  }
  toggleUnits() {
    const toggleButton = document.querySelector("#unit-toggle");
    if (toggleButton.textContent === "Metric (C°)") {
      parser.calculateImperialUnits();
      toggleButton.textContent = "Imperial (F°)";
    } else {
      toggleButton.textContent = "Metric (C°)";
    }
    this.updateWeather(parser.getCurrentData());
  }
  getTemperatureSuffix() {
    const toggleButton = document.querySelector("#unit-toggle");
    if (toggleButton.textContent === "Metric (C°)") return "";
    return "_f";
  }
  getDistanceSuffix() {
    const toggleButton = document.querySelector("#unit-toggle");
    if (toggleButton.textContent === "Metric (C°)") return "";
    return "_miles";
  }
  getPressureSuffix() {
    const toggleButton = document.querySelector("#unit-toggle");
    if (toggleButton.textContent === "Metric (C°)") return "";
    return "_psi";
  }
  showStartOrWeatherPage() {
    const container = document.querySelector("#container");
    if (container.classList.value === "start") {
      localStorage.getItem("location") !== null
        ? container.classList.remove("start")
        : container.classList.add("start");
    } else {
      container.classList.add("start");
    }
  }
}

const domEditor = new DomEditor();

export { domEditor };
