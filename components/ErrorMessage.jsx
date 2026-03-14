import { Text } from "react-native";

export default function ErrorMessage({ message }) {

    return (
        <Text style={{ color: "red", marginTop: 10 }}>
        {message}
        </Text>
    );
}