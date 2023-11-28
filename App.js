import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import StartScreen from './components/StartScreen/StartScreen';
import ChatScreen from './components/ChatScreen/ChatScreen';

//Create the Navigator
const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='Screen1'
            >
                <Stack.Screen
                    name='StartScreen'
                    component={StartScreen}
                />

                <Stack.Screen
                    name='ChatScreen'
                    component={ChatScreen}
                />

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;

