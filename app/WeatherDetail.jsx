import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUnit } from "../context/UnitContext";

import { fetchWeatherByCity } from "../services/weatherService";
import Loading from "../components/Loading";
import BackgroundImage from "../components/BackgroundImage";

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
            <BackgroundImage weather={null}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Loading />
                </View>
            </BackgroundImage>
        );
    }

    if (!weather || Number(weather.cod) !== 200) {
        return (
            <BackgroundImage weather={null}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 20,
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
            </BackgroundImage>
        );
    }

    return (
        <BackgroundImage weather={weather}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        alignItems: "center",
                        padding: 20,
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

                    <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 8, color: '#fff', textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
                        {weather.location?.name || weather.name}
                    </Text>
                    <Text style={{ fontSize: 18, marginBottom: 30, color: 'rgba(255,255,255,0.9)', textTransform: 'capitalize', fontWeight: '500' }}>
                        {weather.weather[0].description}
                    </Text>

                    <View style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 24, padding: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
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
                                        city: weather.location?.name || weather.name,
                                        weatherData: JSON.stringify(weather)
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
                                        city: weather.location?.name || weather.name,
                                        weatherData: JSON.stringify(weather)
                                    },
                                })
                            }
                        >

                            <Ionicons name="calendar-outline" size={20} color="#fff" />
                            <Text style={styles.navButtonText}>7-day Forecast</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </BackgroundImage>
    );
}

function DetailRow({ label, value, icon }) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={icon} size={22} color="rgba(255,255,255,0.8)" style={{ marginRight: 12 }} />
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: '500' }}>{label}</Text>
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
