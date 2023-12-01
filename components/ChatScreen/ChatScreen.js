import React from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView} from 'react-native';
import { PropTypes } from 'prop-types';
import { useEffect } from 'react';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { collection, orderBy, addDoc, onSnapshot, query, } from 'firebase/firestore';
import { AsyncStorage } from '@react-native-async-storage/async-storage';
import { contrastText, changeAlpha } from '../../color-library';
import { useState } from 'react';




//Main Component
const ChatScreen = ({isConnected, database, route, navigation}) => {

    //Chat Bubbles
    const renderBubble = (props, themeColor) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: changeAlpha(contrastText(themeColor), .2),
                    },
                    left: {
                        backgroundColor: changeAlpha(contrastText(themeColor), .8),
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

    //AsyncStorage Database Key
    let asyncDBKey = 'Messages';

    //Firebase Database Name
    let firebaseDBName = 'Messages';

    const { userID, name, themeColor } = route.params;
    const [messages, setMessages] = useState([]);

    const onSend = (newMessages) => {
        /* setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages)); */
        addDoc(collection(database, firebaseDBName), newMessages[0]);
    };

    //Store for when the user is offline
    const cacheDatabase = async(dataToBase) => {
        try { 
            await AsyncStorage.setItem('Messages', JSON.stringify(dataToBase));
        } catch (error) {
            console.log(error.message);
        }
    };
    
    const loadCachedDatabase = async () => {
        const cacheDatabase = await AsyncStorage.getItem(asyncDBKey) || [];
        setMessages(JSON.parse(cacheDatabase));
    };

    //LOAD DATABASE
    useEffect(() => {
        try{
            //Set the Title to the users' name
            navigation.setOptions({ title: name });

            //Our callback to unsub to avoid MemLeaks
            let unsubMessages;

            if(isConnected === true){

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
                                id:docObject.id, 
                                ...docObject.data(),
                                createdAt: new Date(docObject.data().createdAt.toMillis())});
                        });
                        //Store for offline use
                        cacheDatabase(newMessages);
                        setMessages(newMessages);
                    });
            } else loadCachedDatabase();

            return () => {
                if(unsubMessages)
                    unsubMessages();
            };
        } catch(error) {
            console.error('Error in useEffect:', error);
        }
    }, [isConnected]);

    return (
        <View style={[styles.rootContainer, {backgroundColor: themeColor}]}>
            <GiftedChat
                messages={messages}
                renderBubble={(props) => renderBubble(props, themeColor)}
                renderInputToolbar={(props) => renderInputToolbar(props)}
                onSend={messages => onSend(messages)}
                user={{
                    _id: {userID},
                    name: name
                }}
            />
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