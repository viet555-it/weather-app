import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{ title: "Home" }} />
            <Stack.Screen name="WeatherDetail" options={{ title: "Details" }} />
            <Stack.Screen
                name="Forecast24h"
                options={{ title: "24h Forecast" }}
            />
            <Stack.Screen
                name="Forecast7d"
                options={{ title: "7-day Forecast" }}
            />
        </Stack>
    );
}
