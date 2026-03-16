import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { fetchForecast } from "../services/weatherService";

const formatHour = (unix) => {
    const date = new Date(unix * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function Forecast24h({
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

    if (!forecast || !forecast.hourly) {
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
                    Unable to load 24-hour forecast.
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

    const entries = forecast.hourly.slice(0, 24);

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text
                style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12 }}
            >
                24h Forecast — {city}
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
                        <Text>{formatHour(item.dt)}</Text>
                        <Text>{Math.round(item.temp)}°C</Text>
                        <Text style={{ fontStyle: "italic" }}>
                            {item.weather[0].description}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}
