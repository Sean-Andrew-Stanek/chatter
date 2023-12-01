import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, KeyboardAvoidingView} from 'react-native';
import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { collection, orderBy, addDoc, onSnapshot, query, } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { contrastText, changeAlpha } from '../../color-library';

//AsyncStorage Database Key
const asyncDBKey = 'Messages';

//Firebase Database Name
const firebaseDBName = 'Messages';

//Main Component
const ChatScreen = ({isConnected, database, route, navigation}) => {

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
    const renderInputToolbar = (props) =>
    {
        if(isConnected)
            return <InputToolbar {...props} />;
        else
            return null;
    };

    const { userID, name, themeColor } = route.params;
    const [messages, setMessages] = useState([]);
    console.log(userID + "is the userid")
    const onSend = (newMessages) => {
        /* setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages)); */
        console.log('New Message id ' + newMessages[0].user._id);
        addDoc(collection(database, firebaseDBName), newMessages[0]);
    };

    const eraseDatabase = () => {
        AsyncStorage.removeItem(asyncDBKey);
        setMessages([]);
    };

    //Store for when the user is offline
    const cacheDatabase = async(dataToBase) => {
        try { 
            await AsyncStorage.setItem(asyncDBKey, JSON.stringify(dataToBase));
        } catch (error) {
            console.log(error.message);
        }
    };
    
    const loadCachedDatabase = async () => {
        const cacheDatabase = await AsyncStorage.getItem(asyncDBKey) || [];
        if(cacheDatabase !== null)
            setMessages(JSON.parse(cacheDatabase));
        else    
            console.log('No cached data found.');
    };

    //LOAD DATABASE
    useEffect(() => {

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

    return (
        <View style={[styles.rootContainer, {backgroundColor: themeColor}]}>
            <GiftedChat
                messages={messages}
                renderBubble={(props) => renderBubble(props, themeColor)}
                renderInputToolbar={(props) => renderInputToolbar(props)}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: name
                }}
            />
            
            <TouchableOpacity
                style={[{backgroundColor: changeAlpha(themeColor, .5)}]}
                onPress={eraseDatabase}
            >
                <Text style={{color:contrastText(themeColor)}}>
                    Erase All Data - Network Status {isConnected?'Online':'Offline'}
                </Text>
            </TouchableOpacity>

            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' />: null}
            {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior='padding' />: null}
        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
    }
});

ChatScreen.propTypes = {
    database: PropTypes.shape({
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