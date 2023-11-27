import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { PropTypes } from 'prop-types';

const Screen1 = ({navigation}) => {
    return (
        <View style={styles.container}>
            <Text>My name is Screen1</Text>
            <Button
                title='Go to Screen 2'
                onPress={() => navigation.navigate('Screen2')}
            />
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

Screen1.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,
};

export default Screen1;