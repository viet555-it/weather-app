import { useState } from "react";
import {
    Alert,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native";

import Loading from "../components/Loading";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";

import { fetchWeather } from "../services/weatherService";

export default function HomeScreen() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);

    // Search function to fetch weather data based on city input
    const handleSearch = async () => {
        if (!city.trim()) {
            Alert.alert("Input Error", "Please enter a city name.");
            return;
        }

        try {
            setLoading(true);

            const data = await fetchWeather(city);

            if (data.cod !== 200) {
                Alert.alert("City not found", "Please try another city");

                setWeather(null);
                return;
            }

            setWeather(data);
            setCity("");
        } catch (error) {
            Alert.alert("Network Error", "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Set background image based on weather condition
    const backgroundImage = (() => {
        const condition = weather?.weather?.[0]?.main;

        switch (condition) {
            case "Rain":
                return require("../assets/images/rain.jpg");
            case "Clouds":
                return require("../assets/images/clouds.jpg");
            case "Snow":
                return require("../assets/images/snow.jpg");
            default:
                return require("../assets/images/clear.jpg");
        }
    })();

    return (
        <ImageBackground
            source={backgroundImage}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
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
        </ImageBackground>
    );
}
