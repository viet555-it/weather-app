import { useState } from "react";
import { Alert, Button, Modal, Text, TextInput, View } from "react-native";

import { fetchWeather } from "../services/weatherService";

export default function CityPromptModal({
    visible,
    city,
    setCity,
    onSuccess,
    onCancel,
}) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!city.trim()) {
            Alert.alert("Input Error", "Please enter a city name.");
            return;
        }

        try {
            setLoading(true);
            const data = await fetchWeather(city);

            if (data.cod !== 200) {
                Alert.alert("City not found", "Please try another city");
                return;
            }

            setCity("");
            onSuccess(data);
        } catch (error) {
            Alert.alert("Network Error", "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onCancel}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(0,0,0,0.4)",
                }}
            >
                <View
                    style={{
                        width: "85%",
                        backgroundColor: "white",
                        borderRadius: 12,
                        padding: 20,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ fontSize: 18, marginBottom: 10 }}>
                        Enter a city to get started
                    </Text>
                    <TextInput
                        placeholder="City name"
                        value={city}
                        onChangeText={setCity}
                        onSubmitEditing={handleSubmit}
                        returnKeyType="done"
                        style={{
                            width: "100%",
                            borderWidth: 1,
                            borderColor: "#ccc",
                            borderRadius: 6,
                            padding: 10,
                            marginBottom: 12,
                        }}
                    />
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "100%",
                        }}
                    >
                        <Button
                            title="Cancel"
                            onPress={onCancel}
                            disabled={loading}
                        />
                        <Button
                            title="Go"
                            onPress={handleSubmit}
                            disabled={loading}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}
