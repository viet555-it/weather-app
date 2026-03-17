import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { fetchForecast } from "../services/weatherService";

const formatDay = (unix) => {
    const date = new Date(unix * 1000);
    return date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
};

// Helper to group forecast data by day
const groupForecastByDay = (list) => {
    const dailyData = {};

    list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        // Get the start of the day in UTC to group consistently
        const dayKey = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000;

        if (!dailyData[dayKey]) {
            dailyData[dayKey] = {
                dt: dayKey,
                temps: [],
                humidities: [],
                descriptions: [],
            };
        }
        dailyData[dayKey].temps.push(item.main.temp_max, item.main.temp_min);
        dailyData[dayKey].humidities.push(item.main.humidity);
        dailyData[dayKey].descriptions.push(item.weather[0].description);
    });

    const processedDailyData = Object.values(dailyData).map((day) => {
        const maxTemp = Math.max(...day.temps);
        const minTemp = Math.min(...day.temps);
        const avgHumidity = day.humidities.reduce((sum, h) => sum + h, 0) / day.humidities.length;

        // Simple way to get a representative description: pick the most frequent or the first one
        const descriptionCounts = {};
        day.descriptions.forEach(desc => {
            descriptionCounts[desc] = (descriptionCounts[desc] || 0) + 1;
        });
        const representativeDescription = Object.keys(descriptionCounts).sort((a, b) => descriptionCounts[b] - descriptionCounts[a])[0];

        return {
            dt: day.dt,
            description: representativeDescription,
            temp_max: maxTemp,
            temp_min: minTemp,
            humidity: avgHumidity,
        };
    });

    // Sort by date to ensure correct order
    processedDailyData.sort((a, b) => a.dt - b.dt);

    // Take up to 7 days, excluding the current partial day if it's the first entry
    // and we want full days. For simplicity, we'll just take the first 7 unique days.
    return processedDailyData.slice(0, 7);
};


export default function Forecast7d({
    lat: propLat,
    lon: propLon,
    city: propCity,
}) {
    const params = useLocalSearchParams();
    const router = useRouter();

    const lat = propLat ?? Number(params.lat);
    const lon = propLon ?? Number(params.lon);
    const city = propCity ?? params.city;

    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dailyForecasts, setDailyForecasts] = useState([]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchForecast(lat, lon);
                setForecast(data);
                if (data && data.list) {
                    setDailyForecasts(groupForecastByDay(data.list));
                }
            } finally {
                setLoading(false);
            }
        };

        if (lat && lon) {
            load();
        }
    }, [lat, lon]);

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

    if (!forecast || !dailyForecasts.length) {
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
                    Unable to load 7-day forecast.
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

    const entries = dailyForecasts;

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text
                style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}
            >
                7-Day Forecast — {city}
            </Text>
            <FlatList
                data={entries}
                keyExtractor={(item) => String(item.dt)}
                renderItem={({ item }) => (
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: 10,
                            borderBottomWidth: 1,
                            borderBottomColor: "#eee",
                        }}
                    >
                        <View>
                            <Text style={{ fontWeight: "bold" }}>
                                {formatDay(item.dt)}
                            </Text>
                            <Text style={{ fontStyle: "italic" }}>
                                {item.description}
                            </Text>
                        </View>

                        <View style={{ alignItems: "flex-end" }}>
                            <Text>
                                {Math.round(item.temp_max)}° /{" "}
                                {Math.round(item.temp_min)}°
                            </Text>
                            <Text>Humidity {Math.round(item.humidity)}%</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}
