import React from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView} from 'react-native';
import { PropTypes } from 'prop-types';
import { useEffect } from 'react';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { collection, orderBy, addDoc, onSnapshot, query, /* where */ } from 'firebase/firestore';

import { contrastText, changeAlpha } from '../../color-library';
import { useState } from 'react';


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


//Main Component
const ChatScreen = ({database, route, navigation}) => {

    const { userID, name, themeColor } = route.params;
    const [messages, setMessages] = useState([]);

    const onSend = (newMessages) => {
        /* setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages)); */
        addDoc(collection(database, 'Messages'), newMessages[0]);
    };


    //LOAD DATABASE
    useEffect(() => {
        try{
            //Set the Title to the users' name
            navigation.setOptions({ title: name });

            //Desired query
            const targetQuery = query(collection(database, 'Messages'), /* where('uid', '==', userID),  */orderBy('createdAt', 'desc'));
            
            //Callback to unsub onSnapshot
            const unsubMessages = 
                onSnapshot(targetQuery, (messagesSnapshot) => {
                    let newMessages = [];
                    //PULLS THIS DATA FROM THE DATABASE
                    messagesSnapshot.forEach(docObject => {
                        newMessages.push({
                            id:docObject.id, 
                            ...docObject.data(),
                            createdAt: new Date(docObject.data().createdAt.toMillis())});
                    });

                    setMessages(newMessages);
                });

            return () => {
                if(unsubMessages)
                    unsubMessages();
            };
        } catch(error) {
            console.error('Error in useEffect:', error);
        }
    }, []);

    return (
        <View style={[styles.rootContainer, {backgroundColor: themeColor}]}>
            <GiftedChat
                messages={messages}
                renderBubble={(props) => renderBubble(props, themeColor)}
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
    }).isRequired
};

export default ChatScreen;