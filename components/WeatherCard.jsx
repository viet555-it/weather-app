import { Text, Image, View } from 'react-native';

export default function WeatherCard({ weather }) {
    return (
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
    );
}