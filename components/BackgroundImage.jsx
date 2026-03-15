import { ImageBackground } from "react-native";

export default function BackgroundImage({ weather, children }) {
  const backgroundImage = (() => {
    if (!weather) return require("../assets/images/clear.jpg");

    const { dt, sys, weather: weatherArr = [] } = weather;
    const sunrise = sys?.sunrise;
    const sunset = sys?.sunset;

    const isNight =
      typeof dt === "number" &&
      typeof sunrise === "number" &&
      typeof sunset === "number"
        ? dt < sunrise || dt > sunset
        : (weatherArr[0]?.icon ?? "").endsWith("n");

    const condition = weatherArr[0]?.main;

    if (isNight) {
      switch (condition) {
        case "Rain":
          return require("../assets/images/night_rain.jpg");
        case "Clouds":
          return require("../assets/images/night_clouds.jpg");
        case "Snow":
          return require("../assets/images/night_snow.jpg");
        default:
          return require("../assets/images/night.jpg");
      }
    }

    switch (condition) {
      case "Rain":
        return require("../assets/images/rain.jpg");
      case "Clouds":
        return require("../assets/images/clouds.jpg");
      case "Snow":
        return require("../assets/images/snow.jpg");
      default:
        return require("../assets/images/clear.jpg");
    }
  })();

  return (
    <ImageBackground source={backgroundImage} style={{ flex: 1 }} resizeMode="cover">
      {children}
    </ImageBackground>
  );
}