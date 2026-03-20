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
    View,
} from "react-native";

import BackgroundImage from "../components/BackgroundImage";
import CityPromptModal from "../components/CityPromptModal";
import Loading from "../components/Loading";
import SearchBar from "../components/SearchBar";
import WeatherCard from "../components/WeatherCard";
import Forecast24h from "./Forecast24h";
import Forecast7d from "./Forecast7d";

import useWeatherSearch from "../hooks/useWeatherSearch";

export default function HomeScreen() {
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
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
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

                                        <Forecast24h
                                            lat={weather.coord.lat}
                                            lon={weather.coord.lon}
                                            city={weather.location?.name || weather.name}
                                        />

                                        <Forecast7d
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
