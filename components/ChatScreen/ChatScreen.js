import React from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView} from 'react-native';
import { PropTypes } from 'prop-types';
import { useEffect } from 'react';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { collection, getDocs, addDoc } from 'firebase/firestore';

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

    const { name, themeColor } = route.params;
    const [messages, setMessages] = useState([]);

    const onSend = (newMessages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    };

    const addMessage = async (newList) => {
        const newListRef = await addDoc(collection, "DATABASE NAME", newList);
        if(newListRef.id) {
            Alert.alert(`The list "${listName}" has been added.`);
        }else{
            Alert.alert('Unable to add.  Please try later');
        }
    }

    const fetchMessages = async() => {
        //CHANGE THIS
        const listsDocuments = await getDocs(collection(database, 'nameOfDatabase')) 
        let newList = [];
        //PULLS THIS DATA FROM THE DATABASE
        listsDocuments.forEach(docObject => {
            newLists.push({id:docObject.id, ...docObject.data()})
        });

        setMessages(newList);
    }

    useEffect(() => {
        //Set the Title to the users' name
        navigation.setOptions({ title: name });
    }, []);

    return (
        <View style={[styles.rootContainer, {backgroundColor: themeColor}]}>
            <GiftedChat
                messages={messages}
                renderBubble={(props) => renderBubble(props, themeColor)}
                onSend={messages => onSend(messages)}
                user={{
                    _id:1
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
    route: PropTypes.shape({
        params: PropTypes.object.isRequired,
    }).isRequired,
    navigation: PropTypes.shape({
        setOptions: PropTypes.func.isRequired,
    }).isRequired
};

export default ChatScreen;