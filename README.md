# Modern Weather App 🌤️

A beautiful, premium, and fully-featured weather application built with React Native and Expo. It provides real-time weather data, 24-hour and 7-day forecasts, all wrapped in a modern UI with dynamic backgrounds that react to the current weather and time of day.

## ✨ Features

- **Real-time Weather:** Current temperature, feels like, humidity, wind speed, visibility, and pressure.
- **Dynamic Backgrounds:** The app's background automatically updates to reflect the current weather conditions (e.g., sunny, rainy, cloudy, snowy) and time of day (day/night).
- **Unit Toggling:** Seamlessly switch between Celsius (°C) and Fahrenheit (°F) with a single tap. The entire app remembers and updates based on your preference.
- **Search Functionality:** A sleek search bar to quickly find the weather in any city around the world, complete with error handling for invalid locations.
- **Detailed Forecasts:** 
  - **24-Hour Forecast:** Horizontal scrolling timeline of upcoming weather changes.
  - **7-Day Forecast:** Detailed day-by-day breakdown with high/low temperatures.
- **Premium UI/UX:** Styled with glassmorphism effects, shadows, custom vector icons, and a highly polished layout using `SafeAreaView` for a truly native feel on both iOS and Android.

## 🛠 Tech Stack

- **Framework:** React Native + [Expo](https://expo.dev)
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Icons:** `@expo/vector-icons` (Ionicons)
- **API:** [OpenWeatherMap API](https://openweathermap.org/api)

## 📁 Project Structure

The project has been carefully architected for readability and scalability:

```text
weather-app/
├── app/                  # Expo Router screens (Pages)
│   ├── index.jsx         # Homepage (Current weather + widgets)
│   ├── WeatherDetail.jsx # Detailed stats screen (Sunrise/sunset, etc.)
│   ├── Forecast24h.jsx   # Standalone 24h forecast screen
│   ├── Forecast7d.jsx    # Standalone 7-day forecast screen
│   └── _layout.jsx       # Root layout configuration (Hides default headers)
├── components/           # Reusable UI Components
│   ├── BackgroundImage.jsx   # Dynamic weather background wrapper
│   ├── SearchBar.jsx         # Magnifying glass search input
│   ├── WeatherCard.jsx       # Main summary card on the homepage
│   ├── Forecast24hWidget.jsx # Embedded 24h timeline UI
│   ├── Forecast7dWidget.jsx  # Embedded 7-day list UI
│   ├── DetailRow.jsx         # Reusable row for weather attributes
│   ├── CityPromptModal.jsx   # Initial location prompt on launch
│   └── Loading.jsx           # Loading indicator
├── context/              # Global State
│   └── UnitContext.js    # manages Celsius/Fahrenheit toggle
├── hooks/                # Custom React Hooks
│   └── useWeatherSearch.js # Encapsulates search and loading logic
└── services/             # API & External Integrations
    └── weatherService.js # OpenWeatherMap API fetch calls
```

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- Expo CLI or Expo Go app on your phone.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd weather-app
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. **API Key Setup:**
   Ensure you have configured your OpenWeatherMap API key inside the `services/weatherService.js` file or via an environment variable.

4. Start the development server:
   ```bash
   npx expo start
   ```

5. Open the app:
   - Scan the QR code with your phone's camera (iOS) or the Expo Go app (Android).
   - Press `i` to open in an iOS simulator (requires Xcode).
   - Press `a` to open in an Android emulator (requires Android Studio).

## 💡 Architecture & Design Notes

This project was built with a strong focus on **separation of concerns**:
- **Screens (`app/`)** handle routing parameters, navigation, and top-level layouts.
- **Widgets (`components/`)** handle the actual UI rendering and data consumption.
- **Services (`services/`)** are strictly responsible for network requests.
- **Context (`context/`)** prevents prop-drilling for global settings like Temperature Units.

Enjoy building your day around perfect forecasts! 🌦️
