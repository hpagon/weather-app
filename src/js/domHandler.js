import { app } from "./index";

class DomHandler {
  constructor() {
    document
      .querySelector("#searchbar-form")
      .addEventListener("submit", this.searchbarSubmitEvent);
  }
  searchbarSubmitEvent(e) {
    e.preventDefault();
    const location = new FormData(e.target).get("location");
    console.log(location);
    //reset after so we can extract form values correctly
    e.target.reset();
    //finally send info to app
    app.updateWeather(location);
  }
}

const domHandler = new DomHandler();
