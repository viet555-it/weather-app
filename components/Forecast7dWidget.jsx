import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { useUnit } from "../context/UnitContext";
import { fetchForecast } from "../services/weatherService";

const formatDay = (unix, timezone = 0) => {
    const date = new Date((unix + timezone) * 1000);
    const day = date.getUTCDate();
    const month = date.getUTCMonth();
    // Using a simple array for month/day formatting to avoid system local interference
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    return `${weekdays[date.getUTCDay()]}, ${months[month]} ${day}`;
};

const getWeatherIcon = (iconCode) =>
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

// Helper to group forecast data by day
const groupForecastByDay = (list, timezone = 0) => {
    const dailyData = {};

    list.forEach((item) => {
        // Adjust for timezone then find the start of the day in UTC
        const date = new Date((item.dt + timezone) * 1000);
        const dayKey = date.getUTCFullYear() + "-" + (date.getUTCMonth() + 1) + "-" + date.getUTCDate();

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
        const avgHumidity =
            day.humidities.reduce((sum, h) => sum + h, 0) /
            day.humidities.length;

        // Most frequent icon/main, preferring day icons
        const freq = (arr) => {
            // Separate day and night icons
            const dayIcons = arr.filter((icon) => icon.endsWith("d"));
            const nightIcons = arr.filter((icon) => icon.endsWith("n"));
            const otherIcons = arr.filter(
                (icon) => !icon.endsWith("d") && !icon.endsWith("n"),
            );

            // Prefer day icons if available
            const targetArr =
                dayIcons.length > 0
                    ? dayIcons
                    : nightIcons.length > 0
                      ? nightIcons
                      : otherIcons;

            return targetArr.reduce(
                (a, b, i, arr) =>
                    arr.filter((v) => v === a).length >=
                    arr.filter((v) => v === b).length
                        ? a
                        : b,
                null,
            );
        };

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

export default function Forecast7dWidget({ lat, lon, city }) {
    const { formatTemp, unit, toggleUnit } = useUnit();
    const [loading, setLoading] = useState(true);
    const [dailyForecasts, setDailyForecasts] = useState([]);
    const [timezone, setTimezone] = useState(0);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await fetchForecast(lat, lon);
                if (data && data.list) {
                    const tz = data.city?.timezone || 0;
                    setTimezone(tz);
                    setDailyForecasts(groupForecastByDay(data.list, tz));
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

    if (loading || !dailyForecasts.length) {
        return null;
    }

    return (
        <View style={{ width: "100%", paddingVertical: 20 }}>
            <View
                style={{
                    flexDirection: "row",
                    paddingHorizontal: 20,
                    marginBottom: 15,
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <View>
                    <Text
                        style={{
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "#fff",
                        }}
                    >
                        7-Day Forecast
                    </Text>
                    <Text
                        style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}
                    >
                        {city}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={toggleUnit}
                    style={{
                        backgroundColor: "rgba(255,255,255,0.2)",
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: 15,
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 14,
                            fontWeight: "bold",
                        }}
                    >
                        °{unit}
                    </Text>
                    <Ionicons
                        name="swap-horizontal"
                        size={14}
                        color="#fff"
                        style={{ marginLeft: 5 }}
                    />
                </TouchableOpacity>
            </View>
            <View
                style={{
                    marginHorizontal: 20,
                    backgroundColor: "rgba(255,255,255,0.12)",
                    borderRadius: 28,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.1)",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                }}
            >
                {dailyForecasts.map((item, index) => (
                    <View
                        key={String(item.dt)}
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingVertical: 14,
                            paddingHorizontal: 12,
                            borderBottomWidth:
                                index === dailyForecasts.length - 1 ? 0 : 1,
                            borderBottomColor: "rgba(255,255,255,0.05)",
                        }}
                    >
                        <View style={{ flex: 1.2 }}>
                            <Text
                                style={{
                                    fontWeight: "600",
                                    color: "#fff",
                                    fontSize: 14,
                                }}
                            >
                                {index === 0 ? "Today" : formatDay(item.dt, timezone)}
                            </Text>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                flex: 1.5,
                                justifyContent: "flex-start",
                            }}
                        >
                            <Image
                                source={{ uri: getWeatherIcon(item.icon) }}
                                style={{ width: 38, height: 38 }}
                                contentFit="contain"
                            />
                            <Text
                                style={{
                                    color: "rgba(255,255,255,0.8)",
                                    fontSize: 13,
                                    marginLeft: 8,
                                }}
                            >
                                {item.main}
                            </Text>
                        </View>

                        <View style={{ flex: 1, alignItems: "flex-end" }}>
                            <Text
                                style={{
                                    color: "#fff",
                                    fontWeight: "bold",
                                    fontSize: 15,
                                }}
                            >
                                {formatTemp(item.temp_max)}°{"  "}
                                <Text
                                    style={{
                                        color: "rgba(255,255,255,0.4)",
                                        fontWeight: "normal",
                                    }}
                                >
                                    {formatTemp(item.temp_min)}°
                                </Text>
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}
