import { useState } from "react";
import { Alert, Button, Keyboard, Modal, Platform, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";

const showAlert = (title, message) => {
    if (Platform.OS === "web") {
        alert(`${title}: ${message}`);
    } else {
        Alert.alert(title, message);
    }
};

export default function CityPromptModal({
    visible,
    city,
    setCity,
    onSearch,
    onSuccess,
    onCancel,
}) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!city.trim()) {
            showAlert("Input Error", "Please enter a city name.");
            return;
        }

        try {
            setLoading(true);
            const data = await onSearch(city);

            if (!data) {
                return;
            }

            setCity("");
            onSuccess();
        } catch (error) {
            showAlert("Error", "An unexpected error occurred.");
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0,0,0,0.4)",
                    }}
                >
                    <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
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
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}
