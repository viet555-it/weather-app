import { View, Text } from 'react-native';
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
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Weather App!</Text>

      <SearchBar
        city={city}
        setCity={setCity}
        onSearch={handleSearch}
      />

      {loading && <Loading/>}

      {error && <ErroeMessage message={error} />}

      {!loading && weather && <WeatherCard weather={weather} />}
    </View>
  )
}