import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({ city, setCity, onSearch }) {
    return (
        <View style={styles.container}>
            <View style={styles.searchSection}>
                <TouchableOpacity onPress={onSearch}>
                    <Ionicons 
                        name="search" 
                        size={20} 
                        color="rgba(255,255,255,0.6)" 
                        style={styles.searchIcon} 
                    />
                </TouchableOpacity>
                <TextInput
                    placeholder="Search for a city..."
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    value={city}
                    onChangeText={setCity}
                    onSubmitEditing={onSearch}
                    returnKeyType="search"
                    style={styles.input}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 20,
        marginVertical: 15,
    },
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 50,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        paddingVertical: 10,
    },
});