import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View, Image } from "react-native";

import { fetchForecast } from "../services/weatherService";

const formatDay = (unix) => {
    const date = new Date(unix * 1000);
    return date.toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
};

const getWeatherIcon = (iconCode) => `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

// Helper to group forecast data by day
const groupForecastByDay = (list) => {
    const dailyData = {};

    list.forEach((item) => {
        const date = new Date(item.dt * 1000);
        const dayKey = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000;

        if (!dailyData[dayKey]) {
            dailyData[dayKey] = {
                dt: dayKey,
                temps: [],
                humidities: [],
                icons: [],
                descriptions: [],
            };
        }
        dailyData[dayKey].temps.push(item.main.temp_max, item.main.temp_min);
        dailyData[dayKey].humidities.push(item.main.humidity);
        dailyData[dayKey].icons.push(item.weather[0].icon);
        dailyData[dayKey].descriptions.push(item.weather[0].main);
    });

    const processedDailyData = Object.values(dailyData).map((day) => {
        const maxTemp = Math.max(...day.temps);
        const minTemp = Math.min(...day.temps);
        const avgHumidity = day.humidities.reduce((sum, h) => sum + h, 0) / day.humidities.length;

        // Most frequent icon/main
        const freq = (arr) => arr.reduce((a, b, i, arr) => (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b), null);
        
        return {
            dt: day.dt,
            icon: freq(day.icons),
            main: freq(day.descriptions),
            temp_max: maxTemp,
            temp_min: minTemp,
            humidity: avgHumidity,
        };
    });

    processedDailyData.sort((a, b) => a.dt - b.dt);
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

    const [loading, setLoading] = useState(true);
    const [dailyForecasts, setDailyForecasts] = useState([]);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchForecast(lat, lon);
                if (data && data.list) {
                    setDailyForecasts(groupForecastByDay(data.list));
                }
            } catch (error) {
                console.error("Forecast7d error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (lat && lon) {
            load();
        }
    }, [lat, lon]);

    if (loading) {
        return null; // Let 24h loading show something if needed, or index handles it
    }

    if (!dailyForecasts.length) return null;

    return (
        <View style={{ width: '100%', paddingVertical: 20 }}>
            <View style={{ paddingHorizontal: 20, marginBottom: 15 }}>
                <Text style={{ fontSize: 18, fontWeight: "bold", color: '#fff' }}>
                    7-Day Forecast
                </Text>
            </View>
            <View style={{ 
                marginHorizontal: 20,
                backgroundColor: 'rgba(255,255,255,0.12)', 
                borderRadius: 28, 
                padding: 10,
                borderWidth: 1, 
                borderColor: 'rgba(255,255,255,0.1)',
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
            }}>
                {dailyForecasts.map((item, index) => (
                    <View
                        key={String(item.dt)}
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingVertical: 14,
                            paddingHorizontal: 12,
                            borderBottomWidth: index === dailyForecasts.length - 1 ? 0 : 1,
                            borderBottomColor: 'rgba(255,255,255,0.05)',
                        }}
                    >
                        <View style={{ flex: 1.2 }}>
                            <Text style={{ fontWeight: "600", color: '#fff', fontSize: 14 }}>
                                {index === 0 ? "Today" : formatDay(item.dt)}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1.5, justifyContent: 'flex-start' }}>
                            <Image 
                                source={{ uri: getWeatherIcon(item.icon) }} 
                                style={{ width: 38, height: 38 }}
                            />
                            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginLeft: 8 }}>
                                {item.main}
                            </Text>
                        </View>

                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>
                                {Math.round(item.temp_max)}°{"  "}
                                <Text style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 'normal' }}>
                                    {Math.round(item.temp_min)}°
                                </Text>
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}
