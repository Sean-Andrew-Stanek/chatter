
////#################/
///##   imports   ##/
//#################/

import React from 'react';
import { StyleSheet, View, Text, ImageBackground, Platform, KeyboardAvoidingView} from 'react-native';
import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';
import { Bubble, GiftedChat, Send, InputToolbar } from 'react-native-gifted-chat';
import { collection, orderBy, addDoc, onSnapshot, query, } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { contrastText, changeAlpha } from '../../color-library';
import CustomActions from '../CustomActions/CustomActions';
import MapView from 'react-native-maps';
import image from '../../assets/perlin.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//For Testing and Debug Alerts
//import { Alert } from 'react-native';

////#################/
///##   Globals   ##/
//#################/

//AsyncStorage Database Key
const asyncDBKey = 'Messages';

//Firebase Database Name
const firebaseDBName = 'Messages';

////#################/
///##    MAIN     ##/
//#################/

const ChatScreen = ({isConnected, database, storage, route, navigation}) => {
    
    ////#################/
    ///##   States   ###/
    //#################/


    const { userID, name, themeColor } = route.params;
    const [messages, setMessages] = useState([]);
    const contrastTheme = contrastText(themeColor);

    ////#################/
    ///##  Functions ###/
    //#################/

    
    const renderCustomView = (props) => {
        // eslint-disable-next-line react/prop-types
        const { currentMessage } = props;
        // eslint-disable-next-line react/prop-types
        if(currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin:3
                    }}
                    region={{
                        // eslint-disable-next-line react/prop-types
                        latitude: currentMessage.location.latitude,
                        // eslint-disable-next-line react/prop-types
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421
                    }}
                />
            );
        }

    };
    
    //Chat Bubbles
    const renderBubble = (props, themeColor) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: changeAlpha(contrastText(themeColor), .1),
                        
                    },
                    left: {
                        backgroundColor: changeAlpha(contrastText(themeColor), .7),
                    }
                }}
                textStyle={{
                    right: {
                        color: contrastText(themeColor),
                    },
                    left: {
                        color: themeColor,
                    }
                }}
            />
        );
    };

    //Disables the input bar when offline
    const renderInputToolbar = (props) => {
        if(isConnected)
            
            return (
                <InputToolbar 
                    containerStyle = {{backgroundColor: 'rgba(255,255,255,.5)', color: contrastTheme}}
                    primaryStyle = {{color: contrastTheme}}
                    {...props}
                    

                />
            );
        else
            return null;
    };

    const renderCustomActions = (props) => {
        return (
            <CustomActions 
                storage = {storage} 
                {...props} 
                userID = {userID}
                themeColor = {themeColor}
            />
        );
    };

    //When text message is sent
    const onSend = (newMessages) => {
        console.log(newMessages);
        addDoc(collection(database, firebaseDBName), newMessages[0]);
    };

    //This will temporarily delete the cache
    //NOTE:  The data is only locally deleted and
    //will be refreshed on message sent or when
    //moving from offline -> online
    /*const eraseDatabase = () => {
        AsyncStorage.removeItem(asyncDBKey);
        setMessages([]);
    }; */

    //Store for when the user is offline
    const cacheDatabase = async(dataToBase) => {
        try { 
            await AsyncStorage.setItem(asyncDBKey, JSON.stringify(dataToBase));
        } catch (error) {
            console.log(error.message);
        }
    };
    
    //Load data from cached data when offline
    const loadCachedDatabase = async () => {
        const cacheDatabase = await AsyncStorage.getItem(asyncDBKey) || [];
        if(cacheDatabase !== null)
            setMessages(JSON.parse(cacheDatabase));
        else    
            console.log('No cached data found.');
    };


    /* const placeHolderFunct = () => {
        Alert.alert('Under construction.');
        return null;
    } */

    ////#################/
    ///##  useEffects ##/
    //#################/

    //LOAD DATABASE
    useEffect(() => {
        console.log(MaterialCommunityIcons);
        //Set the Title to the users' name
        navigation.setOptions({ title: name });

        //Our callback to unsub to avoid MemLeaks
        let unsubMessages;

        if(isConnected){

            //If there is already a listener, remove it
            if(unsubMessages)
                unsubMessages();
            unsubMessages = null;

            //Desired query
            //collection(localDatabase, firebaseDB)
            const targetQuery = query(collection(database, firebaseDBName), orderBy('createdAt', 'desc'));
            
            //Callback to unsub onSnapshot
            unsubMessages = 
                onSnapshot(targetQuery, (messagesSnapshot) => {
                    let newMessages = [];
                    //PULLS THIS DATA FROM THE DATABASE
                    messagesSnapshot.forEach(docObject => {
                        newMessages.push({
                            _id:docObject._id, 
                            ...docObject.data(),
                            createdAt: new Date(docObject.data().createdAt.toMillis())});
                    });
                    //Store for offline use
                    cacheDatabase(newMessages);
                    setMessages(newMessages);
                });
        } else {
            loadCachedDatabase();
        }

        return () => {
            if(unsubMessages)
                unsubMessages();
        };

    }, [isConnected]);


    ////#################/
    ///##    return   ##/
    //#################/   

    return (
        <ImageBackground source = {image} resizeMode='cover' style={[styles.container]}>
            <View style={[styles.container, {backgroundColor: changeAlpha(themeColor, .8)}]}>
                <View
                    style={[{height:20, backgroundColor: changeAlpha(themeColor, .5)}]}
                >
                    <Text style={{color:contrastText(themeColor)}}>
                        Network Status: {isConnected?'Online':'Offline'}
                    </Text>
                </View>

                <GiftedChat
                    style={[styles.giftedChat, {backgroundColor: changeAlpha(contrastText(themeColor), .8)}]}
                    messages={messages}
                    renderBubble={(props) => renderBubble(props, themeColor)}
                    renderInputToolbar={(props) => renderInputToolbar(props)}
                    onSend={messages => onSend(messages)}
                    renderActions={renderCustomActions}
                    renderCustomView={renderCustomView}
                    alwaysShowSend


                    
                    user={{
                        _id: userID,
                        name: name
                    }}
                />
                {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
});

////#################/
///##  PropTypes  ##/
//#################/
ChatScreen.propTypes = {
    database: PropTypes.shape({
    }).isRequired,
    storage: PropTypes.shape({
    }).isRequired,
    route: PropTypes.shape({
        params: PropTypes.object.isRequired,
    }).isRequired,
    navigation: PropTypes.shape({
        setOptions: PropTypes.func.isRequired,
    }).isRequired,
    isConnected: PropTypes.bool.isRequired,
};

export default ChatScreen;