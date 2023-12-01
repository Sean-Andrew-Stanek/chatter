import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { disableNetwork, enableNetwork, getFirestore } from 'firebase/firestore';
import { useNetInfo } from '@react-native-community/netinfo';
import { Alert } from 'react-native';

//Recommended by Firebase
//import { getAnalytics } from 'firebase/analytics';

import StartScreen from './components/StartScreen/StartScreen';
import ChatScreen from './components/ChatScreen/ChatScreen';

//Create the Navigator
const Stack = createNativeStackNavigator();

const App = () => {

    // Monitors the online status of the program
    const connectionStatus = useNetInfo();

    useEffect(() => {
        if(connectionStatus.isConnected === false){
            Alert.alert('Connection lost!');
            disableNetwork(database);
        } else if (connectionStatus.isConnected === true) {
            enableNetwork(database);
        }
    }, [connectionStatus.isConnected]);

    useEffect( () => {
        console.log('Connection Status:', connectionStatus);
    }, [connectionStatus.isConnected]);

    const firebaseConfig = {
        apiKey: 'AIzaSyAPVSLWVrAURc3W4cVkSvcOyh6iRCjQDok',
        authDomain: 'chatter-17de2.firebaseapp.com',
        projectId: 'chatter-17de2',
        storageBucket: 'chatter-17de2.appspot.com',
        messagingSenderId: '1014994951167',
        appId: '1:1014994951167:web:d88461dc704b944ef4e5ca',
        measurementId: 'G-7YQZ179XDG'
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    const database = getFirestore(app);

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
                >
                    {props => 
                        <ChatScreen
                            isConnected = {connectionStatus.isConnected}
                            database = {database}
                            {...props}
                        />
                    }
                </Stack.Screen>

            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;



//Recommended by Firebase.  Needs import (above)
//const analytics = getAnalytics(app);