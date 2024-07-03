import { parser } from "./parser";

class DomEditor {
  constructor() {}

  updateWeather(data) {
    this.updateMainCard(data.main);
    this.updateHourlyCard(data, data.hourly);
    this.updateDailyCard(data, data.daily);
    this.updateDetailsCard(data.details);
  }
  updateMainCard(data) {
    console.log("Update Main Card Method received data successfully");
  }
  updateHourlyCard(data, hourlyData) {
    const hourlyCard = document.querySelector("#hourly-card .card");
    //insert data for up to 48 hours
    for (let i = 0; i < 48; i++) {
      const card = document.createElement("div");
      const time = document.createElement("p");
      const temperature = document.createElement("p");
      const condition = document.createElement("img");
      const chanceOfRain = document.createElement("p");
      //add content
      time.textContent = parser.convertMilitaryTimeHour(
        (data.localHour + i) % 24
      );
      temperature.textContent =
        hourlyData.temperatures[data.indexHour + i] + "°F";
      condition.setAttribute(
        "alt",
        hourlyData.weatherCodes[data.indexHour + i]
      );
      chanceOfRain.textContent =
        hourlyData.rainChances[data.indexHour + i] + "%";
      //append elements
      card.append(time, temperature, condition, chanceOfRain);
      hourlyCard.appendChild(card);
    }
  }
  updateDailyCard(data, dailyData) {
    const dailyCard = document.querySelector("#daily-card");
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    //insert data for up to 48 hours
    for (let i = 0; i < 7; i++) {
      const card = document.createElement("div");
      const day = document.createElement("p");
      const maxTemp = document.createElement("p");
      const minTemp = document.createElement("p");
      const condition = document.createElement("img");
      const chanceOfRain = document.createElement("p");
      //add content
      day.textContent = days[(data.localTime.weekday + i - 1) % 7];
      maxTemp.textContent = dailyData.maxTemperatures[i] + "°C";
      minTemp.textContent = dailyData.minTemperatures[i] + "°C";
      condition.setAttribute("alt", dailyData.weatherCodes[i]);
      chanceOfRain.textContent = dailyData.rainChances[i] + "%";
      //append elements
      card.append(day, maxTemp, minTemp, condition, chanceOfRain);
      dailyCard.appendChild(card);
    }
  }
  updateDetailsCard(data) {}
}

const domEditor = new DomEditor();

export { domEditor };
