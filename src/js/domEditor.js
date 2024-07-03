import { parser } from "./parser";

class DomEditor {
  constructor() {}
  loadContent() {
    this.createDailyCard();
    this.createHourlyCard();
  }

  updateWeather(data) {
    this.updateMainCard(data.main);
    this.updateHourlyCard(data, data.hourly);
    this.updateDailyCard(data, data.daily);
    this.updateDetailsCard(data.details);
  }
  createHourlyCard() {
    const hourlyCard = document.querySelector("#hourly-card .card");
    //insert data slots for up to 48 hours
    for (let i = 0; i < 48; i++) {
      const card = document.createElement("div");
      const time = document.createElement("p");
      const temperature = document.createElement("p");
      const condition = document.createElement("img");
      const chanceOfRain = document.createElement("p");
      //append elements
      card.append(time, temperature, condition, chanceOfRain);
      hourlyCard.appendChild(card);
    }
  }
  createDailyCard() {
    const dailyCard = document.querySelector("#daily-card .card");
    //insert data for up to 48 hours
    for (let i = 0; i < 7; i++) {
      const card = document.createElement("div");
      const day = document.createElement("p");
      const maxTemp = document.createElement("p");
      const minTemp = document.createElement("p");
      const condition = document.createElement("img");
      const chanceOfRain = document.createElement("p");
      //append elements
      card.append(day, maxTemp, minTemp, condition, chanceOfRain);
      dailyCard.appendChild(card);
    }
  }
  updateMainCard(data) {
    console.log("Update Main Card Method received data successfully");
  }

  updateHourlyCard(data, hourlyData) {
    const hourlyCard = document.querySelector("#hourly-card .card");
    //insert data for up to 48 hours
    for (let i = 0; i < 48; i++) {
      const card = hourlyCard.children[i];
      const time = card.children[0];
      const temperature = card.children[1];
      const condition = card.children[2];
      const chanceOfRain = card.children[3];
      //edit content
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
    }
  }
  updateDailyCard(data, dailyData) {
    const dailyCard = document.querySelector("#daily-card .card");
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    //insert data for up to 48 hours
    for (let i = 0; i < 7; i++) {
      const card = dailyCard.children[i];
      const day = card.children[0];
      const maxTemp = card.children[1];
      const minTemp = card.children[2];
      const condition = card.children[3];
      const chanceOfRain = card.children[4];
      //edit content
      day.textContent = days[(data.localTime.weekday + i - 1) % 7];
      maxTemp.textContent = dailyData.maxTemperatures[i] + "°C";
      minTemp.textContent = dailyData.minTemperatures[i] + "°C";
      condition.setAttribute("alt", dailyData.weatherCodes[i]);
      chanceOfRain.textContent = dailyData.rainChances[i] + "%";
    }
  }
  updateDetailsCard(data) {}
}

const domEditor = new DomEditor();

export { domEditor };
