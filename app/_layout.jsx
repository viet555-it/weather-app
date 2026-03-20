import { Stack } from "expo-router";
import { UnitProvider } from "../context/UnitContext";

export default function Layout() {
    return (
        <UnitProvider>
            <Stack>
                <Stack.Screen name="index" options={{ headerShown: false }} />
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
        </UnitProvider>
    );
}
