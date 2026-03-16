import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { fetchWeatherByCity } from "../services/weatherService";

export default function WeatherDetail() {
    const { city } = useLocalSearchParams();
    const router = useRouter();

    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                if (!city) return;
                const data = await fetchWeatherByCity(city);
                setWeather(data);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [city]);

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!weather || weather.cod !== 200) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                }}
            >
                <Text style={{ fontSize: 18, marginBottom: 10 }}>
                    Unable to load weather for {city}.
                </Text>
                <Text
                    style={{
                        color: "blue",
                        textDecorationLine: "underline",
                    }}
                    onPress={() => router.back()}
                >
                    Go back
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 20,
            }}
        >
            <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 8 }}>
                {weather.name}
            </Text>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>
                {weather.weather[0].description}
            </Text>

            <View style={{ width: "100%", marginBottom: 18 }}>
                <Text style={{ fontWeight: "bold" }}>Temperature:</Text>
                <Text>{Math.round(weather.main.temp)}°C</Text>
            </View>

            <View style={{ width: "100%", marginBottom: 18 }}>
                <Text style={{ fontWeight: "bold" }}>Feels like:</Text>
                <Text>{Math.round(weather.main.feels_like)}°C</Text>
            </View>

            <View style={{ width: "100%", marginBottom: 18 }}>
                <Text style={{ fontWeight: "bold" }}>Humidity:</Text>
                <Text>{weather.main.humidity}%</Text>
            </View>

            <View style={{ width: "100%", marginBottom: 18 }}>
                <Text style={{ fontWeight: "bold" }}>Wind speed:</Text>
                <Text>{weather.wind.speed} m/s</Text>
            </View>

            <View
                style={{
                    width: "100%",
                    marginTop: 24,
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <Text
                    style={{
                        color: "blue",
                        textDecorationLine: "underline",
                    }}
                    onPress={() =>
                        router.push({
                            pathname: "/Forecast24h",
                            params: {
                                lat: weather.coord.lat,
                                lon: weather.coord.lon,
                                city: weather.name,
                            },
                        })
                    }
                >
                    24h Forecast
                </Text>

                <Text
                    style={{
                        color: "blue",
                        textDecorationLine: "underline",
                    }}
                    onPress={() =>
                        router.push({
                            pathname: "/Forecast7d",
                            params: {
                                lat: weather.coord.lat,
                                lon: weather.coord.lon,
                                city: weather.name,
                            },
                        })
                    }
                >
                    7-day Forecast
                </Text>
            </View>

            <Text
                style={{
                    marginTop: 24,
                    color: "blue",
                    textDecorationLine: "underline",
                }}
                onPress={() => router.back()}
            >
                Back
            </Text>
        </ScrollView>
    );
}
