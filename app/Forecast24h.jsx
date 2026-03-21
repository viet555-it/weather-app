import { useLocalSearchParams, useRouter } from "expo-router";
import { View, TouchableOpacity, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import BackgroundImage from "../components/BackgroundImage";
import Forecast24hWidget from "../components/Forecast24hWidget";

export default function Forecast24hScreen() {
    const params = useLocalSearchParams();
    const router = useRouter();

    const weather = params.weatherData ? JSON.parse(params.weatherData) : null;
    const lat = Number(params.lat);
    const lon = Number(params.lon);
    const city = params.city;

    return (
        <BackgroundImage weather={weather}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity 
                        onPress={() => router.back()} 
                        style={{ paddingHorizontal: 20, marginBottom: 20, marginTop: 10 }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    {lat && lon ? (
                        <Forecast24hWidget lat={lat} lon={lon} city={city} />
                    ) : null}
                </View>
            </SafeAreaView>
        </BackgroundImage>
    );
}

