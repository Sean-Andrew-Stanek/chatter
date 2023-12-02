
////#################/
///##   imports   ##/
//#################/

import React from 'react';
import { StyleSheet, View, Text, Platform, KeyboardAvoidingView} from 'react-native';
import { PropTypes } from 'prop-types';
import { useEffect, useState } from 'react';
import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { collection, orderBy, addDoc, onSnapshot, query, } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { contrastText, changeAlpha } from '../../color-library';
import CustomActions from '../CustomActions/CustomActions';

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

const ChatScreen = ({isConnected, database, route, navigation}) => {
    
    ////#################/
    ///##   States   ###/
    //#################/


    const { userID, name, themeColor } = route.params;
    const [messages, setMessages] = useState([]);

    ////#################/
    ///##  Functions ###/
    //#################/
    
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
            return <InputToolbar {...props} />;
        else
            return null;
    };

    const renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };

    //When text message is sent
    const onSend = (newMessages) => {
        /* setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages)); */
        console.log('New Message id ' + newMessages[0].user._id);
        addDoc(collection(database, firebaseDBName), newMessages[0]);
    };

    //This will temporarily delete the cache
    //NOTE:  The data is only locally deleted and
    //will be refreshed on message sent or when
    //moving from offline -> online
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
        <View style={[styles.rootContainer, {backgroundColor: themeColor}]}>
            <GiftedChat
                style={{flex:1}}
                messages={messages}
                renderBubble={(props) => renderBubble(props, themeColor)}
                renderInputToolbar={(props) => renderInputToolbar(props)}
                renderActions={renderCustomActions}
                onSend={messages => onSend(messages)}
                user={{
                    _id: userID,
                    name: name
                }}
            />
            
            {/* <TouchableOpacity
                style={[{height:'10%', backgroundColor: changeAlpha(themeColor, .5)}]}
                onPress={}
            >

            </TouchableOpacity> */}

            <View
                style={[{height:'5%', backgroundColor: changeAlpha(themeColor, .5)}]}
            >
                <Text style={{color:contrastText(themeColor)}}>
                    Network Status: {isConnected?'Online':'Offline'}
                </Text>
            </View>



            
            {Platform.OS === 'android' ? <KeyboardAvoidingView behavior='height' />: null}
            {Platform.OS === 'ios' ? <KeyboardAvoidingView behavior='padding' />: null}
        </View>
    );
};

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
    },
    photoButton: {
        height: '10%',
        width: '50%',
        justifyContent: 'center',
    },
});

////#################/
///##  PropTypes  ##/
//#################/
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