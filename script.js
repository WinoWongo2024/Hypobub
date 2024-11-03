document.addEventListener("DOMContentLoaded", () => {
    const countries = ["France", "Germany", "Italy", "Spain", "United Kingdom", /* more European countries */];
    const globalData = generateRandomData();
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
            const localData = generateRandomData();
            updateLocalData(localData);
        });
    }

    // Update selected country data
    countrySelect.addEventListener("change", () => {
        const countryData = generateRandomData();
        updateCountryData(countryData);
    });
});

function generateRandomData() {
    return {
        infections: Math.floor(Math.random() * 1000000),
        rRate: (Math.random() * 3).toFixed(2),
        deaths: Math.floor(Math.random() * 50000),
        recoveries: Math.floor(Math.random() * 500000)
    };
}

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
