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

async function fetchData() {
  const url = "https://abiolafasanya.github.io/country-api/data.json";
  try {
    const response = await fetch(url || "data.json");
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

const filterOption = document.querySelector("#filter");
const filterPanel = document.querySelector("#filter-panel");
const currentSelection = document.querySelector(".main-selection span");
filterPanel.addEventListener("click", openSelection);

document.addEventListener("click", (event) => {
  const isClickInsidePanel = filterPanel.contains(event.target);
  if (!isClickInsidePanel) {
    filterOption.innerHTML = "";
    filterPanel.classList.add("close");
  }
});

filterPanel.classList.add("close");
function openSelection() {
  const isPanelHidden = filterPanel.classList.contains("close");
  if (isPanelHidden) {
    // Open the panel and fetch data
    filterPanel.classList.remove("close");
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
          filterOption.classList.add("close");
          renderCountryCards();
        });
      });
      filterOption.innerHTML = "";
      filterOption.appendChild(selectElement);
    });
  } else {
    filterOption.innerHTML = "";
    filterPanel.classList.add("close");
  }
}

const countriesContainer = document.querySelector("#countries-container");
let countryData;

fetchData().then((data) => {
  countryData = data;
  renderCountryCards();
});

function renderCountryCards(filter = "") {
  // let countriesToShow;
  if (filter !== "") {
    const data = countryData.filter((country) =>
      country.name.toLowerCase().includes(filter)
    );
    getCountryListing(data);
  } else {
    const selectedRegion = currentSelection.textContent.trim();
    const selectedRegionLowerCase = selectedRegion.toLowerCase();

    const data = countryData.filter(
      (country) => country.region.toLowerCase() === selectedRegionLowerCase
    );
    getCountryListing(data);
  }
}

function getCountryListing(countriesToShow) {
  // Clear the previous content in the countriesContainer
  countriesContainer.innerHTML = "";

  countriesToShow.forEach((option) => {
    const countryCard = document.createElement("div");
    countryCard.classList.add("country-card");

    const countryImage = document.createElement("img");
    const countryName = document.createElement("h3");
    const countryPopulation = document.createElement("h5");
    const countryRegion = document.createElement("h5");
    const countryCapital = document.createElement("h5");
    const countryContent = document.createElement("article");
    countryCard.setAttribute("data-region", option.region);

    countryImage.src = option.flags.svg;
    countryName.textContent = option.name;
    countryCapital.innerHTML = `<b>Capital:</b>  <span>${option.capital}</span>`;
    countryPopulation.innerHTML = `<b>Population:</b>  <span>${option.population}</span>`;
    countryRegion.innerHTML = `<b>Region:</b>  <span>${option.region}</span>`;

    countryContent.appendChild(countryName);
    countryContent.appendChild(countryPopulation);
    countryContent.appendChild(countryRegion);
    countryContent.appendChild(countryCapital);

    countryCard.appendChild(countryImage);
    countryCard.appendChild(countryContent);

    // Append each country card to the countriesContainer
    countriesContainer.appendChild(countryCard);

    countryCard.addEventListener("click", (e) => renderDetailsPage(option));
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

const item1 = document.querySelector("#section1");
const item2 = document.querySelector("#countries-container");

document.querySelector(".back-button").addEventListener("click", (e) => {
  e.preventDefault();
  item1.style.display = "flex";
  item2.style.display = "flex";
});

function renderDetailsPage(option) {
  const countryDetail = document.querySelector("#countryDetail");
  countryDetail.innerHTML = "";
  item1.style.display = "none";
  item2.style.display = "none";

  const countryCard = `
  <div class="country-data" data-region="${option.region}">
    <div class="img-card">
      <img src="${option.flags.svg}" alt="${option.name}" />
    </div>
    <article class="country-desc">
      <h3>${option.name}</h3>
      <div class="country-bio">
        <div>
          <p><b>Native Name:</b> <span>${option.nativeName}</span></p>
          <p><b>Population:</b> <span>${option.population}</span></p>
          <p><b>Region:</b> <span>${option.region}</span></p>
          <p><b>Sub Region:</b> <span>${option.subregion}</span></p>
          <p><b>Capital:</b> <span>${option.capital}</span></p>
        </div>
        <div>
          <p><b>Top Level Domain:</b> <span>${option.topLevelDomain.join(
            ", "
          )}</span></p>
          <p><b>Currencies:</b> <span>${option.languages
            .map((lang) => lang.name)
            .join(", ")}</span></p>
          <p><b>Language:</b> <span>${option.currencies
            .map((currency) => currency.code)
            .join(", ")}</span></p>
        </div>
      </div>
      <div class="border-group">
      <h5>Border Countries</h5>
      <div class="border">
      ${
        option?.borders
          ? option?.borders.map(
              (border) => `<div class="border-item">${border}</div>`
            )
          : ""
      }
      </div>
      </div>
    </article>
  </div>
`;

  countryDetail.innerHTML += countryCard;
}
