const API_KEY = "5113d67fadd0ac2527e1aa642108a802";

export const geocodeCity = async (city) => {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        city,
    )}&limit=1&appid=${API_KEY}`;

    const response = await fetch(url);
    const results = await response.json();

    if (!results || !results.length) {
        return null;
    }

    const { lat, lon, name, country, state } = results[0];
    return { lat, lon, name, country, state };
};

export const fetchWeatherByCoords = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    return response.json();
};

export const fetchWeatherByCity = async (city) => {
    const geo = await geocodeCity(city);
    if (!geo) {
        return { cod: 404, message: "city not found" };
    }

    const data = await fetchWeatherByCoords(geo.lat, geo.lon);
    return { ...data, location: geo };
};

export const fetchForecast = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${API_KEY}`;

    const response = await fetch(url);

    return response.json();
};
