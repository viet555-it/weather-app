import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DetailRow({ label, value, icon }) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={icon} size={22} color="rgba(255,255,255,0.8)" style={{ marginRight: 12 }} />
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: '500' }}>{label}</Text>
            </View>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>{value}</Text>
        </View>
    );
}
