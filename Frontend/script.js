const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const message = document.getElementById("message");
const weatherCard = document.getElementById("weather-card");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        showMessage("Please enter a city name.");
        return;
    }

    await getWeather(city);
});


async function getWeather(city) {
    const button = form.querySelector("button");

    button.disabled = true;
    button.textContent = "Searching...";
    weatherCard.hidden = true;
    message.textContent = "Loading weather...";
    message.style.color = "#555";

    try {
        const url =
            `http://localhost:3000/api/weather?city=${encodeURIComponent(city)}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Unable to get weather information."
            );
        }

        document.getElementById("city-name").textContent =
            `${data.name}, ${data.sys.country}`;

        document.getElementById("temperature").textContent =
            Math.round(data.main.temp);

        document.getElementById("weather-description").textContent =
            data.weather[0].description;

        document.getElementById("humidity").textContent =
            `${data.main.humidity}%`;

        document.getElementById("wind-speed").textContent =
            `${data.wind.speed} m/s`;

        const icon = document.getElementById("weather-icon");

        icon.src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        icon.alt = data.weather[0].description;

        message.textContent = "";
        weatherCard.hidden = false;

    } catch (error) {
        showMessage(
            error.message === "Failed to fetch"
                ? "Cannot connect to the backend. Make sure your server is running."
                : error.message
        );
    } finally {
        button.disabled = false;
        button.textContent = "Search";
    }
}

function showMessage(text) {
    message.style.color = "#b42318";
    message.textContent = text;
}
