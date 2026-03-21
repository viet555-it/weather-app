import { useLocalSearchParams, useRouter } from "expo-router";
import { View, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import BackgroundImage from "../components/BackgroundImage";
import Forecast7dWidget from "../components/Forecast7dWidget";

export default function Forecast7dScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();

    const weather = params.weatherData ? JSON.parse(params.weatherData) : null;
    const lat = Number(params.lat);
    const lon = Number(params.lon);
    const city = params.city;

    return (
        <BackgroundImage weather={weather}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <TouchableOpacity 
                        onPress={() => router.back()} 
                        style={{ paddingHorizontal: 20, marginBottom: 10, marginTop: 10 }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    {lat && lon ? (
                        <Forecast7dWidget lat={lat} lon={lon} city={city} />
                    ) : null}
                </ScrollView>
            </SafeAreaView>
        </BackgroundImage>
    );
}

