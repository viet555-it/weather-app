import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Loading from "./Loading";
import { fetchForecast } from "../services/weatherService";
import { useUnit } from "../context/UnitContext";

const formatHour = (unix, timezone = 0) => {
    const date = new Date((unix + timezone) * 1000);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
};

const formatDay = (unix, timezone = 0) => {
    const date = new Date((unix + timezone) * 1000);
    const nowLocal = new Date((Math.floor(Date.now() / 1000) + timezone) * 1000);
    
    if (date.getUTCDate() === nowLocal.getUTCDate() && 
        date.getUTCMonth() === nowLocal.getUTCMonth()) {
        return "Today";
    }
    
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getUTCDay()];
};

const getWeatherIcon = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

export default function Forecast24hWidget({ lat, lon, city }) {
    const { formatTemp, unit, toggleUnit } = useUnit();
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchForecast(lat, lon);
                if (data && data.list) {
                    const now = Math.floor(Date.now() / 1000);
                    const filtered = data.list.filter(item => item.dt >= now - 3600 && item.dt <= now + 24 * 3600);
                    setForecast({ ...data, list: filtered.length > 0 ? filtered : data.list.slice(0, 8) });
                } else {
                    setForecast(data);
                }
            } catch (error) {
                console.error("Forecast24h error:", error);
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
            <View style={{ height: 160, justifyContent: "center", alignItems: "center" }}>
                <Loading />
            </View>
        );
    }

    if (!forecast || !forecast.list || forecast.list.length === 0) {
        return null;
    }

    return (
        <View style={{ width: '100%', paddingVertical: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 15 }}>
                <View>
                    <Text style={{ fontSize: 18, fontWeight: "bold", color: '#fff' }}>
                        Next 24 Hours
                    </Text>
                    <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                        {city}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={toggleUnit}
                    style={{
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 15,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}
                >
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>
                        °{unit}
                    </Text>
                    <Ionicons name="swap-horizontal" size={14} color="#fff" style={{ marginLeft: 5 }} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={forecast.list}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => String(item.dt)}
                contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
                renderItem={({ item }) => (
                    <View
                        style={{
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.12)',
                            borderRadius: 22,
                            padding: 16,
                            marginRight: 12,
                            minWidth: 90,
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.1)',
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 13, fontWeight: 'bold' }}>
                            {formatHour(item.dt, forecast.city.timezone)}
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, marginBottom: 2 }}>
                            {formatDay(item.dt, forecast.city.timezone)}
                        </Text>
                        <Image
                            source={{ uri: getWeatherIcon(item.weather[0].icon) }}
                            style={{ width: 42, height: 42, marginVertical: 4 }}
                            contentFit="contain"
                        />
                        <Text style={{ color: '#fff', fontSize: 19, fontWeight: 'bold' }}>
                            {formatTemp(item.main.temp)}°
                        </Text>
                        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10, marginTop: 4, textTransform: 'capitalize' }}>
                            {item.weather[0].main}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}
