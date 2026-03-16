import { Text, TouchableOpacity, View } from "react-native";

export default function WeatherCard({ weather, onPress }) {
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            onPress={onPress}
            style={{ marginTop: 20, alignItems: "center" }}
            activeOpacity={0.8}
        >
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                {weather.name}
            </Text>

            <Text style={{ fontSize: 40, fontWeight: "bold" }}>
                {Math.round(weather.main.temp)}°C
            </Text>

            <Text style={{ fontSize: 18, fontStyle: "italic" }}>
                {weather.weather[0].description}
            </Text>
        </Container>
    );
}
