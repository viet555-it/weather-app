import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';

export default function HomeScreen() {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    // Implement search functionality here
    console.log(`Searching for weather in ${city}`);
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
    </View>
  )
}