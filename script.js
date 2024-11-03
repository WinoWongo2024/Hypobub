document.addEventListener("DOMContentLoaded", () => {
    const countries = ["France", "Germany", "Italy", "Spain", "United Kingdom"];
    const countryFactors = initializeCountryFactors(countries);

    // Initialize or load data for the current date
    const today = getTodayDateString();
    let globalData = JSON.parse(localStorage.getItem("globalData"));
    const lastUpdate = localStorage.getItem("lastUpdate");

    if (!globalData || lastUpdate !== today) {
        globalData = generateDailyData();
        localStorage.setItem("globalData", JSON.stringify(globalData));
        localStorage.setItem("lastUpdate", today);
    }

    // Display data
    updateGlobalData(globalData);
    populateCountryDropdown(countries);
    setUserLocationData(globalData, countryFactors);
});

// Utility Functions
function getTodayDateString() {
    return new Date().toISOString().split('T')[0];
}

// Initialize country-specific variability factors
function initializeCountryFactors(countries) {
    const factors = {};
    countries.forEach(country => {
        factors[country] = {
            infectionRate: 0.8 + Math.random() * 0.4,  // 80%-120% of global rate
            deathRate: 0.9 + Math.random() * 0.2,      // 90%-110% of global rate
            recoveryRate: 0.7 + Math.random() * 0.3    // 70%-100% of global rate
        };
    });
    return factors;
}

// Generate daily data with advanced growth model
function generateDailyData() {
    const startDate = new Date(new Date().getFullYear(), 10, 1); // 1st November
    const daysElapsed = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24));
    
    let infections = 1000;  // Initial base value
    let deaths = 0;
    let recoveries = 0;

    for (let i = 0; i < daysElapsed; i++) {
        const infectionGrowthRate = generateGrowthRate(0.0001, 1, 0.12);
        const deathGrowthRate = generateGrowthRate(0, 0.0002, 0.0001);

        infections += Math.floor(infections * infectionGrowthRate);
        deaths += Math.floor(infections * deathGrowthRate);
        recoveries = Math.floor(infections * 0.75); // 75% assumed recovery rate
    }

    const rRate = calculateRRate(infections);

    return { infections, rRate, deaths, recoveries };
}

// Generate a random growth rate with min, max, and target average
function generateGrowthRate(min, max, avg) {
    const randomnessFactor = Math.random() * (max - min) + min;
    return randomnessFactor * (0.8 + Math.random() * 0.4);  // Adjust around avg
}

// Calculate R rate based on infections
function calculateRRate(infections) {
    return (1 + infections / 100000).toFixed(2);
}

// Populate country dropdown in the UI
function populateCountryDropdown(countries) {
    const countrySelect = document.getElementById("country-select");
    countries.forEach(country => {
        let option = document.createElement("option");
        option.value = country;
        option.text = country;
        countrySelect.appendChild(option);
    });

    countrySelect.addEventListener("change", (e) => {
        const countryData = generateDataForCountry(e.target.value);
        updateCountryData(countryData);
    });
}

// Set user location data
function setUserLocationData(globalData, countryFactors) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const country = await getCountryByCoordinates(position.coords.latitude, position.coords.longitude);
            document.getElementById("user-country").textContent = country;
            const localData = generateDataForCountry(country, countryFactors[country]);
            updateLocalData(localData);
        }, handleGeolocationError);
    } else {
        handleGeolocationError();
    }
}

// Generate data for a specific country with variability factors
function generateDataForCountry(country, factors) {
    const globalData = JSON.parse(localStorage.getItem("globalData"));
    return {
        infections: Math.floor(globalData.infections * factors.infectionRate),
        rRate: (globalData.rRate * factors.infectionRate).toFixed(2),
        deaths: Math.floor(globalData.deaths * factors.deathRate),
        recoveries: Math.floor(globalData.recoveries * factors.recoveryRate)
    };
}

// Update UI functions with smooth transitions
function updateGlobalData(data) {
    smoothUpdate("global-infections", data.infections);
    smoothUpdate("global-r-rate", data.rRate);
    smoothUpdate("global-deaths", data.deaths);
    smoothUpdate("global-recoveries", data.recoveries);
}

function updateLocalData(data) {
    smoothUpdate("local-infections", data.infections);
    smoothUpdate("local-r-rate", data.rRate);
    smoothUpdate("local-deaths", data.deaths);
    smoothUpdate("local-recoveries", data.recoveries);
}

function updateCountryData(data) {
    smoothUpdate("country-infections", data.infections);
    smoothUpdate("country-r-rate", data.rRate);
    smoothUpdate("country-deaths", data.deaths);
    smoothUpdate("country-recoveries", data.recoveries);
}

// Smoothly animate data updates
function smoothUpdate(elementId, newValue) {
    const element = document.getElementById(elementId);
    let currentValue = parseInt(element.textContent) || 0;
    const step = (newValue - currentValue) / 50;

    let count = 0;
    const interval = setInterval(() => {
        currentValue += step;
        element.textContent = Math.round(currentValue);
        if (++count >= 50) clearInterval(interval);
    }, 20);
}

// Handle geolocation errors gracefully
function handleGeolocationError() {
    document.getElementById("user-country").textContent = "Location unavailable";
    updateLocalData({
        infections: "N/A",
        rRate: "N/A",
        deaths: "N/A",
        recoveries: "N/A"
    });
}

// Placeholder function for geolocation API
async function getCountryByCoordinates(lat, lon) {
    return "United Kingdom";  // For demo, replace with actual API
}
