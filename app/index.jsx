import { useState } from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import BackgroundImage from "../components/BackgroundImage";
import CityPromptModal from "../components/CityPromptModal";
import Loading from "../components/Loading";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";

import { fetchWeather } from "../services/weatherService";

export default function HomeScreen() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showCityPrompt, setShowCityPrompt] = useState(true);

    // Search function to fetch weather data based on city input
    const handleSearch = async () => {
        if (!city.trim()) {
            Alert.alert("Input Error", "Please enter a city name.");
            return false;
        }

        try {
            setLoading(true);

            const data = await fetchWeather(city);

            if (data.cod !== 200) {
                Alert.alert("City not found", "Please try another city");

                setWeather(null);
                return false;
            }

            setWeather(data);
            setCity("");
            return true;
        } catch (error) {
            Alert.alert("Network Error", "Something went wrong");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Handle the initial prompt when app loads
    const handlePromptSubmit = async () => {
        const success = await handleSearch();
        if (success) {
            setShowCityPrompt(false);
        }
    };

    return (
        <BackgroundImage weather={weather}>
            <CityPromptModal
                visible={showCityPrompt}
                city={city}
                setCity={setCity}
                onSubmit={handlePromptSubmit}
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
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <View style={{ alignItems: "center" }}>
                                <Text
                                    style={{ fontSize: 22, marginBottom: 20 }}
                                >
                                    Weather App
                                </Text>

                                <SearchBar
                                    city={city}
                                    setCity={setCity}
                                    onSearch={handleSearch}
                                />

                                {loading && <Loading />}

                                {!loading && weather && (
                                    <WeatherCard weather={weather} />
                                )}
                            </View>
                        </ScrollView>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </BackgroundImage>
    );
}
