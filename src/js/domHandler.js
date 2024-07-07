import { app } from "./index";

class DomHandler {
  #searchbarForm = document.querySelector("#searchbar-form");
  constructor() {
    const searchbar = document.querySelector("#searchbar");
    //add event listeners
    this.#searchbarForm.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        this.searchbarSubmitEvent(e);
      }
    });
    //prevents form submission from reloading page
    this.#searchbarForm.addEventListener("submit", (e) => e.preventDefault());
    searchbar.addEventListener("keyup", () => {
      this.searchbarResultsEvent();
    });
    this.#searchbarForm.addEventListener("keydown", this.tabSearchResult);
    this.#searchbarForm.addEventListener("keydown", this.shiftTabSearchResult);
    window.addEventListener("click", this.hideSearchResults);
    searchbar.addEventListener("onfocus", this.showExistingSearchResults);
    searchbar.addEventListener("click", this.showExistingSearchResults);
    document
      .querySelector("#search-results-container")
      .addEventListener("click", () => {
        this.searchbarSubmitEvent();
      });
  }
  searchbarSubmitEvent(e) {
    // e.preventDefault();
    let locationIndex = undefined;
    // set location index if submit event was triggered with search result selected
    if (document.activeElement.classList.value === "search-result") {
      locationIndex =
        parseInt(document.activeElement.getAttribute("tabindex")) - 2;
    }
    const location = new FormData(this.#searchbarForm).get("location");
    console.log(location);
    //reset after so we can extract form values correctly
    this.#searchbarForm.reset();
    //make search results dissapear after form reset
    document.querySelector("#search-results-container").style.display = "none";
    //finally send info to app
    app.updateWeather(location, locationIndex);
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
  //hides search results on outside click
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
  //event to submit form when search form submitted with result selected
  // searchResultSubmitEvent(searchResult) {
  //   searchResult.addEventListener("click", () => {
  //     this.#searchbarForm.dispatchEvent(new Event("submit"));
  //   });
  //   searchResult.addEventListener("keyup", (e) => {
  //     if (e.key === "Enter") {
  //       this.#searchbarForm.dispatchEvent(new Event("submit"));
  //     }
  //   });
  // }
}

const domHandler = new DomHandler();

export { domHandler };
