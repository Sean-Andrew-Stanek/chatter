import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'
//Recommended by Firebase
//import { getAnalytics } from "firebase/analytics";

import StartScreen from './components/StartScreen/StartScreen';
import ChatScreen from './components/ChatScreen/ChatScreen';

//Create the Navigator
const Stack = createNativeStackNavigator();

const App = () => {
    const firebaseConfig = {
        apiKey: "AIzaSyAPVSLWVrAURc3W4cVkSvcOyh6iRCjQDok",
        authDomain: "chatter-17de2.firebaseapp.com",
        projectId: "chatter-17de2",
        storageBucket: "chatter-17de2.appspot.com",
        messagingSenderId: "1014994951167",
        appId: "1:1014994951167:web:d88461dc704b944ef4e5ca",
        measurementId: "G-7YQZ179XDG"
    }

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);

    const database = getFirestore(app)

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