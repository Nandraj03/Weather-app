
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: [
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
}));

app.get("/api/weather", async (req, res) => {
    const city = req.query.city?.trim();

    if (!city) {
        return res.status(400).json({
            message: "Please provide a city name."
        });
    }

    if (city.length > 100) {
        return res.status(400).json({
            message: "City name is too long."
        });
    }

    if (!process.env.OPENWEATHER_API_KEY) {
        return res.status(500).json({
            message: "Weather service is not configured."
        });
    }

    try {
        const url = new URL(
            "https://api.openweathermap.org/data/2.5/weather"
        );

        url.searchParams.set("q", city);
        url.searchParams.set("appid", process.env.OPENWEATHER_API_KEY);
        url.searchParams.set("units", "metric");

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            if (response.status === 404) {
                return res.status(404).json({
                    message: "City not found. Check the spelling."
                });
            }

            if (response.status === 401) {
                console.error("OpenWeather rejected the API key.");

                return res.status(502).json({
                    message: "Weather service authentication failed."
                });
            }

            return res.status(502).json({
                message: "Unable to retrieve weather right now."
            });
        }

        res.json(data);
    } catch (error) {
        console.error("Weather request failed:", error.message);

        res.status(502).json({
            message: "Weather service is temporarily unavailable."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Weather backend running on port ${PORT}`);
});
