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

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchForecast(lat, lon);
                setForecast(data);
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

    if (!forecast || !forecast.daily) {
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

    const entries = forecast.daily.slice(0, 7);

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
                                {item.weather[0].description}
                            </Text>
                        </View>

                        <View style={{ alignItems: "flex-end" }}>
                            <Text>
                                {Math.round(item.temp.max)}° /{" "}
                                {Math.round(item.temp.min)}°
                            </Text>
                            <Text>Humidity {item.humidity}%</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}
