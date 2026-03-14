const API_KEY = "5113d67fadd0ac2527e1aa642108a802";

export const fetchWeather  = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    const response = await fetch(url);

    return response.json();
}