import { useState } from "react";
import {
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

import useWeatherSearch from "../hooks/useWeatherSearch";

export default function HomeScreen() {
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
                                    onSearch={async () => {
                                        const result = await search(city);
                                        if (result) setCity("");
                                    }}
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
