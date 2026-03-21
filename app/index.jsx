import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    View,
} from "react-native";

import BackgroundImage from "../components/BackgroundImage";
import CityPromptModal from "../components/CityPromptModal";
import Loading from "../components/Loading";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import Forecast24hWidget from "../components/Forecast24hWidget";
import Forecast7dWidget from "../components/Forecast7dWidget";

import useWeatherSearch from "../hooks/useWeatherSearch";

import { useUnit } from "../context/UnitContext";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
    const { unit, toggleUnit } = useUnit();
    const router = useRouter();
    const [city, setCity] = useState("");
    const [showCityPrompt, setShowCityPrompt] = useState(true);

    const { weather, loading, search } = useWeatherSearch();

    const handlePromptSuccess = () => {
        setShowCityPrompt(false);
    };

    return (
        <BackgroundImage weather={weather}>
            <CityPromptModal
                visible={showCityPrompt}
                city={city}
                setCity={setCity}
                onSearch={search}
                onSuccess={handlePromptSuccess}
                onCancel={() => setShowCityPrompt(false)}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <ScrollView
                            contentContainerStyle={{
                                flexGrow: 1,
                                alignItems: "center",
                            }}
                        >
                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, marginTop: 10 }}>
                                <TouchableOpacity 
                                    onPress={toggleUnit}
                                    style={{ 
                                        backgroundColor: 'rgba(255,255,255,0.2)', 
                                        paddingHorizontal: 15, 
                                        paddingVertical: 8, 
                                        borderRadius: 20,
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
                                        °{unit}
                                    </Text>
                                    <Ionicons name="swap-horizontal" size={16} color="#fff" style={{ marginLeft: 8 }} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ alignItems: "center", width: '100%' }}>
                                <SearchBar
                                    city={city}
                                    setCity={setCity}
                                    onSearch={async () => {
                                        const result = await search(city);
                                        if (result) setCity("");
                                    }}
                                />

                                {loading && <Loading />}

                                {!loading && weather && (
                                    <>
                                        <WeatherCard
                                            weather={weather}
                                            onPress={() =>
                                                router.push({
                                                    pathname: "/WeatherDetail",
                                                    params: {
                                                        city: weather.location?.name || weather.name,
                                                    },
                                                })
                                            }
                                        />

                                        <Forecast24hWidget
                                            lat={weather.coord.lat}
                                            lon={weather.coord.lon}
                                            city={weather.location?.name || weather.name}
                                        />

                                        <Forecast7dWidget
                                            lat={weather.coord.lat}
                                            lon={weather.coord.lon}
                                            city={weather.location?.name || weather.name}
                                        />
                                    </>
                                )}
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </BackgroundImage>
    );
}
