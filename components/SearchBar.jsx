import { View, TextInput, KeyBoardAvoidingView, Platform, Button } from 'react-native';

export default function SearchBar ({ city, setCity, onSearch }) {

    return (
        <View>
            <TextInput
                placeholder="Enter city name"
                value={city}
                onChangeText={setCity}
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, width: '80%', marginBottom: 10, paddingHorizontal: 10 }}
            />

            <Button title="Search" onPress={onSearch} />
        </View>
    );
}