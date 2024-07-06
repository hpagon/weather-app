import { app } from "./index";

class DomHandler {
  constructor() {
    const searchbar = document.querySelector("#searchbar");
    document
      .querySelector("#searchbar-form")
      .addEventListener("submit", this.searchbarSubmitEvent);
    searchbar.addEventListener("keyup", () => {
      this.searchbarResultsEvent();
    });
    document
      .querySelector("#searchbar-form")
      .addEventListener("keydown", this.tabSearchResult);
    document
      .querySelector("#searchbar-form")
      .addEventListener("keydown", this.shiftTabSearchResult);
    window.addEventListener("click", this.hideSearchResults);
    searchbar.addEventListener("onfocus", this.showExistingSearchResults);
    searchbar.addEventListener("click", this.showExistingSearchResults);
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
  debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }
  //shows or hides search results depending on character count (for keydown event)
  searchbarResultsEvent = this.debounce(() => {
    const location = document.querySelector("#searchbar").value;
    if (location.length >= 3) {
      app.searchLocations(location);
    } else {
      document.querySelector("#search-results-container").style.display =
        "none";
    }
  });
  shiftTabSearchResult(e) {
    if (e.key === "ArrowUp") {
      const currentActive = document.activeElement;
      const tabIndex = currentActive.getAttribute("tabindex");
      const nextActive = document.querySelector(
        `*[tabindex="${
          parseInt(tabIndex) === 1 ? 11 : parseInt(tabIndex) - 1
        }"]`
      );
      nextActive.focus();
    }
  }
  tabSearchResult(e) {
    if (e.key === "ArrowDown") {
      const currentActive = document.activeElement;
      const tabIndex = currentActive.getAttribute("tabindex");
      const nextActive = document.querySelector(
        `*[tabindex="${
          parseInt(tabIndex) === 11 ? 1 : parseInt(tabIndex) + 1
        }"]`
      );
      nextActive.focus();
    }
  }
  //hides search results
  hideSearchResults(e) {
    //hide only if click was registered outside the search form
    if (
      e.target !== document.querySelector("#searchbar-form") &&
      !document.querySelector("#searchbar-form").contains(e.target)
    ) {
      document.querySelector("#search-results-container").style.display =
        "none";
    }
  }
  //shows search results if they are already present but hidden
  showExistingSearchResults() {
    const location = document.querySelector("#searchbar").value;
    if (location.length >= 3) {
      document.querySelector("#search-results-container").style.display =
        "block";
    }
  }
}

const domHandler = new DomHandler();
