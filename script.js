document.addEventListener("DOMContentLoaded", () => {
    const countries = ["France", "Germany", "Italy", "Spain", "United Kingdom", /* more European countries */];

    // Initialize data based on date range if not already set
    let globalData = JSON.parse(localStorage.getItem("globalData"));
    if (!globalData || isNewDataNeeded()) {
        globalData = initializeDataForDate();
        localStorage.setItem("globalData", JSON.stringify(globalData));
    }

    // Display global data
    updateGlobalData(globalData);

    // Populate country dropdown
    const countrySelect = document.getElementById("country-select");
    countries.forEach(country => {
        let option = document.createElement("option");
        option.value = country;
        option.text = country;
        countrySelect.appendChild(option);
    });

    // Set user location data
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const country = await getCountryByCoordinates(position.coords.latitude, position.coords.longitude);
            document.getElementById("user-country").textContent = country;
            const localData = generateDataForCountry(globalData);
            updateLocalData(localData);
        });
    }

    // Update selected country data
    countrySelect.addEventListener("change", () => {
        const countryData = generateDataForCountry(globalData);
        updateCountryData(countryData);
    });
});

// Check if data update is required based on the date range
function isNewDataNeeded() {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), 10, 1); // 1st Nov
    const endDate = new Date(today.getFullYear(), 10, 28);  // 28th Nov
    return today < startDate || today > endDate;
}

// Generate data based on the date range
function initializeDataForDate() {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), 10, 1); // 1st Nov
    const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const infections = Math.floor((90287 / 28) * daysElapsed); // Linearly scale infections

    return {
        infections,
        rRate: calculateRRate(infections),
        deaths: calculateDeaths(infections),
        recoveries: calculateRecoveries(infections)
    };
}

function calculateRRate(infections) {
    return (1 + infections / 100000).toFixed(2); // Example formula
}

function calculateDeaths(infections) {
    return Math.floor(infections * 0.02); // Assume 2% mortality rate
}

function calculateRecoveries(infections) {
    return Math.floor(infections * 0.75); // Assume 75% recovery rate
}

function generateDataForCountry(globalData) {
    return {
        infections: Math.floor(globalData.infections * Math.random()),
        rRate: (globalData.rRate * Math.random()).toFixed(2),
        deaths: Math.floor(globalData.deaths * Math.random()),
        recoveries: Math.floor(globalData.recoveries * Math.random())
    };
}

// Update functions
function updateGlobalData(data) {
    document.getElementById("global-infections").textContent = data.infections;
    document.getElementById("global-r-rate").textContent = data.rRate;
    document.getElementById("global-deaths").textContent = data.deaths;
    document.getElementById("global-recoveries").textContent = data.recoveries;
}

function updateLocalData(data) {
    document.getElementById("local-infections").textContent = data.infections;
    document.getElementById("local-r-rate").textContent = data.rRate;
    document.getElementById("local-deaths").textContent = data.deaths;
    document.getElementById("local-recoveries").textContent = data.recoveries;
}

function updateCountryData(data) {
    document.getElementById("country-infections").textContent = data.infections;
    document.getElementById("country-r-rate").textContent = data.rRate;
    document.getElementById("country-deaths").textContent = data.deaths;
    document.getElementById("country-recoveries").textContent = data.recoveries;
}

async function getCountryByCoordinates(lat, lon) {
    // Simplified for example - use a geolocation API if needed
    return "United Kingdom";  // Placeholder
}
