import React from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView} from 'react-native';
import { PropTypes } from 'prop-types';
import { useEffect } from 'react';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';

import { contrastText, changeAlpha } from '../../color-library';
import { useState } from 'react';

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

const ChatScreen = ({route, navigation}) => {

    const { name, themeColor } = route.params;
    const [messages, setMessages] = useState([]);

    const onSend = (newMessages) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
    };

    useEffect(() => {
        //Set the Title to the users' name
        navigation.setOptions({ title: name });

        //Test message
        setMessages([
            {
                _id:1,
                text: 'Hello Dev',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'http://placeimg.com/140/140/any',
                },
            },
            {
                _id:2,
                text: 'This is a system message',
                createdAt: new Date(),
                system: true,
            },
        ]);

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