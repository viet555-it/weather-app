import { View, Text, KeyBoardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import { useState } from 'react';

import SearchBar from '../components/SearchBar';
import WeatherCard from '../components/WeatherCard';
import Loading from '../components/Loading';
import ErroeMessage from '../components/ErrorMessage';

import { fetchWeather } from '../services/weatherService';

export default function HomeScreen() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    // Implement search functionality here
    try {
      setLoading(true);
      setError(null);

      const data = await fetchWeather(city)

      if (data.cod !== 200) {
        setError("City not found. Please try again.");
        setWeather(null);
        return;
      }

      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  }

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
              alignItems: "center"
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

              {error && <ErrorMessage message={error} />}

              {!loading && weather && <WeatherCard weather={weather} />}

            </View>

          </ScrollView>

        </TouchableWithoutFeedback>

      </KeyboardAvoidingView>

    </SafeAreaView>

    );
}