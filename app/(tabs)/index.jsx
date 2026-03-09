import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';

export default function HomeScreen() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const handleSearch = async () => {
    // Implement search functionality here
    const apiKey = "5113d67fadd0ac2527e1aa642108a802";

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log(data);

      setWeather(data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
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

      {weather && (
        <View style={{ marginTop: 20 }}>
          <Text>City: {weather.name}</Text>
          <Text>Temperature: {weather.main.temp} °C</Text>
          <Text>Weather: {weather.weather[0].description}</Text>
        </View>
      )}
    </View>
  )
}