import { Button, Modal, Text, TextInput, View } from "react-native";

export default function CityPromptModal({
    visible,
    city,
    setCity,
    onSubmit,
    onCancel,
}) {
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
                        onSubmitEditing={onSubmit}
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
                        <Button title="Cancel" onPress={onCancel} />
                        <Button title="Go" onPress={onSubmit} />
                    </View>
                </View>
            </View>
        </Modal>
    );
}
