import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUnit } from "../context/UnitContext";

import { fetchWeatherByCity } from "../services/weatherService";
import Loading from "../components/Loading";

export default function WeatherDetail() {
    const { formatTemp, unit, toggleUnit } = useUnit();
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
                    backgroundColor: '#1e293b'
                }}
            >
                <Loading />
            </View>
        );
    }

    if (!weather || Number(weather.cod) !== 200) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 20,
                    backgroundColor: '#1e293b'
                }}
            >
                <Text style={{ fontSize: 18, marginBottom: 10, color: '#fff' }}>
                    Unable to load weather for {city}.
                </Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ color: "#38bdf8", textDecorationLine: "underline" }}>
                        Go back
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                alignItems: "center",
                padding: 20,
                backgroundColor: '#1e293b'
            }}
        >
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>Details</Text>
                <TouchableOpacity 
                    onPress={toggleUnit}
                    style={{ 
                        backgroundColor: 'rgba(255,255,255,0.1)', 
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
                </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 8, color: '#fff' }}>
                {weather.name}
            </Text>
            <Text style={{ fontSize: 18, marginBottom: 30, color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>
                {weather.weather[0].description}
            </Text>

            <View style={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, padding: 20 }}>
                <DetailRow label="Temperature" value={`${formatTemp(weather.main.temp)}°${unit}`} icon="thermometer-outline" />
                <DetailRow label="Feels like" value={`${formatTemp(weather.main.feels_like)}°${unit}`} icon="hand-right-outline" />
                <DetailRow label="Humidity" value={`${weather.main.humidity}%`} icon="water-outline" />
                <DetailRow label="Wind speed" value={`${weather.wind.speed} m/s`} icon="speedometer-outline" />
                <DetailRow label="Pressure" value={`${weather.main.pressure} hPa`} icon="layers-outline" />
            </View>

            <View
                style={{
                    width: "100%",
                    marginTop: 30,
                    flexDirection: "row",
                    justifyContent: "space-around",
                }}
            >
                <TouchableOpacity
                    style={styles.navButton}
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
                    <Ionicons name="time-outline" size={20} color="#fff" />
                    <Text style={styles.navButtonText}>24h Forecast</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.navButton}
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
                    <Ionicons name="calendar-outline" size={20} color="#fff" />
                    <Text style={styles.navButtonText}>7-day Forecast</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

function DetailRow({ label, value, icon }) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={icon} size={20} color="rgba(255,255,255,0.6)" style={{ marginRight: 10 }} />
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16 }}>{label}</Text>
            </View>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{value}</Text>
        </View>
    );
}

const styles = {
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#38bdf8',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
    },
    navButtonText: {
        color: '#fff',
        marginLeft: 8,
        fontWeight: 'bold'
    }
};
