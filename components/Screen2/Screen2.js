import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { PropTypes } from 'prop-types';
import { useEffect } from 'react';

const Screen2 = ({route, navigation}) => {

    const { name } = route.params;

    useEffect(() => {
        navigation.setOptions({ title: name});
    }, []);

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

Screen2.propTypes = {
    route: PropTypes.shape({
        params: PropTypes.object.isRequired,
    }).isRequired,
    navigation: PropTypes.shape({
        setOptions: PropTypes.func.isRequired,
    }).isRequired
};

export default Screen2;