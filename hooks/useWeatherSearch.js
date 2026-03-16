import { useState } from "react";
import { Alert } from "react-native";

import { fetchWeatherByCity } from "../services/weatherService";

export default function useWeatherSearch() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);

    const search = async (city) => {
        if (!city?.trim()) {
            Alert.alert("Input Error", "Please enter a city name.");
            return null;
        }

        try {
            setLoading(true);

            const data = await fetchWeatherByCity(city);

            if (Number(data.cod) !== 200) {
                Alert.alert("City not found", "Please try another city");
                setWeather(null);
                return null;
            }

            setWeather(data);
            return data;
        } catch (error) {
            Alert.alert("Network Error", "Something went wrong");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { weather, loading, search, setWeather };
}
