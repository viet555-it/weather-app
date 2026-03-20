import { useState } from "react";
import { Alert, Platform } from "react-native";

import { fetchWeatherByCity } from "../services/weatherService";

const showAlert = (title, message) => {
    if (Platform.OS === "web") {
        alert(`${title}: ${message}`);
    } else {
        Alert.alert(title, message);
    }
};

export default function useWeatherSearch() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);

    const search = async (city) => {
        if (!city?.trim()) {
            showAlert("Input Error", "Please enter a city name.");
            return null;
        }

        try {
            setLoading(true);

            const data = await fetchWeatherByCity(city);

            if (data?.cod && Number(data.cod) !== 200) {
                showAlert("City not found", "Please try another city");
                setWeather(null);
                return null;
            }

            setWeather(data);
            return data;
        } catch (error) {
            showAlert("Network Error", "Something went wrong");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { weather, loading, search, setWeather };
}
