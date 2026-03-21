import { Stack } from "expo-router";
import { UnitProvider } from "../context/UnitContext";

export default function Layout() {
    return (
        <UnitProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="WeatherDetail" />
                <Stack.Screen name="Forecast24h" />
                <Stack.Screen name="Forecast7d" />
            </Stack>
        </UnitProvider>
    );
}
