import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TextInput } from 'react-native';
import { PropTypes } from 'prop-types';

const Screen1 = ({navigation}) => {

    const [name, setName] = useState('');

    return (
        <View style={styles.container}>
            <Text>My name is Screen1</Text>
            <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={setName}
                placeholder='Type your username here'
            />
            <Button
                title='Go to Screen 2'
                onPress={() => navigation.navigate('Screen2', {name: name})}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textInput: {
        width: '90%',
        padding: 15,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 15
    }
});

Screen1.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,
};

export default Screen1;