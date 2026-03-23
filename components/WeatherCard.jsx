import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";
import { useUnit } from "../context/UnitContext";

const getWeatherIcon = (iconCode) =>
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

const getCurrentLocalTime = (timezone) => {
    // Current user's time moved to UTC then shifted by city's timezone
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const localTime = new Date(utcTime + timezone * 1000);
    
    return localTime.toLocaleTimeString([], { 
        hour: "2-digit", 
        minute: "2-digit",
        hour12: false 
    });
};

export default function WeatherCard({ weather, onPress }) {
    const { formatTemp, unit } = useUnit();
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            onPress={onPress}
            style={{ marginTop: 20, alignItems: "center" }}
            activeOpacity={0.8}
        >
            <Text style={{ fontSize: 24, fontWeight: "bold", color: "#fff" }}>
                {weather.location?.name || weather.name}
            </Text>

            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 16, marginTop: 4 }}>
                Local Time: {getCurrentLocalTime(weather.timezone)}
            </Text>

            <Image
                source={{ uri: getWeatherIcon(weather.weather[0].icon) }}
                style={{ width: 100, height: 100 }}
                contentFit="contain"
            />

            <Text
                style={{
                    fontSize: 60,
                    fontWeight: "bold",
                    color: "#fff",
                    marginVertical: 10,
                }}
            >
                {formatTemp(weather.main.temp)}°{unit}
            </Text>

            <Text style={{ fontSize: 18, fontStyle: "italic", color: "#fff", textTransform: "capitalize" }}>
                {weather.weather[0].description}
            </Text>
        </Container>
    );
}
