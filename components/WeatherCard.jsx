import { Text, TouchableOpacity, View } from "react-native";
import { useUnit } from "../context/UnitContext";

export default function WeatherCard({ weather, onPress }) {
    const { formatTemp, unit } = useUnit();
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            onPress={onPress}
            style={{ marginTop: 20, alignItems: "center" }}
            activeOpacity={0.8}
        >
            <Text style={{ fontSize: 24, fontWeight: "bold", color: '#fff' }}>
                {weather.location?.name || weather.name}
            </Text>

            <Text style={{ fontSize: 60, fontWeight: "bold", color: '#fff', marginVertical: 10 }}>
                {formatTemp(weather.main.temp)}°{unit}
            </Text>

            <Text style={{ fontSize: 18, fontStyle: "italic" }}>
                {weather.weather[0].description}
            </Text>
        </Container>
    );
}
