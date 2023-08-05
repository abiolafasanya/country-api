const body = document.body;
const themeSwitch = document.querySelector(".theme-switch");

let themeMemory = JSON.parse(localStorage.getItem("theme"));
if (!themeMemory) {
  themeMemory = { dark: false };
  localStorage.setItem("theme", JSON.stringify(themeMemory));
}

const applyTheme = () => {
  // Apply the theme based on the stored state
  if (themeMemory.dark) {
    body.classList.add("dark");
  } else {
    body.classList.remove("dark");
  }
};

const toggleBackground = () => {
  themeMemory = JSON.parse(localStorage.getItem("theme"));
  if (themeMemory.dark) {
    body.classList.remove("dark");
    themeMemory.dark = false;
  } else {
    body.classList.add("dark");
    themeMemory.dark = true;
  }
  localStorage.setItem("theme", JSON.stringify(themeMemory));
};

applyTheme();
themeSwitch.addEventListener("click", toggleBackground);

function fetchData() {
  const url = "https://abiolafasanya.github.io/country-api/data.json"
  return fetch(url || 'data.json')
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching data:", error);
      return [];
    });
}

const filterOption = document.querySelector("#filter");
const filterPanel = document.querySelector("#filter-panel");

const currentSelection = document.querySelector(".main-selection span");
filterPanel.addEventListener("click", openSelection);

document.addEventListener("click", (event) => {
  const isClickInsidePanel = filterPanel.contains(event.target);
  if (!isClickInsidePanel) {
    // Clicked outside the filterPanel, so close the panel
    filterOption.innerHTML = "";
    filterPanel.classList.add("hidden");
  }
});

filterPanel.classList.add("hidden");
function openSelection() {
  const isPanelHidden = filterPanel.classList.contains("hidden");
  if (isPanelHidden) {
    // Open the panel and fetch data
    filterPanel.classList.remove("hidden");
    getUniqueRegions().then((data) => {
      const selectElement = document.createElement("div");
      data.forEach((region) => {
        const optionElement = document.createElement("div");
        optionElement.classList.add("selection-option");
        optionElement.textContent = region;
        selectElement.appendChild(optionElement);
        optionElement.addEventListener("click", () => {
          const selectedOptionText = optionElement.textContent;
          currentSelection.textContent = selectedOptionText;
          filterOption.classList.add("hidden");

          // Call the renderCountryCards function when the selection is made
          renderCountryCards();
        });
      });
      // Before appending the selectElement, clear the previous options
      filterOption.innerHTML = "";
      filterOption.appendChild(selectElement);
    });
  } else {
    filterOption.innerHTML = "";
    filterPanel.classList.add("hidden");
  }
  // Promise.resolve().then(() => {
  //   console.log("state");
  // });
}

const countriesContainer = document.querySelector("#countries-container");
let countryData;
fetchData().then((data) => {
  countryData = data;
  renderCountryCards();
});

function renderCountryCards(filter = "") {
  let countriesToShow;
  if (filter !== "") {
    countriesToShow = countryData.filter((country) =>
      country.name.toLowerCase().includes(filter)
    );
  } else {
    // Get the currently selected region
    const selectedRegion = currentSelection.textContent.trim();
    // Convert the selected region to lowercase for comparison
    const selectedRegionLowerCase = selectedRegion.toLowerCase();

    countriesToShow = countryData.filter(
      (country) => country.region.toLowerCase() === selectedRegionLowerCase
    );
  }
    console.log(countryData);
    console.log(countriesToShow);
    console.log({res: currentSelection.textContent});
    
  countriesToShow.forEach((option) => {
    const countryCard = document.createElement("div");
    const countryImage = document.createElement("img");
    const countryName = document.createElement("h3");
    const countryPopulation = document.createElement("h5");
    const countryRegion = document.createElement("h5");
    const countryCapital = document.createElement("h5");
    const countryContent = document.createElement("article");

    countryCard.setAttribute("data-region", option.region);
    countryCard.classList.add("country-card");

    // if (currentSelection.innerHTML.match(option.region)) {
    countryImage.src = option.flags.svg;
    countryName.textContent = option.name;
    countryCapital.innerHTML = `<b>Capital:</b>  <span>${option.capital}</span>`;
    countryPopulation.innerHTML = `<b>Population:</b>  <span>${option.population}</span>`;
    countryRegion.innerHTML = `<b>Region:</b>  <span>${option.region}</span>`;

    countryContent.appendChild(countryName);
    countryContent.appendChild(countryPopulation);
    countryContent.appendChild(countryRegion);
    countryContent.appendChild(countryCapital);

    // Append elements to countryCard in the desired order
    countryCard.appendChild(countryImage);
    countryCard.appendChild(countryContent);
    countriesContainer.innerHTML = "";
    countriesContainer.appendChild(countryCard);
  });
}

async function getUniqueRegions() {
  const data = await fetchData();
  const regions = data.map((item) => item.region);
  const uniqueRegions = [...new Set(regions)];
  console.log(uniqueRegions);
  return uniqueRegions;
}

const searchInput = document.querySelector("#search");
searchInput.addEventListener("input", () => {
  const searchText = searchInput.value.trim().toLowerCase();
  renderCountryCards(searchText);
});
