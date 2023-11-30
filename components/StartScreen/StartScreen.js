import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity, Alert, } from 'react-native';
import { PropTypes } from 'prop-types';
import image from '../../assets/background.png';
import { getAuth, signInAnonymously } from 'firebase/auth';

import { contrastText, changeAlpha } from '../../color-library';

const StartScreen = ({navigation}) => {

    const auth = getAuth();

    const [name, setName] = useState('');
    const [themeColor, setThemeColor] = useState('rgba(100, 0, 0, 1)');
    const [textColor, setTextColor] = useState(contrastText(themeColor));

    const colorOptions = ['rgba(255, 255, 255, 1)', 'rgba(0, 255, 0, 1)', 'rgba(100,0,100, 1)', 'rgba(0,0,0,1)', 'rgba(25,25,25,1)'];

    const signInUser = () => {
        signInAnonymously(auth)
            .then(result => {
                navigation.navigate('ChatScreen', {userID: result.user.uid, name: name, themeColor: themeColor});
                Alert.alert('Signed in Successfully!');
            }).catch((error) => {
                Alert.alert(`Unable to sign in, try again later: ${error}`);
            });
    };

    useEffect(() => {
        setTextColor(contrastText(themeColor));
    }, [themeColor]);

    return (
        <ImageBackground source = {image} resizeMode='cover' style={styles.container}>
            {
                //LOGIN CONTAINER
            }
            <View style={[styles.loginContainer, {backgroundColor: changeAlpha(themeColor, 0.4)}]}> 
                {
                    //USERNAME INPUT
                }
                <TextInput
                    style={[styles.textInput, styles.loginItem, {color:textColor}]}
                    value={name}
                    onChangeText={setName}
                    placeholder='Type your username here'
                />
                {
                    //BACKGROUND COLOR SELECTOR
                }
                <View
                    style={[styles.loginItem, {paddingTop:0, paddingBottom:0}]}
                >
                    {
                        //COLOR SELECTION LABEL
                    }
                    <Text style={[{color: changeAlpha(themeColor, 1), paddingBottom: 5, width:'100%', textAlignVertical:'center', fontSize:14, textAlign: 'left', marginVertical:0}]}>
                        Choose Background Color:
                    </Text>
                    {
                        //COLOR SELECTION BUTTONS
                        //Reads from array above and dynamically creates buttons
                    }
                    <View style={[styles.backgroundColorSelectorContainer]}>
                        {colorOptions.map((color, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.backgroundColorSelector, {backgroundColor: color}]}
                                onPress={() => setThemeColor(colorOptions[index])}
                            >
                            </TouchableOpacity>
                        ))}
                    </View>

                </View>
                {
                    //NAVIGATION BUTTON
                }
                <TouchableOpacity
                    style={[styles.loginItem, styles.loginButton, {backgroundColor: changeAlpha(themeColor, .5)}]}
                    onPress={signInUser}
                >
                    <Text 
                        style={[styles.loginButtonText, {color:textColor}]}
                    >
                        Start Chatting
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundColorSelectorContainer: {
        width: '100%',
        flex:1, 
        flexDirection:'row',
        justifyContent: 'flex-start'
    },
    backgroundColorSelector: {
        //DEBUG COLOR
        backgroundColor: 'rgba(200,255,200,1)',
        height: '90%',
        aspectRatio: 1,
        borderRadius: 100,
        margin: 5        
    },
    highlight: {
        backgroundColor: 'rgba(255,255,255,0.3)'
    },
    loginContainer: {
        width: '88%',
        height: '44%',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center'

    },
    loginButton: {
        backgroundColor: 'rgba(0,0,0,.8)',
    },
    loginButtonText: {
        color: 'rgba(255,255,255,.8)',
        fontSize: 20,
    },
    loginItem: {
        flex: 1,
        width: '88%',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 15
    },
    textInput: {
        padding: 15,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 15
    },
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        flexDirection: 'column-reverse',
        alignItems: 'center'
    }
});

StartScreen.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,
};

export default StartScreen;