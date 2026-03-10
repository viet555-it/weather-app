import { View, Text, TextInput, Button, Image } from 'react-native';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';

export default function HomeScreen() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    // Implement search functionality here
    const apiKey = "5113d67fadd0ac2527e1aa642108a802";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url);
      const data = await response.json();

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
      <TextInput
        placeholder="Enter city name"
        value={city}
        onChangeText={setCity}
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: '80%', marginBottom: 10, paddingHorizontal: 10 }}
      />

      <Button title="Search" onPress={handleSearch} />

      {loading && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}

      {error && (
        <Text style={{ color: "red", marginTop: 10 }}>
          {error}
        </Text>
      )}

      {!loading && weather && (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {weather.name}
          </Text>

          <Image
            source={{
              uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
            }}
            style={{ width: 100, height: 100 }}
          />
          
          <Text style={{ fontSize: 40, fontWeight: "bold" }}>
            {Math.round(weather.main.temp)}°C
          </Text>
          <Text style={{ fontSize: 18, fontStyle: "italic" }}>
            {weather.weather[0].description}
          </Text>
        </View>
      )}
    </View>
  )
}