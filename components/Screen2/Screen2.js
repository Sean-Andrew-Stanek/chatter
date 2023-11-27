import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Screen2 = () => {
    return (
        <View style={styles.container}>
            <Text>Welcome to the Second Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Screen2;