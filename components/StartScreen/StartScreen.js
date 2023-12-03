import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity, Alert, } from 'react-native';
import { PropTypes } from 'prop-types';
import image from '../../assets/perlin.png';
import { getAuth, signInAnonymously } from 'firebase/auth';

import { contrastText, changeAlpha } from '../../color-library';

const StartScreen = ({navigation}) => {

    const auth = getAuth();

    const [name, setName] = useState('');
    const [themeColor, setThemeColor] = useState('rgba(100, 0, 0, 1)');
    const [contrastTheme, setContrastTheme] = useState(contrastText(themeColor));

    const colorOptions = ['rgba(255, 255, 255, 1)', 'rgba(100, 255, 150, 1)', 'rgba(100,0,100, 1)', 'rgba(100,0,0,1)', 'rgba(25,25,25,1)'];

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
        setContrastTheme(contrastText(themeColor));
    }, [themeColor]);

    return (
        <ImageBackground source = {image} resizeMode='cover' style={styles.container}>
            <View style={[styles.container, {flex:1, backgroundColor:changeAlpha(themeColor, .1)}]}>
                {
                    //LOGIN CONTAINER
                }
                <View style={[styles.loginContainer, {backgroundColor: changeAlpha(themeColor, 0.8)}]}> 
                    {
                        //USERNAME INPUT
                    }
                    <TextInput
                        style={[styles.textInput, styles.loginItem, {fontSize: 20, backgroundColor: changeAlpha(contrastTheme, .1), color:contrastTheme, borderColor:contrastTheme}]}
                        value={name}
                        onChangeText={setName}
                        placeholder='Type your username here'
                        placeholderTextColor={changeAlpha(contrastTheme, .6)}
                    />
                    {
                        //BACKGROUND COLOR SELECTOR
                    }
                    <View
                        style={[styles.loginItem, {paddingTop:0, paddingBottom:0, alignItems:'center', justifyContent:'center'}]}
                    >
                        {
                            //COLOR SELECTION LABEL
                        }
                        <Text style={[styles.backgroundColorSelectorLabel, {color: contrastTheme}]}>
                            Choose Background Color:
                        </Text>
                        {
                            //COLOR SELECTION BUTTONS
                            //Reads from array above and dynamically creates buttons
                        }
                        <View style={[styles.backgroundColorSelectorContainer]}>
                            {colorOptions.map((color, index) => (
                                <TouchableOpacity
                                    accessible={true}
                                    accessibilityLabel='Select color'
                                    accessibilityHint='Toggle theme color'
                                    accessibilityRole='button'
                                    key={index}
                                    //It would be nice to create an average color function for the border
                                    style={[styles.backgroundColorSelector, {backgroundColor: color, borderColor: changeAlpha(contrastTheme, .7)}]}
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
                        style={[styles.loginItem, styles.loginButton, {backgroundColor: changeAlpha(contrastText(contrastTheme), .4), borderColor: contrastTheme}]}
                        onPress={signInUser}
                    >
                        <Text 
                            style={[styles.loginButtonText, {color:contrastTheme, fontSize: 20}]}
                        >
                            Start Chatting
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundColorSelectorLabel: {
        paddingBottom: 5,
        width:'100%',
        textAlign: 'center',
        textAlignVertical:'center',
        fontSize:20,
        marginVertical:0,
    },
    backgroundColorSelectorContainer: {
        width: '100%',
        flex:1, 
        flexDirection:'row',
        justifyContent: 'space-evenly'
    },
    backgroundColorSelector: {
        //DEBUG COLOR
        backgroundColor: 'rgba(0,255,0,1)',
        height: '90%',
        aspectRatio: 1,
        borderRadius: 100,
        margin: 5,
        borderWidth: 2,
    },
    highlight: {
        backgroundColor: 'rgba(255,255,255,0.3)'
    },
    loginContainer: {
        width: '88%',
        height: '44%',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 25,

    },
    loginButton: {
        backgroundColor: 'rgba(0,255,0,.8)',
        borderWidth: 2,
        borderRadius: 25,
        width: '60%'
    },
    loginButtonText: {
        color: 'rgba(0,255,0,.8)',
        fontSize: 20,
    },
    loginItem: {
        flex: 1,
        width: '88%',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5
    },
    textInput: {
        padding: 15,
        borderWidth: 1,
        marginTop: 15,
        marginBottom: 0,
        borderRadius: 25,
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