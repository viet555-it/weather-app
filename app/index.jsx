import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
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

    const handleSearch = async () => {
        // Implement search functionality here

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

    return (
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
                            <Text style={{ fontSize: 22, marginBottom: 20 }}>
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
    );
}
